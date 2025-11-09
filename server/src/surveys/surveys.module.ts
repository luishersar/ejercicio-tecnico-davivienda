import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { Survey } from './entities/survey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { SurveyAnswersController } from './controllers/survey-answers.controller';
import { SurveyAnswerService } from './services/answers.service';
import { Answer } from './entities/answer.entity';
import { SurveyResponse } from './entities/survey-response.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      Question,
      QuestionOption,
      Answer,
      SurveyResponse,
    ]),
  ],
  controllers: [SurveysController, SurveyAnswersController],
  providers: [SurveysService, SurveyAnswerService],
})
export class SurveysModule {}
