import { http } from "./client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  roles?: string[];
  permissions?: string[];
};

export async function login(payload: LoginPayload) {
const res = await http.post("/auth/login", payload);
  return res.data;
}

export async function logout() {
  const res = await http.post("/auth/logout", null, {
    withCredentials: true,
  });
  return res.data;
}

export async function getMe(token: string) {
  const res = await http.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}