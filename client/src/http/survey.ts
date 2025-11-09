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
    console.log(token)
  const { data } = await http.delete(`/surveys/${id}/soft-delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};