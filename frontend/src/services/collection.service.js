import api from "../api/axios";

export const getCollections = async (workspaceId) => {
  const res = await api.get(
    `/collections/workspace/${workspaceId}`
  );

  return res.data.data.items;
};

export const getCollection = async (id) => {
  const res = await api.get(
    `/collections/get-collection/${id}`
  );

  return res.data.data;
};

export const createCollection = async (
  workspaceId,
  name,
  description
) => {
  const res = await api.post(
    "/collections/create-collection",
    {
      workspaceId,
      name,
      description,
    }
  );

  return res.data.data;
};

export const updateCollection = async (
  id,
  name,
  description
) => {
  const res = await api.patch(
    `/collections/update-collection/${id}`,
    {
      name,
      description,
    }
  );

  return res.data.data;
};

export const deleteCollection = async (id) => {
  const res = await api.delete(
    `/collections/delete-collection/${id}`
  );

  return res.data.data;
};