import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SurveyResponse } from '../entities/survey-response.entity';
import { Answer } from '../entities/answer.entity';
import { Survey } from '../entities/survey.entity';
import { Question, QuestionType } from '../entities/question.entity';
import { SubmitSurveyDTO } from '../dto/submit-survey.dto';
import { QuestionStats } from '../types/question-stats.type';

@Injectable()
export class SurveyAnswerService {
  constructor(
    @InjectRepository(SurveyResponse)
    private surveyResponseRepo: Repository<SurveyResponse>,
    @InjectRepository(Answer)
    private answerRepo: Repository<Answer>,
    @InjectRepository(Survey)
    private surveyRepo: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  private deserializeAnswer(
    answerValue: string,
    questionType: QuestionType,
  ): string | number | string[] {
    switch (questionType) {
      case QuestionType.SCALE:
        return Number(answerValue);

      case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER:
        try {
          return JSON.parse(answerValue) as string[];
        } catch {
          return [];
        }

      default:
        return answerValue;
    }
  }

  async submitSurveyResponse(
    data: SubmitSurveyDTO,
  ): Promise<SurveyResponse | null> {
    const survey = await this.surveyRepo.findOne({
      where: { id: data.surveyId },
    });

    if (!survey) throw new NotFoundException('Encuesta no encontrada');
    if (!survey.active)
      throw new BadRequestException('Encuesta ya no está activa');

    const questionIds = data.responses.map((r) => r.questionId);
    const questions = await this.questionRepo.find({
      where: {
        id: In(questionIds),
        survey: {
          id: survey.id,
        },
        active: true,
      },
    });

    if (questions.length !== questionIds.length)
      throw new BadRequestException('Una o más preguntas no son válidas');

    const surveyResponse = this.surveyResponseRepo.create({
      surveyId: data.surveyId,
      sessionInfo: data.sessionInfo || {},
    });

    const savedResponse = await this.surveyResponseRepo.save(surveyResponse);

    const answers = data.responses.map((response) =>
      this.answerRepo.create({
        responseId: savedResponse.id,
        questionId: response.questionId,
        answerValue: this.serializeAnswer(response.answer),
      }),
    );

    await this.answerRepo.save(answers);

    return await this.surveyResponseRepo.findOne({
      where: { id: savedResponse.id },
      relations: ['answers', 'answers.question'],
    });
  }

  async getSurveyResponses(surveyId: number) {
    const responses = await this.surveyResponseRepo.find({
      where: { surveyId },
      relations: ['answers', 'answers.question'],
      order: { completedAt: 'DESC' },
    });

    return responses.map((response) => ({
      id: response.id,
      surveyId: response.surveyId,
      completedAt: response.completedAt,
      sessionInfo: response.sessionInfo,
      answers: response.answers.map((answer: Answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        questionLabel: answer.question.label,
        questionType: answer.question.type,
        answer: this.deserializeAnswer(
          answer.answerValue,
          answer.question.type,
        ),
      })),
    }));
  }

  async getSurveyStats(surveyId: number) {
    const totalResponses = await this.surveyResponseRepo.count({
      where: { surveyId },
    });

    const questions = await this.questionRepo.find({
      where: {
        survey: {
          id: surveyId,
        },
        active: true,
      },
      relations: ['answers', 'options'],
      order: { id: 'ASC' },
    });

    const stats = questions.map((question) => {
      const answers = question.answers.map((a) =>
        this.deserializeAnswer(a.answerValue, question.type),
      );

      const questionStats: QuestionStats = {
        questionId: question.id,
        questionLabel: question.label,
        questionType: question.type,
        totalAnswers: answers.length,
      };

      switch (question.type) {
        case QuestionType.SCALE: {
          const numericAnswers = answers.filter((a) => typeof a === 'number');

          if (numericAnswers.length > 0) {
            const sum = numericAnswers.reduce((acc, val) => acc + val, 0);
            questionStats.average = parseFloat(
              (sum / numericAnswers.length).toFixed(2),
            );
            questionStats.min = Math.min(...numericAnswers);
            questionStats.max = Math.max(...numericAnswers);

            const distribution: Record<number, number> = {};
            numericAnswers.forEach((val) => {
              distribution[val] = (distribution[val] || 0) + 1;
            });
            questionStats.distribution = Object.entries(distribution).map(
              ([value, count]) => ({
                value: Number(value),
                count,
                percentage: parseFloat(
                  ((count / numericAnswers.length) * 100).toFixed(1),
                ),
              }),
            );
          }
          break;
        }

        case QuestionType.MULTIPLE_CHOICE_ONE_ANSWER: {
          const dist1: Record<string, number> = {};
          answers.forEach((ans) => {
            const key = String(ans);
            dist1[key] = (dist1[key] || 0) + 1;
          });
          questionStats.distribution = Object.entries(dist1).map(
            ([option, count]) => ({
              option,
              count,
              percentage: parseFloat(
                ((count / answers.length) * 100).toFixed(1),
              ),
            }),
          );
          break;
        }

        case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER: {
          const distMulti: Record<string, number> = {};
          answers.forEach((ans) => {
            if (Array.isArray(ans)) {
              ans.forEach((opt) => {
                distMulti[opt] = (distMulti[opt] || 0) + 1;
              });
            }
          });
          questionStats.distribution = Object.entries(distMulti).map(
            ([option, count]) => ({
              option,
              count,
              percentage: parseFloat(
                ((count / answers.length) * 100).toFixed(1),
              ),
            }),
          );
          break;
        }

        case QuestionType.OPEN:
          questionStats.sampleResponses = answers.slice(0, 50);
          questionStats.hasMore = answers.length > 50;
          break;
      }

      return questionStats;
    });

    return {
      surveyId,
      totalResponses,
      questions: stats,
    };
  }

  async getResponseById(responseId: string) {
    const response = await this.surveyResponseRepo.findOne({
      where: { id: responseId },
      relations: ['answers', 'answers.question'],
    });

    if (!response) throw new NotFoundException('Respuesta no encontrada');

    return {
      id: response.id,
      surveyId: response.surveyId,
      completedAt: response.completedAt,
      sessionInfo: response.sessionInfo,
      answers: response.answers.map((answer: Answer) => ({
        questionId: answer.questionId,
        questionLabel: answer.question.label,
        questionType: answer.question.type,
        answer: this.deserializeAnswer(
          answer.answerValue,
          answer.question.type,
        ),
      })),
    };
  }

  async exportToCSV(surveyId: number): Promise<string> {
    const responses = await this.getSurveyResponses(surveyId);
    if (!responses.length) return '';

    const headers = ['Response ID', 'Completed At'];
    const questions = responses[0].answers.map((a) => a.questionLabel);
    headers.push(...questions);

    const rows = responses.map((resp) => {
      const row = [resp.id, resp.completedAt.toISOString()];
      resp.answers.forEach((answer) => {
        const val = Array.isArray(answer.answer)
          ? answer.answer.join('; ')
          : answer.answer;
        row.push(String(val));
      });
      return row;
    });

    return [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(','))
      .join('\n');
  }

  private serializeAnswer(answer: string | number | string[]): string {
    if (Array.isArray(answer)) {
      return JSON.stringify(answer);
    }
    return String(answer);
  }
}
