import api from "../api/axios";

export const getEnvironments = async (workspaceId) => {
  const res = await api.get("/environments", {
    params: {
      workspaceId,
    },
  });

  return res.data.data;
};

export const getEnvironmentById = async (id) => {
  const res = await api.get(`/environments/${id}`);

  return res.data.data;
};

export const createEnvironment = async (payload) => {
  const res = await api.post(
    "/environments/create",
    payload
  );

  return res.data.data;
};

export const updateEnvironment = async (
  id,
  payload
) => {
  const res = await api.patch(
    `/environments/update/${id}`,
    payload
  );

  return res.data.data;
};

export const deleteEnvironment = async (id) => {
  const res = await api.delete(
    `/environments/delete/${id}`
  );

  return res.data;
};