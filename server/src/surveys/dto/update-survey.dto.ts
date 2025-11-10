import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from 'src/common/utils/enums/question-type.enum';

export class UpdateQuestionOptionDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsString()
  label: string;
}

export class UpdateQuestionDto {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty()
  @IsString()
  type: QuestionType;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionOptionDto)
  options?: UpdateQuestionOptionDto[];
}

export class UpdateSurveyDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions?: UpdateQuestionDto[];
}
