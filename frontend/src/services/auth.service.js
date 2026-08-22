import api from "../api/axios";

export const loginUser = async (body) => {

  const { data } =
    await api.post("/auth/login", body);

  return data.data;
};

export const registerUser =
async (body) => {

  const { data } =
    await api.post("/auth/register", body);

  return data.data;
};