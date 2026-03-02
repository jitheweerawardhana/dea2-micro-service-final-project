package com.wms.inbound_receiving_service.service.impl;

import com.wms.inbound_receiving_service.client.ProductClient;
import com.wms.inbound_receiving_service.client.SupplierClient;
import com.wms.inbound_receiving_service.dto.*;
import com.wms.inbound_receiving_service.model.*;
import com.wms.inbound_receiving_service.repository.*;
import com.wms.inbound_receiving_service.service.InboundService;
import com.wms.inbound_receiving_service.exception.ResourceNotFoundException;
import com.wms.inbound_receiving_service.model.Supplier; // Ensure POJOs are imported
import com.wms.inbound_receiving_service.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InboundServiceImpl implements InboundService {

    private final InboundRepository shipmentRepository;
    private final InboundReceiptRepository receiptRepository;
    private final InboundReceiptItemRepository receiptItemRepository;

    private final SupplierClient supplierClient;
    private final ProductClient productClient;

    @Override
    @Transactional
    public InboundResponseDTO receiveShipment(InboundRequestDTO request) {
        // Fetch external data from EC2 services
        Supplier supplier = supplierClient.getSupplierByName(request.getSupplierName());
        Product product = productClient.getProductByName(request.getProductName());

        InboundShipment shipment = InboundShipment.builder()
                .supplierName(request.getSupplierName())
                .productName(request.getProductName())
                .quantity(request.getQuantity())
                .status("RECEIVED")
                .build();
        shipment = shipmentRepository.save(shipment);

        InboundReceipt receipt = new InboundReceipt();
        receipt.setSupplierId(supplier.getSupplierId()); // Storing Long ID
        receipt.setReceiptDate(LocalDate.now());
        receipt.setStatus("COMPLETED");
        receipt.setShipmentId(shipment.getId());
        receipt.setGrnNumber("GRN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        InboundReceiptItem item = new InboundReceiptItem();
        item.setProductId(product.getProductId()); // Storing Long ID
        item.setQuantityReceived(request.getQuantity());
        item.setQualityStatus("GOOD");
        receipt.addItem(item);

        InboundReceipt saved = receiptRepository.save(receipt);
        return mapToResponse(saved, request.getSupplierName(), request.getProductName());
    }

    @Override
    public List<InboundReceiptDTO> getAllReceipts() {
        // Fetch from RDS first, then enrich with names via Feign
        return receiptRepository.findAllByOrderByReceiptDateDesc().stream()
                .map(r -> {
                    String sName = "N/A";
                    try {
                        sName = supplierClient.getSupplierById(r.getSupplierId()).getSupplierName();
                    } catch (Exception e) { /* Fallback if service is down */ }

                    return InboundReceiptDTO.builder()
                            .id(r.getReceiptId())
                            .receiptNumber(r.getGrnNumber())
                            .supplierName(sName)
                            .receivedAt(r.getReceiptDate().atStartOfDay())
                            .status(r.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InboundReceiptItemDTO> getAllReceiptItems() {
        return receiptItemRepository.findAll().stream()
                .map(i -> {
                    String pName = "N/A";
                    try {
                        pName = productClient.getProductById(i.getProductId()).getProductName();
                    } catch (Exception e) { /* Fallback */ }

                    return InboundReceiptItemDTO.builder()
                            .id(i.getReceiptItemId())
                            .receiptId(i.getReceipt().getReceiptId())
                            .productName(pName)
                            .quantityReceived(i.getQuantityReceived())
                            .condition(i.getQualityStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public InboundResponseDTO getShipmentById(Long id) {
        InboundReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));

        String sName = supplierClient.getSupplierById(receipt.getSupplierId()).getSupplierName();
        String pName = productClient.getProductById(receipt.getItems().get(0).getProductId()).getProductName();

        return mapToResponse(receipt, sName, pName);
    }

    // Standard mappings for status and delete...
    @Override
    @Transactional
    public InboundResponseDTO updateShipmentStatus(Long id, String status) {
        InboundReceipt receipt = receiptRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        receipt.setStatus(status);
        InboundReceipt saved = receiptRepository.save(receipt);

        String sName = supplierClient.getSupplierById(saved.getSupplierId()).getSupplierName();
        String pName = productClient.getProductById(saved.getItems().get(0).getProductId()).getProductName();
        return mapToResponse(saved, sName, pName);
    }

    @Override
    @Transactional
    public void deleteShipment(Long id) {
        if (!receiptRepository.existsById(id)) throw new ResourceNotFoundException("Not found");
        receiptRepository.deleteById(id);
    }

    private InboundResponseDTO mapToResponse(InboundReceipt receipt, String sName, String pName) {
        int qty = receipt.getItems().isEmpty() ? 0 : receipt.getItems().get(0).getQuantityReceived();
        return InboundResponseDTO.builder()
                .id(receipt.getReceiptId())
                .supplierName(sName)
                .productName(pName)
                .quantity(qty)
                .status(receipt.getStatus())
                .build();
    }

    @Override
    public List<InboundResponseDTO> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(s -> InboundResponseDTO.builder()
                        .id(s.getId()).supplierName(s.getSupplierName())
                        .productName(s.getProductName()).quantity(s.getQuantity())
                        .status(s.getStatus()).build())
                .collect(Collectors.toList());
    }
}