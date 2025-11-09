import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';

export class SubmitAnswerDTO {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsNotEmpty()
  answer: string | number | string[];
}

export class SessionInfoDTO {
  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  screenResolution?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}

export class SubmitSurveyDTO {
  @IsInt()
  @IsNotEmpty()
  surveyId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDTO)
  responses: SubmitAnswerDTO[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SessionInfoDTO)
  sessionInfo?: SessionInfoDTO;
}
