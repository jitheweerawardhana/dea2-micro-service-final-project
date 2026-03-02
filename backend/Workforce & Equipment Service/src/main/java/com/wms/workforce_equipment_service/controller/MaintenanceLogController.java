package com.wms.workforce_equipment_service.controller;

import com.wms.workforce_equipment_service.dto.request.MaintenanceLogRequest;
import com.wms.workforce_equipment_service.dto.response.MaintenanceLogResponse;
import com.wms.workforce_equipment_service.service.IMaintenanceLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling maintenance log requests.
 */
@RestController
@RequestMapping("/api/v1/workforce-equipment/maintenance-logs")
@RequiredArgsConstructor
public class MaintenanceLogController {

    private final IMaintenanceLogService maintenanceLogService;

    /**
     * Retrieves all maintenance logs.
     * @return List of maintenance log responses.
     */
    @GetMapping
    public ResponseEntity<List<MaintenanceLogResponse>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(maintenanceLogService.getAllMaintenanceLogs());
    }

    /**
     * Retrieves a maintenance log by its ID.
     * @param id The ID of the maintenance log.
     * @return The maintenance log response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceLogResponse> getMaintenanceLogById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceLogService.getMaintenanceLogById(id));
    }

    /**
     * Retrieves maintenance logs for a specific equipment.
     * @param equipmentId The ID of the equipment.
     * @return List of maintenance log responses.
     */
    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<List<MaintenanceLogResponse>> getMaintenanceLogsByEquipmentId(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(maintenanceLogService.getMaintenanceLogsByEquipmentId(equipmentId));
    }

    /**
     * Creates a new maintenance log.
     * @param request The maintenance log creation request.
     * @return The created maintenance log response.
     */
    @PostMapping
    public ResponseEntity<MaintenanceLogResponse> createMaintenanceLog(@Valid @RequestBody MaintenanceLogRequest request) {
        MaintenanceLogResponse created = maintenanceLogService.createMaintenanceLog(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Updates an existing maintenance log.
     * @param id The ID of the maintenance log to update.
     * @param request The maintenance log update request.
     * @return The updated maintenance log response.
     */
    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceLogResponse> updateMaintenanceLog(@PathVariable Long id,
                                                                        @Valid @RequestBody MaintenanceLogRequest request) {
        return ResponseEntity.ok(maintenanceLogService.updateMaintenanceLog(id, request));
    }

    /**
     * Deletes a maintenance log by its ID.
     * @param id The ID of the maintenance log to delete.
     * @return No content response.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenanceLog(@PathVariable Long id) {
        maintenanceLogService.deleteMaintenanceLog(id);
        return ResponseEntity.noContent().build();
    }
}
