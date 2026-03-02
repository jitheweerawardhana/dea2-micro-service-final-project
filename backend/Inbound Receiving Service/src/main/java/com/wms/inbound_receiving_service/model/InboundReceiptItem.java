package com.wms.inbound_receiving_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "inbound_receipt_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InboundReceiptItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long receiptItemId;

    private Integer quantityReceived;
    private String batchNo;
    private String qualityStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", nullable = false)
    private InboundReceipt receipt;

    // Refactored: Store only the ID from the external Product Service
    private Long productId;
}