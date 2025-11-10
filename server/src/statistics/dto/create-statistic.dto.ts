export class QuestionStatisticsDto {
  questionId: number;
  label: string;
  type: 'open' | 'scale' | 'single' | 'multiple';
  totalResponses: number;
  statistics:
    | OpenStatistics
    | ScaleStatistics
    | SingleChoiceStatistics
    | MultipleChoiceStatistics;
}

export class OpenStatistics {
  responses: Array<{
    value: string;
    createdAt: Date;
    sessionInfo?: any;
  }>;
}

export class ScaleStatistics {
  average: number;
  median: number;
  mode: number;
  distribution: Array<{
    value: number;
    count: number;
    percentage: number;
  }>;
}

export class SingleChoiceStatistics {
  options: Array<{
    optionId: number;
    label: string;
    count: number;
    percentage: number;
  }>;
}

export class MultipleChoiceStatistics {
  options: Array<{
    optionId: number;
    label: string;
    count: number;
    percentage: number;
  }>;
  totalResponses: number;
}

export class SurveyStatisticsDto {
  surveyId: number;
  title: string;
  description: string;
  totalResponses: number;
  questions: QuestionStatisticsDto[];
  responseTimeline: Array<{
    date: string;
    count: number;
  }>;
}
