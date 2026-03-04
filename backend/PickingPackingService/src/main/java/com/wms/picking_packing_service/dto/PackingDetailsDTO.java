package com.wms.picking_packing_service.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class PackingDetailsDTO {
    @Size(max = 50, message = "packingType must be at most 50 characters")
    private String packingType;

    @Positive(message = "weight must be greater than zero")
    private Double weight;

    @Size(max = 120, message = "dimensions must be at most 120 characters")
    private String dimensions;

    public String getPackingType() {
        return packingType;
    }

    public Double getWeight() {
        return weight;
    }

    public String getDimensions() {
        return dimensions;
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
}

