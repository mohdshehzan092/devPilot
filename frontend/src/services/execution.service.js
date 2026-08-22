import api from "../api/axios";

export const executeRequest = async (requestId) => {
  const res = await api.post(
    `/execution/create-execution/${requestId}`
  );

  return res.data.data;
};