interface CreateQuestionOptionPayload {
  label: string;
}

interface CreateQuestionPayload {
  label: string;
  type: 'open' | 'scale' | 'multiple_choice_one_answer' | 'multiple_choice_multiple_answer';
  options?: CreateQuestionOptionPayload[];
}

export interface CreateSurveyPayload {
  title: string;
  description?: string;
  questions: CreateQuestionPayload[];
}