import api from "@/lib/axios";

const BASE = "/api/v1/workforce-equipment/equipment-assignments";

export const getAllAssignments = () => api.get(BASE);

export const getAssignmentById = (id) => api.get(`${BASE}/${id}`);

export const getAssignmentsByEquipmentId = (equipmentId) =>
  api.get(`${BASE}/equipment/${equipmentId}`);

export const getAssignmentsByWorkerId = (workerId) =>
  api.get(`${BASE}/worker/${workerId}`);

export const createAssignment = (data) => api.post(BASE, data);

export const updateAssignment = (id, data) => api.put(`${BASE}/${id}`, data);

export const deleteAssignment = (id) => api.delete(`${BASE}/${id}`);
