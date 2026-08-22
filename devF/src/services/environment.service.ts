import api from "../api/axios";

export const getEnvironments = async (workspaceId: string) => {
  const res = await api.get("/environments", { params: { workspaceId } });
  return res.data.data;
};

export const getEnvironmentById = async (id: string) => {
  const res = await api.get(`/environments/${id}`);
  return res.data.data;
};

export const createEnvironment = async (payload: any) => {
  const res = await api.post("/environments/create", payload);
  return res.data.data;
};

export const updateEnvironment = async (id: string, payload: any) => {
  const res = await api.patch(`/environments/update/${id}`, payload);
  return res.data.data;
};

export const deleteEnvironment = async (id: string) => {
  const res = await api.delete(`/environments/delete/${id}`);
  return res.data;
};
