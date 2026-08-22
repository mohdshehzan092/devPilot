import api from "../api/axios";

export const getHistory = async () => {
  const res = await api.get("/history");
  return res.data.data;
};

export const getHistoryById = async (id: string) => {
  const res = await api.get(`/history/${id}`);
  return res.data.data;
};

export const deleteHistory = async (id: string) => {
  const res = await api.delete(`/history/delete-history/${id}`);
  return res.data;
};
