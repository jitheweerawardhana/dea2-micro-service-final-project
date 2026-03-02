import api from "@/lib/axios";

const BASE = "/api/v1/workforce-equipment/equipment-types";

export const getAllEquipmentTypes = () => api.get(BASE);

export const getEquipmentTypeById = (id) => api.get(`${BASE}/${id}`);

export const createEquipmentType = (data) => api.post(BASE, data);

export const updateEquipmentType = (id, data) => api.put(`${BASE}/${id}`, data);

export const deleteEquipmentType = (id) => api.delete(`${BASE}/${id}`);
