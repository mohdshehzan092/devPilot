import api from "../api/axios";

export const getWorkspaces = async () => {
  const res = await api.get("/workspaces");
  return res.data.data.items;
};

export const getWorkspace = async (id: string) => {
  const res = await api.get(`/workspaces/${id}`);
  return res.data.data;
};

export const createWorkspace = async (name: string, description?: string) => {
  const res = await api.post("/workspaces", { name, description });
  return res.data.data;
};

export const updateWorkspace = async (
  id: string,
  name: string,
  description?: string,
) => {
  const res = await api.patch(`/workspaces/${id}`, { name, description });
  return res.data.data;
};

export const deleteWorkspace = async (id: string) => {
  const res = await api.delete(`/workspaces/${id}`);
  return res.data.data;
};
