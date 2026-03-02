import api from "@/lib/axios";

const BASE = "/api/v1/workforce-equipment/workers";

export const getAllWorkers = () => api.get(BASE);

export const getWorkerById = (id) => api.get(`${BASE}/${id}`);

export const createWorker = (data) => api.post(BASE, data);

export const updateWorker = (id, data) => api.put(`${BASE}/${id}`, data);

export const deleteWorker = (id) => api.delete(`${BASE}/${id}`);
