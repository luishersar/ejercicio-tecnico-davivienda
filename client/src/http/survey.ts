import { CreateSurveyPayload } from "../dtos/create-survey.dto";
import { publicClient } from "../http/publicClient"; 
import { http } from "./client";

export async function getSurveyById(id: string) {
  const res = await publicClient.get(`/surveys/${id}`);

   const encuestaFiltrada = {
    ...res.data,
    questions: res.data.questions.filter((q: any) => q.active)
   };

  return encuestaFiltrada;
}

export async function getSurveyByIdToUpdate(id: string) {
  const res = await publicClient.get(`/surveys/${id}`);

  const encuestaFiltrada = {
    ...res.data,
    questions: res.data.questions.filter((q: any) => q.active)
   };

  return encuestaFiltrada;
}

export async function getAllSurveys(token: string) {
  const res = await http.get(`/surveys`, {
    headers: { Authorization: `Bearer ${token}` },
  });

    const surveys = res.data.surveys
    const responses = res.data.responses

  return {surveys, responses};
}

export async function createSurvey(payload: CreateSurveyPayload, token: string) {
  const res = await http.post('/surveys', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export const updateSurvey = async (id: string, payload: any, token: string) => {
  const res = await http.put(`/surveys/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const softDeleteSurvey = async (id: number, token: string) => {
  const { data } = await http.delete(`/surveys/${id}/soft-delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export async function submitSurveyResponse(payload: any) {
  const res = await publicClient.post('/survey-responses', payload);
  return res.data;
}

export async function getSurveyResponses(surveyId: number) {
  const res = await publicClient.get(`/survey-responses/survey/${surveyId}`);
  return res.data;
}

export async function getResponseById(responseId: string) {
  const res = await publicClient.get(`/survey-responses/${responseId}`);
  return res.data;
}

export async function deleteAllSurveyResponses(surveyId: number) {
  const res = await publicClient.delete(
    `/survey-responses/survey/${surveyId}`,
  );
  return res.data;
}
