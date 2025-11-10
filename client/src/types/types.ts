export enum QuestionType {
  OPEN = 'open',
  SCALE = 'scale',
  MULTIPLE_CHOICE_ONE_ANSWER = 'multiple_choice_one_answer',
  MULTIPLE_CHOICE_MULTIPLE_ANSWER = 'multiple_choice_multiple_answer',
}

export interface Question {
  id: number;
  label: string;
  type: QuestionType;
  active: boolean;
  options?: Array<{ id: number; label: string }>;
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  active: boolean;
  questions: Question[];
}

export type SurveyFormValues = Record<string, string | number | string[]>;

export interface QuestionStatistics {
  questionId: number;
  label: string;
  type: 'open' | 'scale' | 'single' | 'multiple';
  totalResponses: number;
  statistics: OpenStatistics | ScaleStatistics | SingleChoiceStatistics | MultipleChoiceStatistics;
}

export interface OpenStatistics {
  responses: Array<{
    value: string;
    completedAt: string;
    sessionInfo?: any;
  }>;
}

export interface ScaleStatistics {
  average: number;
  median: number;
  mode: number;
  distribution: Array<{
    value: number;
    count: number;
    percentage: number;
  }>;
}

export interface SingleChoiceStatistics {
  options: Array<{
    optionId: number;
    label: string;
    count: number;
    percentage: number;
  }>;
}

export interface MultipleChoiceStatistics {
  options: Array<{
    optionId: number;
    label: string;
    count: number;
    percentage: number;
  }>;
  totalResponses: number;
}

export interface SurveyStatistics {
  surveyId: number;
  title: string;
  description: string;
  totalResponses: number;
  questions: QuestionStatistics[];
  responseTimeline: Array<{
    date: string;
    count: number;
  }>;
}