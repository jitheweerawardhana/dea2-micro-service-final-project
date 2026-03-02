package com.wms.inbound_receiving_service.service.impl;

import com.wms.inbound_receiving_service.client.ProductClient;
import com.wms.inbound_receiving_service.client.SupplierClient;
import com.wms.inbound_receiving_service.dto.*;
import com.wms.inbound_receiving_service.model.*;
import com.wms.inbound_receiving_service.repository.*;
import com.wms.inbound_receiving_service.service.InboundService;
import com.wms.inbound_receiving_service.exception.ResourceNotFoundException;
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
        // Fetch external IDs and details from AWS EC2 services via Feign Clients
        Supplier supplier = supplierClient.getSupplierByName(request.getSupplierName());
        Product product = productClient.getProductByName(request.getProductName());

        // Create local log for tracking the request data
        InboundShipment shipment = InboundShipment.builder()
                .supplierName(request.getSupplierName())
                .productName(request.getProductName())
                .quantity(request.getQuantity())
                .status("RECEIVED")
                .build();
        shipment = shipmentRepository.save(shipment);

        // Create Receipt storing the external Supplier ID
        InboundReceipt receipt = new InboundReceipt();
        receipt.setSupplierId(supplier.getSupplierId());
        receipt.setReceiptDate(LocalDate.now());
        receipt.setStatus("COMPLETED");
        receipt.setShipmentId(shipment.getId());
        receipt.setGrnNumber("GRN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        // Create Item storing the external Product ID
        InboundReceiptItem item = new InboundReceiptItem();
        item.setProductId(product.getProductId());
        item.setQuantityReceived(request.getQuantity());
        item.setQualityStatus("GOOD");
        receipt.addItem(item);

        InboundReceipt saved = receiptRepository.save(receipt);
        return mapToResponse(saved, request.getSupplierName(), request.getProductName());
    }

    @Override
    public List<InboundResponseDTO> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(s -> InboundResponseDTO.builder()
                        .id(s.getId())
                        .supplierName(s.getSupplierName())
                        .productName(s.getProductName())
                        .quantity(s.getQuantity())
                        .status(s.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<InboundReceiptDTO> getAllReceipts() {
        return receiptRepository.findAll().stream()
                .map(r -> {
                    // Fetch supplier name from external service using the stored ID
                    String sName = "N/A";
                    try {
                        sName = supplierClient.getSupplierById(r.getSupplierId()).getSupplierName();
                    } catch (Exception e) { /* Handle service unavailability */ }

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
                    // Fetch product name from external service using stored ID
                    String pName = "N/A";
                    try {
                        pName = productClient.getProductById(i.getProductId()).getProductName();
                    } catch (Exception e) { /* Handle service unavailability */ }

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
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with ID: " + id));

        // Fetch details for the response mapping
        String sName = supplierClient.getSupplierById(receipt.getSupplierId()).getSupplierName();
        String pName = productClient.getProductById(receipt.getItems().get(0).getProductId()).getProductName();

        return mapToResponse(receipt, sName, pName);
    }

    @Override
    @Transactional
    public InboundResponseDTO updateShipmentStatus(Long id, String status) {
        InboundReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));
        receipt.setStatus(status);

        InboundReceipt saved = receiptRepository.save(receipt);
        String sName = supplierClient.getSupplierById(saved.getSupplierId()).getSupplierName();
        String pName = productClient.getProductById(saved.getItems().get(0).getProductId()).getProductName();

        return mapToResponse(saved, sName, pName);
    }

    @Override
    @Transactional
    public void deleteShipment(Long id) {
        if (!receiptRepository.existsById(id)) {
            throw new ResourceNotFoundException("Receipt not found");
        }
        receiptRepository.deleteById(id);
    }

    private InboundResponseDTO mapToResponse(InboundReceipt receipt, String supplierName, String productName) {
        int qty = receipt.getItems().isEmpty() ? 0 : receipt.getItems().get(0).getQuantityReceived();

        return InboundResponseDTO.builder()
                .id(receipt.getReceiptId())
                .supplierName(supplierName)
                .productName(productName)
                .quantity(qty)
                .status(receipt.getStatus())
                .build();
    }
}