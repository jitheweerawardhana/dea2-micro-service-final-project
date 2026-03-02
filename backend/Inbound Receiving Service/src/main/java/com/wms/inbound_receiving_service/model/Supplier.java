package com.wms.inbound_receiving_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generates getSupplierId() and getSupplierName()
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    private Long supplierId;   // Matches the PK in your Supplier Service
    private String supplierName;
    private String contactNo;
    private String address;
}