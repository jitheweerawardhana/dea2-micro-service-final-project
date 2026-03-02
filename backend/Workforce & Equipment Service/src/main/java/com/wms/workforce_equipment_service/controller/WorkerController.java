package com.wms.workforce_equipment_service.controller;

import com.wms.workforce_equipment_service.dto.request.WorkerRequest;
import com.wms.workforce_equipment_service.dto.response.WorkerResponse;
import com.wms.workforce_equipment_service.service.IWorkerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling worker related requests.
 */
@RestController
@RequestMapping("/api/v1/workforce-equipment/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final IWorkerService workerService;

    /**
     * Retrieves all workers.
     * @return List of worker responses.
     */
    @GetMapping
    public ResponseEntity<List<WorkerResponse>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    /**
     * Retrieves a worker by their ID.
     * @param id The ID of the worker.
     * @return The worker response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponse> getWorkerById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorkerById(id));
    }

    /**
     * Creates a new worker.
     * @param request The worker creation request.
     * @return The created worker response.
     */
    @PostMapping
    public ResponseEntity<WorkerResponse> createWorker(@Valid @RequestBody WorkerRequest request) {
        WorkerResponse created = workerService.createWorker(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Updates an existing worker.
     * @param id The ID of the worker to update.
     * @param request The worker update request.
     * @return The updated worker response.
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkerResponse> updateWorker(@PathVariable Long id,
                                                        @Valid @RequestBody WorkerRequest request) {
        return ResponseEntity.ok(workerService.updateWorker(id, request));
    }

    /**
     * Deletes a worker by their ID.
     * @param id The ID of the worker to delete.
     * @return No content response.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.noContent().build();
    }
}
