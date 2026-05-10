import api from "./api";

export const getExperts = async (params = {}) => {
  const response = await api.get("/experts", { params });
  return response.data.data;
};

export const getExpertById = async (id) => {
  const response = await api.get(`/experts/${id}`);
  return response.data.data;
};

export const getAdminExperts = async () => {
  const response = await api.get("/experts/admin/all");
  return response.data.data.experts;
};

export const getExpertCategories = async () => {
  const response = await api.get("/experts/categories");
  return response.data.data.categories;
};

export const createExpert = async (payload) => {
  const response = await api.post("/experts", payload);
  return response.data.data.expert;
};

export const updateExpert = async (id, payload) => {
  const response = await api.put(`/experts/${id}`, payload);
  return response.data.data.expert;
};

export const deleteExpert = async (id) => {
  const response = await api.delete(`/experts/${id}`);
  return response.data.data.deletedExpertId;
};
