package com.wms.picking_packing_service.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

public class PickingPackingDTO {
    private Long pickPackId;
    private Long orderId;
    private Long workerId;

    private LocalDateTime pickDate;
    private LocalDateTime packDate;

    @Size(max = 20, message = "status must be at most 20 characters")
    private String status;

    @Valid
    private List<PickingItemDTO> items;

    @Valid
    private List<PackingDetailsDTO> packingDetails;

    public void setPickPackId(Long pickPackId) {
        this.pickPackId = pickPackId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public void setPickDate(LocalDateTime pickDate) {
        this.pickDate = pickDate;
    }

    public void setPackDate(LocalDateTime packDate) {
        this.packDate = packDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setItems(List<PickingItemDTO> items) {
        this.items = items;
    }

    public void setPackingDetails(List<PackingDetailsDTO> packingDetails) {
        this.packingDetails = packingDetails;
    }

    public Long getPickPackId() {
        return pickPackId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public Long getWorkerId() {
        return workerId;
    }

    public LocalDateTime getPickDate() {
        return pickDate;
    }

    public LocalDateTime getPackDate() {
        return packDate;
    }

    public String getStatus() {
        return status;
    }

    public List<PickingItemDTO> getItems() {
        return items;
    }

    public List<PackingDetailsDTO> getPackingDetails() {
        return packingDetails;
    }
}
