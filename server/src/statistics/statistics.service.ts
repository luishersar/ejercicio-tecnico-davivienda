import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../surveys/entities/survey.entity';
import { Question } from '../surveys/entities/question.entity';
import { Answer } from '../surveys/entities/answer.entity';
import { SurveyResponse } from '../surveys/entities/survey-response.entity';
import { QuestionOption } from '../surveys/entities/question-option.entity';
import {
  SurveyStatisticsDto,
  QuestionStatisticsDto,
  OpenStatistics,
  ScaleStatistics,
  SingleChoiceStatistics,
  MultipleChoiceStatistics,
} from '../statistics/dto/create-statistic.dto';
import { QuestionType } from 'src/common/utils/enums/question-type.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(SurveyResponse)
    private surveyResponseRepository: Repository<SurveyResponse>,
    @InjectRepository(QuestionOption)
    private questionOptionRepository: Repository<QuestionOption>,
  ) {}

  async getSurveyStatistics(
    surveyId: number,
    userId: number,
  ): Promise<SurveyStatisticsDto> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId, userId },
      relations: ['questions'],
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    const totalResponses = await this.surveyResponseRepository.count({
      where: { surveyId },
    });

    const questions = await Promise.all(
      survey.questions.map((q) => this.getQuestionStatistics(q.id)),
    );

    const responseTimeline = await this.getResponseTimeline(surveyId);

    return {
      surveyId: survey.id,
      title: survey.title,
      description: survey.description,
      totalResponses,
      questions,
      responseTimeline,
    };
  }

  async getQuestionStatistics(
    questionId: number,
  ): Promise<QuestionStatisticsDto> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const totalResponses = await this.answerRepository.count({
      where: { questionId },
    });

    let statistics:
      | OpenStatistics
      | ScaleStatistics
      | SingleChoiceStatistics
      | MultipleChoiceStatistics;

    switch (question.type) {
      case QuestionType.OPEN:
        statistics = await this.getOpenStatistics(questionId);
        break;
      case QuestionType.SCALE:
        statistics = await this.getScaleStatistics(questionId);
        break;
      case QuestionType.MULTIPLE_CHOICE_ONE_ANSWER:
        statistics = await this.getSingleChoiceStatistics(questionId);
        break;
      case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER:
        statistics = await this.getMultipleChoiceStatistics(questionId);
        break;
      default:
        throw new Error('Invalid question type');
    }

    return {
      questionId: question.id,
      label: question.label,
      type: this.mapQuestionType(question.type),
      totalResponses,
      statistics,
    };
  }

  private mapQuestionType(
    type: QuestionType,
  ): 'open' | 'scale' | 'single' | 'multiple' {
    switch (type) {
      case QuestionType.OPEN:
        return 'open';
      case QuestionType.SCALE:
        return 'scale';
      case QuestionType.MULTIPLE_CHOICE_ONE_ANSWER:
        return 'single';
      case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER:
        return 'multiple';
      default:
        throw new Error('Invalid question type');
    }
  }

  private async getOpenStatistics(questionId: number): Promise<OpenStatistics> {
    const answers = await this.answerRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.response', 'response')
      .where('answer.questionId = :questionId', { questionId })
      .orderBy('response.createdAt', 'DESC')
      .getMany();

    return {
      responses: answers.map((a) => ({
        value: a.value,
        createdAt: a.response.createdAt,
        sessionInfo: a.response.sessionInfo,
      })),
    };
  }

  private async getScaleStatistics(
    questionId: number,
  ): Promise<ScaleStatistics> {
    const answers = await this.answerRepository.find({
      where: { questionId },
    });

    const values = answers
      .map((a) => parseInt(a.value, 10))
      .filter((v) => !isNaN(v));

    if (values.length === 0) {
      return {
        average: 0,
        median: 0,
        mode: 0,
        distribution: [],
      };
    }

    const average = values.reduce((sum, v) => sum + v, 0) / values.length;

    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    const frequency: { [key: number]: number } = {};
    values.forEach((v) => {
      frequency[v] = (frequency[v] || 0) + 1;
    });

    const mode = parseInt(
      Object.keys(frequency).reduce((a, b) =>
        frequency[parseInt(a)] > frequency[parseInt(b)] ? a : b,
      ),
    );

    const distribution = Array.from({ length: 10 }, (_, i) => {
      const value = i + 1;
      const count = frequency[value] || 0;
      return {
        value,
        count,
        percentage: values.length > 0 ? (count / values.length) * 100 : 0,
      };
    });

    return {
      average: Math.round(average * 100) / 100,
      median,
      mode,
      distribution,
    };
  }

  private async getSingleChoiceStatistics(
    questionId: number,
  ): Promise<SingleChoiceStatistics> {
    const options = await this.questionOptionRepository.find({
      where: {
        question: {
          id: questionId,
        },
      },
    });

    const answers = await this.answerRepository.find({
      where: { questionId },
    });

    const totalAnswers = answers.length;

    const optionStats = options.map((option) => {
      const count = answers.filter((a) => a.value === option.label).length;
      return {
        optionId: option.id,
        label: option.label,
        count,
        percentage: totalAnswers > 0 ? (count / totalAnswers) * 100 : 0,
      };
    });

    return { options: optionStats };
  }

  private async getMultipleChoiceStatistics(
    questionId: number,
  ): Promise<MultipleChoiceStatistics> {
    const options = await this.questionOptionRepository.find({
      where: {
        question: {
          id: questionId,
        },
      },
    });

    const answers = await this.answerRepository.find({
      where: { questionId },
    });

    const totalResponses = answers.length;

    const optionStats = options.map((option) => {
      const count = answers.filter((a: Answer) => {
        try {
          const parsed: unknown = JSON.parse(a.value);
          if (!Array.isArray(parsed)) return false;
          if (!parsed.every((p) => typeof p === 'string')) return false;
          const parsedArray = parsed;
          return parsedArray.includes(option.label);
        } catch {
          return false;
        }
      }).length;

      return {
        optionId: option.id,
        label: option.label,
        count,
        percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
      };
    });

    return {
      options: optionStats,
      totalResponses,
    };
  }

  private async getResponseTimeline(
    surveyId: number,
  ): Promise<Array<{ date: string; count: number }>> {
    const responses: Array<{ date: string; count: string }> =
      await this.surveyResponseRepository
        .createQueryBuilder('response')
        .select('DATE(response.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('response.surveyId = :surveyId', { surveyId })
        .groupBy('DATE(response.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany();

    return responses.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    }));
  }
}
