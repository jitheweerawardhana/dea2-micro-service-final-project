import api from "@/lib/axios";

const BASE = "/api/v1/workforce-equipment/maintenance-logs";

export const getAllMaintenanceLogs = () => api.get(BASE);

export const getMaintenanceLogById = (id) => api.get(`${BASE}/${id}`);

export const getMaintenanceLogsByEquipmentId = (equipmentId) =>
  api.get(`${BASE}/equipment/${equipmentId}`);

export const createMaintenanceLog = (data) => api.post(BASE, data);

export const updateMaintenanceLog = (id, data) =>
  api.put(`${BASE}/${id}`, data);

export const deleteMaintenanceLog = (id) => api.delete(`${BASE}/${id}`);
