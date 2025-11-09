import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Question, QuestionType } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepo: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(QuestionOption)
    private optionRepo: Repository<QuestionOption>,
  ) {}

  async create(dto: CreateSurveyDto) {
    const survey = this.surveyRepo.create({
      title: dto.title,
      description: dto.description,
      active: true,
    });

    survey.questions = dto.questions.map((q) => {
      const question = this.questionRepo.create({
        label: q.label,
        type: q.type,
        active: true,
      });

      const needsOptions =
        q.type === QuestionType.MULTIPLE_CHOICE_ONE_ANSWER ||
        q.type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER;

      if (needsOptions && q.options && q.options.length > 0) {
        question.options = q.options.map((o) =>
          this.optionRepo.create({
            label: o.label,
          }),
        );
      }

      return question;
    });

    return this.surveyRepo.save(survey);
  }

  async findAll() {
    return this.surveyRepo.find({
      relations: {
        questions: {
          options: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.surveyRepo.findOne({
      where: {
        id,
      },
      relations: {
        questions: {
          options: true,
        },
      },
    });
  }

  async remove(id: number) {
    const survey = await this.surveyRepo.findOne({ where: { id } });
    if (!survey) throw new NotFoundException('Survey not found');
    survey.active = false;
    await this.surveyRepo.save(survey);
  }

  async updateSurvey(id: number, dto: UpdateSurveyDto) {
    const survey = await this.surveyRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    if (dto.title !== undefined) survey.title = dto.title;
    if (dto.description !== undefined) survey.description = dto.description;
    if (dto.active !== undefined) survey.active = dto.active;

    await this.surveyRepo.save(survey);

    if (dto.questions) {
      const incomingIds = new Set(
        dto.questions.filter((q) => typeof q.id === 'number').map((q) => q.id),
      );

      for (const question of survey.questions) {
        if (!incomingIds.has(question.id)) {
          question.active = false;
          await this.questionRepo.save(question);
        }
      }

      for (const q of dto.questions) {
        let question: Question | undefined;

        if (q.id && typeof q.id === 'number') {
          question = survey.questions.find((x) => x.id === q.id);
          if (!question) {
            throw new BadRequestException(
              `La pregunta con id ${q.id} no pertenece a la encuesta ${survey.id}`,
            );
          }
          question.label = q.label;
          question.type = q.type;
          question.active = true;
          await this.questionRepo.save(question);
        } else {
          question = this.questionRepo.create({
            survey,
            label: q.label,
            type: q.type,
            active: true,
          });
          await this.questionRepo.save(question);
        }

        if (
          q.options &&
          (q.type === QuestionType.MULTIPLE_CHOICE_ONE_ANSWER ||
            q.type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER)
        ) {
          const incomingOptionIds = new Set(
            q.options
              .filter((opt) => typeof opt.id === 'number')
              .map((opt) => opt.id),
          );

          if (question.options) {
            for (const option of question.options) {
              if (!incomingOptionIds.has(option.id)) {
                await this.optionRepo.remove(option);
              }
            }
          }

          for (const opt of q.options) {
            if (opt.id && typeof opt.id === 'number') {
              const option = question.options?.find((x) => x.id === opt.id);
              if (option) {
                option.label = opt.label;
                await this.optionRepo.save(option);
              }
            } else {
              const newOption = this.optionRepo.create({
                question,
                label: opt.label,
              });
              await this.optionRepo.save(newOption);
            }
          }
        } else {
          if (question.options && question.options.length > 0) {
            await this.optionRepo.remove(question.options);
          }
        }
      }
    }

    return this.getSurveyById(id);
  }

  async getSurveyById(id: number) {
    return await this.surveyRepo.findOne({
      where: {
        id,
      },
      relations: {
        questions: {
          options: true,
        },
      },
    });
  }
}
