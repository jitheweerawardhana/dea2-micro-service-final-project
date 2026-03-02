package com.wms.inbound_receiving_service.repository;

import com.wms.inbound_receiving_service.model.InboundReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InboundReceiptRepository extends JpaRepository<InboundReceipt, Long> {
    // Removed the broken JOIN FETCH r.supplier because supplier is now a Long supplierId
    List<InboundReceipt> findAllByOrderByReceiptDateDesc();
}