import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { Survey } from './entities/survey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question, QuestionOption])],
  controllers: [SurveysController],
  providers: [SurveysService],
})
export class SurveysModule {}
