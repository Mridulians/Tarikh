import api from "../api/axios";

export const registerUser = async (email: string, password: string) => {
  const res = await api.post("/api/auth/register", { email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};
