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
    });

    survey.questions = dto.questions.map((q) => {
      const question = this.questionRepo.create({
        label: q.label,
        type: q.type,
      });

      if (q.type === QuestionType.MULTIPLE_CHOICE && q.options) {
        question.options = q.options.map((o) => this.optionRepo.create(o));
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
    console.log(dto, 'dto');
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

      // Marcar como inactivas las preguntas que ya no están en el payload
      for (const question of survey.questions) {
        if (!incomingIds.has(question.id)) {
          question.active = false;
          await this.questionRepo.save(question);
        }
      }

      // Luego el update/create normal
      for (const q of dto.questions) {
        let question: Question | undefined;

        if (q.id) {
          question = survey.questions.find((x) => x.id === q.id);
          if (!question) {
            throw new BadRequestException(
              `La question con id ${q.id} no pertenece a la survey ${survey.id}`,
            );
          }

          question.label = q.label;
          question.type = q.type;
          question.active = true; // si viene en payload, asegurar que esté activa
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

        // Opciones...
        if (q.options && q.type === QuestionType.MULTIPLE_CHOICE) {
          for (const opt of q.options) {
            if (opt.id) {
              const option = question.options.find((x) => x.id === opt.id);
              if (!option) continue;
              option.label = opt.label;
              await this.optionRepo.save(option);
            } else {
              const newOption = this.optionRepo.create({
                question,
                label: opt.label,
              });
              await this.optionRepo.save(newOption);
            }
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
