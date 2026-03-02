package com.wms.workforce_equipment_service.controller;

import com.wms.workforce_equipment_service.dto.request.EquipmentRequest;
import com.wms.workforce_equipment_service.dto.response.EquipmentResponse;
import com.wms.workforce_equipment_service.service.IEquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling equipment related requests.
 */
@RestController
@RequestMapping("/api/v1/workforce-equipment/equipments")
@RequiredArgsConstructor
public class WorkforceEquipmentController {

    private final IEquipmentService equipmentService;

    @GetMapping("/hello")
    public String sayHi() {
        return "Hi";
    }

    /**
     * Retrieves all equipment.
     * @return List of equipment responses.
     */
    @GetMapping
    public ResponseEntity<List<EquipmentResponse>> getAllEquipments() {
        return ResponseEntity.ok(equipmentService.getAllEquipments());
    }

    /**
     * Retrieves an equipment item by its ID.
     * @param id The ID of the equipment.
     * @return The equipment response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponse> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    /**
     * Creates a new equipment item.
     * @param request The equipment creation request.
     * @return The created equipment response.
     */
    @PostMapping
    public ResponseEntity<EquipmentResponse> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        EquipmentResponse created = equipmentService.createEquipment(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Updates an existing equipment item.
     * @param id The ID of the equipment to update.
     * @param request The equipment update request.
     * @return The updated equipment response.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EquipmentResponse> updateEquipment(@PathVariable Long id,
                                                             @Valid @RequestBody EquipmentRequest request) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    /**
     * Deletes an equipment item by its ID.
     * @param id The ID of the equipment to delete.
     * @return No content response.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
