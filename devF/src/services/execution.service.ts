import api from "../api/axios";

export const executeRequest = async (requestId: string) => {
  const res = await api.post(`/execution/create-execution/${requestId}`);
  return res.data.data;
};
