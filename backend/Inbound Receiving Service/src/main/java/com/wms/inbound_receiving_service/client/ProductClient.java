package com.wms.inbound_receiving_service.client;

import com.wms.inbound_receiving_service.model.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "${app.product-service-url}")
public interface ProductClient {
    // Used in receiveShipment()
    @GetMapping("/api/v1/products/name/{name}")
    Product getProductByName(@PathVariable("name") String name);

    // Used in getAllReceiptItems() and updateShipmentStatus()
    @GetMapping("/api/v1/products/{id}")
    Product getProductById(@PathVariable("id") Long id);
}