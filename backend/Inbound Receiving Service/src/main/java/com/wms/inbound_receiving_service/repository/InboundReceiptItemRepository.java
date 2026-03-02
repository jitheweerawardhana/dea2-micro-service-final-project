package com.wms.inbound_receiving_service.repository;

import com.wms.inbound_receiving_service.model.InboundReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InboundReceiptItemRepository extends JpaRepository<InboundReceiptItem, Long> {
    // Removed JOIN FETCH i.product as product is now a Long productId
}