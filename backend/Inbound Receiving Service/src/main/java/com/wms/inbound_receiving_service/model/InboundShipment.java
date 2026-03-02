package com.wms.inbound_receiving_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;


@Entity
@Table(name = "inbound_shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InboundShipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String supplierName;

    @Column(nullable = false)
    private String productName;

    private int quantity;

    private String status;
}