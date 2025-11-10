import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SurveyAnswerService } from '../services/answers.service';
import { SubmitSurveyDTO } from '../dto/submit-survey.dto';

@Controller('survey-responses')
export class SurveyAnswersController {
  constructor(private readonly surveyAnswerService: SurveyAnswerService) {}

  @Post()
  submit(@Body() dto: SubmitSurveyDTO) {
    return this.surveyAnswerService.submitSurveyResponse(dto);
  }

  @Get('survey/:surveyId')
  getAllBySurvey(@Param('surveyId') surveyId: string) {
    return this.surveyAnswerService.getSurveyResponses(+surveyId);
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.surveyAnswerService.getResponseById(id);
  }
}
