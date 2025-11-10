import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('surveys')
@ApiBearerAuth()
@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createSurveyDto: CreateSurveyDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    return this.surveysService.create(createSurveyDto, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllByUserId(@CurrentUser() user: { userId: string; email: string }) {
    return this.surveysService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveysService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateSurvey(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSurveyDto,
  ) {
    return this.surveysService.updateSurvey(id, dto);
  }

  @Delete(':id/soft-delete')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.surveysService.remove(+id);
  }
}
