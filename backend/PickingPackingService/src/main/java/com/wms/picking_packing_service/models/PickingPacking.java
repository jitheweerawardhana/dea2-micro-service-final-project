package com.wms.picking_packing_service.models;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "picking_packing")
public class PickingPacking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pickPackId;

    private Long orderId;
    private Long workerId;
    private LocalDateTime pickDate;
    private LocalDateTime packDate;

    private String status;

    @OneToMany(mappedBy = "pickingPacking", cascade = CascadeType.ALL)
    private List<PickingItem> items;

    @OneToMany(mappedBy = "pickingPacking", cascade = CascadeType.ALL)
    private List<PackingDetails> packingDetails;

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

    public List<PickingItem> getItems() {
        return items;
    }

    public List<PackingDetails> getPackingDetails() {
        return packingDetails;
    }

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

    public void setItems(List<PickingItem> items) {
        this.items = items;
    }

    public void setPackingDetails(List<PackingDetails> packingDetails) {
        this.packingDetails = packingDetails;
    }
}
