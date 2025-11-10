import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Survey } from '../surveys/entities/survey.entity';
import { Question } from 'src/surveys/entities/question.entity';
import { Answer } from 'src/surveys/entities/answer.entity';
import { SurveyResponse } from 'src/surveys/entities/survey-response.entity';
import { QuestionOption } from 'src/surveys/entities/question-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      Question,
      Answer,
      SurveyResponse,
      QuestionOption,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
