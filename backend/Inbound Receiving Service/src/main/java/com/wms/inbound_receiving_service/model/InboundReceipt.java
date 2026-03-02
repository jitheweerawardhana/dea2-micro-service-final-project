package com.wms.inbound_receiving_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inbound_receipts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InboundReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long receiptId;

    @Column(unique = true, nullable = false)
    private String grnNumber;

    private LocalDate receiptDate;

    private String status;

    // Refactored: Store only the ID from the external Supplier Service
    private Long supplierId;

    private Long shipmentId;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InboundReceiptItem> items = new ArrayList<>();

    public void addItem(InboundReceiptItem item) {
        items.add(item);
        item.setReceipt(this);
    }
}