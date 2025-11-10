import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  SurveyStatisticsDto,
  QuestionStatisticsDto,
} from './dto/create-statistic.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('survey/:surveyId')
  async getSurveyStatistics(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @CurrentUser() user: { userId: number; email: string },
  ): Promise<SurveyStatisticsDto> {
    return this.statisticsService.getSurveyStatistics(surveyId, user.userId);
  }

  @Get('question/:questionId')
  async getQuestionStatistics(
    @Param('questionId', ParseIntPipe) questionId: number,
  ): Promise<QuestionStatisticsDto> {
    return this.statisticsService.getQuestionStatistics(questionId);
  }
}
