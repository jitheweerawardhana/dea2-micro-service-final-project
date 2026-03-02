package com.wms.inbound_receiving_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generates getProductId()
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    private Long productId;     // Matches the PK in your Product Service
    private String productName;
    private String skuCode;
    private String category;
}