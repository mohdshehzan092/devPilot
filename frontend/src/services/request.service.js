import api from "../api/axios";

// Get all requests of a collection
export const getRequests = async (collectionId) => {
  const res = await api.get(
    `/requests/collection/${collectionId}`
  );

  return res.data.data.items;
};

// Get single request
export const getRequest = async (id) => {
  const res = await api.get(
    `/requests/get-request/${id}`
  );

  return res.data.data;
};

// Create request
export const createRequest = async (payload) => {
  try {
    const res = await api.post(
      "/requests/create-request",
      payload
    );

    return res.data.data;
  } catch (err) {
    console.log(err.response?.data);
    throw err;
  }
};
// Update request
export const updateRequest = async (
  id,
  payload
) => {
  const res = await api.patch(
    `/requests/update-request/${id}`,
    payload
  );

  return res.data.data;
};

// Delete request
export const deleteRequest = async (id) => {
  const res = await api.delete(
    `/requests/delete-request/${id}`
  );

  return res.data.data;
};