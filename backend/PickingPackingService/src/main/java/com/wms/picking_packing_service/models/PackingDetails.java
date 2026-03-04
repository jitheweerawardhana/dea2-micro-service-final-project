package com.wms.picking_packing_service.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "packing_details")
public class PackingDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long packingId;
    private String packingType;
    private Double weight;
    private String dimensions;

    @ManyToOne
    @JoinColumn(name = "pick_pack_id")
    private PickingPacking pickingPacking;

    public Long getPackingId() {
        return packingId;
    }

    public String getPackingType() {
        return packingType;
    }

    public Double getWeight() {
        return weight;
    }

    public String getDimensions() {
        return dimensions;
    }

    public PickingPacking getPickingPacking() {
        return pickingPacking;
    }

    public void setPackingId(Long packingId) {
        this.packingId = packingId;
    }

    public void setPackingType(String packingType) {
        this.packingType = packingType;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public void setPickingPacking(PickingPacking pickingPacking) {
        this.pickingPacking = pickingPacking;
    }
}
