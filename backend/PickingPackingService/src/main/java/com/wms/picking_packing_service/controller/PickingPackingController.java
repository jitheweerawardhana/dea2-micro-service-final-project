package com.wms.picking_packing_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wms.picking_packing_service.dto.PickingPackingDTO;
import com.wms.picking_packing_service.services.PickingPackingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/v1/pick-pack")
@Validated
@Tag(name = "Picking & Packing Management", description = "APIs for managing warehouse picking and packing operations")
public class PickingPackingController{
    private final PickingPackingService service;

    public PickingPackingController(PickingPackingService service) {
        this.service = service;
    }

    // ========================================
    // BASIC CRUD OPERATIONS (Internal Use)
    // ========================================
    
    @PostMapping
    @Operation(summary = "Create picking task", 
               description = "🔵 CALLED BY: Order Service → Creates new picking/packing task for an order")
    public ResponseEntity<PickingPackingDTO> create(@Valid @RequestBody PickingPackingDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createPickingTask(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get picking task by ID", 
               description = "Get specific picking/packing task details")
    public ResponseEntity<PickingPackingDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @Operation(summary = "Get all picking tasks", 
               description = "Retrieve all picking/packing tasks")
    public ResponseEntity<List<PickingPackingDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update picking task", 
               description = "Update picking/packing task details")
    public ResponseEntity<PickingPackingDTO> update(@PathVariable Long id, @Valid @RequestBody PickingPackingDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete picking task", 
               description = "Delete a picking/packing task")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status", 
               description = "Manually update status (use workflow endpoints instead)")
    public ResponseEntity<PickingPackingDTO> updateStatus(@PathVariable Long id, @RequestParam @NotBlank String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    // ========================================
    // QUERY ENDPOINTS (Internal Use)
    // ========================================
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get tasks by status", 
               description = "Get tasks with specific status (PENDING, PICKING, PICKED, PACKING, COMPLETED)")
    public ResponseEntity<List<PickingPackingDTO>> getByStatus(@PathVariable @NotBlank String status) {
        return ResponseEntity.ok(service.getByStatus(status));
    }

    // ========================================
    // WORKFLOW ENDPOINTS (Picking & Packing Process)
    // ========================================
    
    @PostMapping("/{id}/start-picking")
    @Operation(summary = "Start picking process", 
               description = "Worker starts picking items. Status: PENDING → PICKING")
    public ResponseEntity<PickingPackingDTO> startPicking(@PathVariable Long id) {
        return ResponseEntity.ok(service.startPicking(id));
    }

    @PostMapping("/{id}/complete-picking")
    @Operation(summary = "Complete picking process", 
               description = "Worker completes picking. Updates inventory. Status: PICKING → PICKED. " +
                           "🔴 CALLS: Inventory Service (reduce stock)")
    public ResponseEntity<PickingPackingDTO> completePicking(@PathVariable Long id) {
        return ResponseEntity.ok(service.completePicking(id));
    }

    @PostMapping("/{id}/start-packing")
    @Operation(summary = "Start packing process", 
               description = "Worker starts packing items. Status: PICKED → PACKING")
    public ResponseEntity<PickingPackingDTO> startPacking(@PathVariable Long id) {
        return ResponseEntity.ok(service.startPacking(id));
    }

    @PostMapping("/{id}/complete-packing")
    @Operation(summary = "Complete packing process", 
               description = "Worker completes packing. Notifies Order Service. Status: PACKING → COMPLETED. " +
                           "🔴 CALLS: Order Service (update status to READY_TO_SHIP)")
    public ResponseEntity<PickingPackingDTO> completePacking(@PathVariable Long id) {
        return ResponseEntity.ok(service.completePacking(id));
    }

}