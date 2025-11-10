import { QuestionType } from 'src/common/utils/enums/question-type.enum';

export interface QuestionStats {
  questionId: number;
  questionLabel: string;
  questionType: QuestionType;
  totalAnswers: number;
  average?: number;
  min?: number;
  max?: number;
  distribution?: Array<{
    value?: number;
    option?: string;
    count: number;
    percentage: number;
  }>;
  sampleResponses?: Array<string | number | string[]>;
  hasMore?: boolean;
}
