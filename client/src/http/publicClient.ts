import axios from "axios";

export const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false
});
