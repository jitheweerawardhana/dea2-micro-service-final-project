package com.wms.workforce_equipment_service.controller;

import com.wms.workforce_equipment_service.dto.request.EquipmentTypeRequest;
import com.wms.workforce_equipment_service.dto.response.EquipmentTypeResponse;
import com.wms.workforce_equipment_service.service.IEquipmentTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling equipment type requests.
 */
@RestController
@RequestMapping("/api/v1/workforce-equipment/equipment-types")
@RequiredArgsConstructor
public class EquipmentTypeController {

    private final IEquipmentTypeService equipmentTypeService;

    /**
     * Retrieves all equipment types.
     * @return List of equipment type responses.
     */
    @GetMapping
    public ResponseEntity<List<EquipmentTypeResponse>> getAllEquipmentTypes() {
        return ResponseEntity.ok(equipmentTypeService.getAllEquipmentTypes());
    }

    /**
     * Retrieves an equipment type by its ID.
     * @param id The ID of the equipment type.
     * @return The equipment type response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EquipmentTypeResponse> getEquipmentTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentTypeService.getEquipmentTypeById(id));
    }

    /**
     * Creates a new equipment type.
     * @param request The equipment type creation request.
     * @return The created equipment type response.
     */
    @PostMapping
    public ResponseEntity<EquipmentTypeResponse> createEquipmentType(@Valid @RequestBody EquipmentTypeRequest request) {
        EquipmentTypeResponse created = equipmentTypeService.createEquipmentType(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Updates an existing equipment type.
     * @param id The ID of the equipment type to update.
     * @param request The equipment type update request.
     * @return The updated equipment type response.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EquipmentTypeResponse> updateEquipmentType(@PathVariable Long id,
                                                                      @Valid @RequestBody EquipmentTypeRequest request) {
        return ResponseEntity.ok(equipmentTypeService.updateEquipmentType(id, request));
    }

    /**
     * Deletes an equipment type by its ID.
     * @param id The ID of the equipment type to delete.
     * @return No content response.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipmentType(@PathVariable Long id) {
        equipmentTypeService.deleteEquipmentType(id);
        return ResponseEntity.noContent().build();
    }
}
