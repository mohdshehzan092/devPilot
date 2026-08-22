import api from "../api/axios";

export const generateBody = async (prompt) => {
  const res = await api.post("/ai/generate-body", {
    prompt,
  });

  return res.data.data;
};

export const modifyBody = async (body, instruction) => {
  const res = await api.post("/ai/modify-body", {
    body,
    instruction,
  });

  return res.data.data;
};

export const generateTests = async (response) => {
  const res = await api.post("/ai/generate-tests", {
    response,
  });

  return res.data.data;
};

export const summarizeResponse = async (response) => {
  const res = await api.post("/ai/summarize", {
    response,
  });

  return res.data.data;
};

export const autocomplete = async (text) => {
  const res = await api.post("/ai/autocomplete", {
    text,
  });

  return res.data.data;
};

export const explainError = async (error) => {
  const res = await api.post("/ai/explain-error", {
    error,
  });

  return res.data.data;
};