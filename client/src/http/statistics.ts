
import { SurveyStatistics, QuestionStatistics } from '../types/types';
import { http } from './client';

  export const getSurveyStatistics = async (surveyId: number | undefined, token: string): Promise<SurveyStatistics> => {
    const response = await http.get(`/statistics/survey/${surveyId}`, {
        headers: {Authorization: `Bearer ${token}`}
    });
    return response.data;
  }

  export const getQuestionStatistics = async (questionId: number | undefined, token:string): Promise<QuestionStatistics> => {
    const response = await http.get(`/statistics/question/${questionId}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
  }