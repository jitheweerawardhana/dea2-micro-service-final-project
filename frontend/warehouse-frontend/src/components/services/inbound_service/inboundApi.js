import api from "@/lib/axios";

export const getInboundShipments = () => api.get("/inbound/shipments");
export const getShipmentById = (id) => api.get(`/inbound/shipments/${id}`);
export const updateShipmentStatus = (id, status) => api.put(`/inbound/shipments/${id}/status`, { status });