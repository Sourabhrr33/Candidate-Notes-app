import api from "./axios";

export const signup = (data: { name: string; email: string; password: string }) =>
  api.post("/auth/register", data).then(res => res.data);

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data).then(res => res.data);
