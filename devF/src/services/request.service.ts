import api from "../api/axios";

export const getRequests = async (collectionId: string) => {
  const res = await api.get(`/requests/collection/${collectionId}`);
  return res.data.data.items;
};

export const getRequest = async (id: string) => {
  const res = await api.get(`/requests/get-request/${id}`);
  return res.data.data;
};

export const createRequest = async (payload: any) => {
  try {
    const res = await api.post("/requests/create-request", payload);
    return res.data.data;
  } catch (err: any) {
    console.log(err.response?.data);
    throw err;
  }
};

export const updateRequest = async (id: string, payload: any) => {
  const res = await api.patch(`/requests/update-request/${id}`, payload);
  return res.data.data;
};

export const deleteRequest = async (id: string) => {
  const res = await api.delete(`/requests/delete-request/${id}`);
  return res.data.data;
};
