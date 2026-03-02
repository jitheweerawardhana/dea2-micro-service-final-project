package com.wms.workforce_equipment_service.controller;

import com.wms.workforce_equipment_service.dto.request.EquipmentAssignmentRequest;
import com.wms.workforce_equipment_service.dto.response.EquipmentAssignmentResponse;
import com.wms.workforce_equipment_service.service.IEquipmentAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling equipment assignment requests.
 */
@RestController
@RequestMapping("/api/v1/workforce-equipment/equipment-assignments")
@RequiredArgsConstructor
public class EquipmentAssignmentController {

    private final IEquipmentAssignmentService assignmentService;

    /**
     * Retrieves all equipment assignments.
     * @return List of equipment assignment responses.
     */
    @GetMapping
    public ResponseEntity<List<EquipmentAssignmentResponse>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    /**
     * Retrieves an equipment assignment by its ID.
     * @param id The ID of the assignment.
     * @return The equipment assignment response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EquipmentAssignmentResponse> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    /**
     * Retrieves equipment assignments for a specific equipment.
     * @param equipmentId The ID of the equipment.
     * @return List of equipment assignment responses.
     */
    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<List<EquipmentAssignmentResponse>> getAssignmentsByEquipmentId(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByEquipmentId(equipmentId));
    }

    /**
     * Retrieves equipment assignments for a specific worker.
     * @param workerId The ID of the worker.
     * @return List of equipment assignment responses.
     */
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<EquipmentAssignmentResponse>> getAssignmentsByWorkerId(@PathVariable Long workerId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByWorkerId(workerId));
    }

    /**
     * Creates a new equipment assignment.
     * @param request The assignment creation request.
     * @return The created equipment assignment response.
     */
    @PostMapping
    public ResponseEntity<EquipmentAssignmentResponse> createAssignment(@Valid @RequestBody EquipmentAssignmentRequest request) {
        EquipmentAssignmentResponse created = assignmentService.createAssignment(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Updates an existing equipment assignment.
     * @param id The ID of the assignment to update.
     * @param request The assignment update request.
     * @return The updated equipment assignment response.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EquipmentAssignmentResponse> updateAssignment(@PathVariable Long id,
                                                                         @Valid @RequestBody EquipmentAssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }

    /**
     * Deletes an equipment assignment by its ID.
     * @param id The ID of the assignment to delete.
     * @return No content response.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
