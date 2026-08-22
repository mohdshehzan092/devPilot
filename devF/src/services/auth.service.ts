import api from "../api/axios";

export const loginUser = async (body: any) => {
  const { data } = await api.post("/auth/login", body);
  return data.data;
};

export const registerUser = async (body: any) => {
  const { data } = await api.post("/auth/register", body);
  return data.data;
};
