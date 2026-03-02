package com.wms.orderservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.wms.orderservice.dto.request.ApproveOrderRequest;
import com.wms.orderservice.dto.request.CreateOrderItemRequest;
import com.wms.orderservice.dto.request.CreateOrderRequest;
import com.wms.orderservice.dto.request.UpdateOrderStatusRequest;
import com.wms.orderservice.dto.response.AvailabilityResponse;
import com.wms.orderservice.dto.response.OrderItemResponse;
import com.wms.orderservice.dto.response.OrderResponse;
import com.wms.orderservice.entity.OrderStatus;
import com.wms.orderservice.exception.BusinessException;
import com.wms.orderservice.exception.NotFoundException;
import com.wms.orderservice.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    private static final String BASE_URL = "/api/v1/orders";

    private OrderResponse buildSampleResponse() {
        return buildSampleResponseWithStatus(OrderStatus.CREATED);
    }

    private OrderResponse buildSampleResponseWithStatus(OrderStatus status) {
        UUID id = UUID.randomUUID();
        return OrderResponse.builder()
                .id(id)
                .orderNumber("ORD-2026-000001")
                .customerId("CUST-LK-001")
                .status(status)
                .partialAllowed(true)
                .totalAmount(new BigDecimal("5000.00"))
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .items(List.of(
                        OrderItemResponse.builder()
                                .id(UUID.randomUUID())
                                .itemId("ITEM-001")
                                .requestedQty(10)
                                .approvedQty(0)
                                .unitPrice(new BigDecimal("250.00"))
                                .build(),
                        OrderItemResponse.builder()
                                .id(UUID.randomUUID())
                                .itemId("ITEM-002")
                                .requestedQty(5)
                                .approvedQty(0)
                                .unitPrice(new BigDecimal("500.00"))
                                .build()
                ))
                .build();
    }

    @Nested
    @DisplayName("POST /api/v1/orders")
    class CreateOrderEndpoint {

        @Test
        @DisplayName("201 — Successfully creates order")
        void createOrder_success() throws Exception {
            OrderResponse response = buildSampleResponse();
            when(orderService.createOrder(any(CreateOrderRequest.class))).thenReturn(response);

            CreateOrderRequest request = CreateOrderRequest.builder()
                    .customerId("CUST-LK-001")
                    .partialAllowed(true)
                    .items(List.of(
                            CreateOrderItemRequest.builder()
                                    .itemId("ITEM-001")
                                    .quantity(10)
                                    .unitPrice(new BigDecimal("250.00"))
                                    .build()
                    ))
                    .build();

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.orderNumber").value("ORD-2026-000001"))
                    .andExpect(jsonPath("$.customerId").value("CUST-LK-001"))
                    .andExpect(jsonPath("$.status").value("CREATED"))
                    .andExpect(jsonPath("$.items", hasSize(2)));
        }

        @Test
        @DisplayName("400 — Validation error: blank customerId")
        void createOrder_blankCustomerId() throws Exception {
            CreateOrderRequest request = CreateOrderRequest.builder()
                    .customerId("")
                    .partialAllowed(true)
                    .items(List.of(
                            CreateOrderItemRequest.builder()
                                    .itemId("ITEM-001")
                                    .quantity(10)
                                    .build()
                    ))
                    .build();

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"))
                    .andExpect(jsonPath("$.details", hasSize(greaterThanOrEqualTo(1))));
        }

        @Test
        @DisplayName("400 — Validation error: empty items list")
        void createOrder_emptyItems() throws Exception {
            CreateOrderRequest request = CreateOrderRequest.builder()
                    .customerId("CUST-LK-001")
                    .partialAllowed(true)
                    .items(List.of())
                    .build();

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
        }

        @Test
        @DisplayName("400 — Validation error: quantity < 1")
        void createOrder_invalidQuantity() throws Exception {
            CreateOrderRequest request = CreateOrderRequest.builder()
                    .customerId("CUST-LK-001")
                    .partialAllowed(true)
                    .items(List.of(
                            CreateOrderItemRequest.builder()
                                    .itemId("ITEM-001")
                                    .quantity(0)
                                    .build()
                    ))
                    .build();

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/orders/{id}")
    class GetOrderEndpoint {

        @Test
        @DisplayName("200 — Order found")
        void getOrder_found() throws Exception {
            OrderResponse response = buildSampleResponse();
            when(orderService.getOrderById(response.id())).thenReturn(response);

            mockMvc.perform(get(BASE_URL + "/{id}", response.id()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(response.id().toString()))
                    .andExpect(jsonPath("$.orderNumber").value("ORD-2026-000001"));
        }

        @Test
        @DisplayName("404 — Order not found")
        void getOrder_notFound() throws Exception {
            UUID id = UUID.randomUUID();
            when(orderService.getOrderById(id)).thenThrow(new NotFoundException("Order", id));

            mockMvc.perform(get(BASE_URL + "/{id}", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.errorCode").value("NOT_FOUND"));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/orders")
    class ListOrdersEndpoint {

        @Test
        @DisplayName("200 — List all orders")
        void listOrders_all() throws Exception {
            Page<OrderResponse> page = new PageImpl<>(List.of(buildSampleResponse()));
            when(orderService.getAllOrders(eq(null), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content", hasSize(1)));
        }

        @Test
        @DisplayName("200 — List orders filtered by status")
        void listOrders_byStatus() throws Exception {
            Page<OrderResponse> page = new PageImpl<>(List.of());
            when(orderService.getAllOrders(eq(OrderStatus.APPROVED), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get(BASE_URL).param("status", "APPROVED"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content", hasSize(0)));
        }
    }

    @Nested
    @DisplayName("POST /api/v1/orders/{id}/validate")
    class ValidateOrderEndpoint {

        @Test
        @DisplayName("200 — Validation succeeds")
        void validateOrder_success() throws Exception {
            UUID id = UUID.randomUUID();
            AvailabilityResponse availability = AvailabilityResponse.builder()
                    .canFulfill(true)
                    .missingItems(List.of())
                    .build();
            when(orderService.validateOrder(id)).thenReturn(availability);

            mockMvc.perform(post(BASE_URL + "/{id}/validate", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.canFulfill").value(true));
        }

        @Test
        @DisplayName("400 — Wrong status for validation")
        void validateOrder_wrongStatus() throws Exception {
            UUID id = UUID.randomUUID();
            when(orderService.validateOrder(id))
                    .thenThrow(new BusinessException("Order can only be validated from CREATED status"));

            mockMvc.perform(post(BASE_URL + "/{id}/validate", id))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("BUSINESS_ERROR"));
        }
    }

    @Nested
    @DisplayName("POST /api/v1/orders/{id}/approve")
    class ApproveOrderEndpoint {

        @Test
        @DisplayName("200 — Full approval")
        void approveOrder_full() throws Exception {
            UUID id = UUID.randomUUID();
            OrderResponse response = buildSampleResponseWithStatus(OrderStatus.APPROVED);
            when(orderService.approveOrder(eq(id), any(ApproveOrderRequest.class))).thenReturn(response);

            ApproveOrderRequest request = ApproveOrderRequest.builder()
                    .approvalType(ApproveOrderRequest.ApprovalType.FULL)
                    .build();

            mockMvc.perform(post(BASE_URL + "/{id}/approve", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("APPROVED"));
        }

        @Test
        @DisplayName("400 — Missing approvalType")
        void approveOrder_missingType() throws Exception {
            UUID id = UUID.randomUUID();

            mockMvc.perform(post(BASE_URL + "/{id}/approve", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"approvalType\": null}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("POST /api/v1/orders/{id}/cancel")
    class CancelOrderEndpoint {

        @Test
        @DisplayName("200 — Order cancelled")
        void cancelOrder_success() throws Exception {
            UUID id = UUID.randomUUID();
            OrderResponse response = buildSampleResponseWithStatus(OrderStatus.CANCELLED);
            when(orderService.cancelOrder(id)).thenReturn(response);

            mockMvc.perform(post(BASE_URL + "/{id}/cancel", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("CANCELLED"));
        }

        @Test
        @DisplayName("400 — Cannot cancel dispatched order")
        void cancelOrder_dispatched() throws Exception {
            UUID id = UUID.randomUUID();
            when(orderService.cancelOrder(id))
                    .thenThrow(new BusinessException("Cannot cancel order that is already DISPATCHED"));

            mockMvc.perform(post(BASE_URL + "/{id}/cancel", id))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("BUSINESS_ERROR"));
        }
    }

    @Nested
    @DisplayName("PATCH /api/v1/orders/{id}/status")
    class UpdateStatusEndpoint {

        @Test
        @DisplayName("200 — Status updated")
        void updateStatus_success() throws Exception {
            UUID id = UUID.randomUUID();
            OrderResponse response = buildSampleResponseWithStatus(OrderStatus.PICKING_REQUESTED);
            when(orderService.updateOrderStatus(eq(id), any(UpdateOrderStatusRequest.class)))
                    .thenReturn(response);

            UpdateOrderStatusRequest request = UpdateOrderStatusRequest.builder()
                    .status(OrderStatus.PICKING_REQUESTED)
                    .build();

            mockMvc.perform(patch(BASE_URL + "/{id}/status", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("PICKING_REQUESTED"));
        }

        @Test
        @DisplayName("400 — Invalid transition")
        void updateStatus_invalidTransition() throws Exception {
            UUID id = UUID.randomUUID();
            when(orderService.updateOrderStatus(eq(id), any(UpdateOrderStatusRequest.class)))
                    .thenThrow(new BusinessException("Invalid status transition"));

            UpdateOrderStatusRequest request = UpdateOrderStatusRequest.builder()
                    .status(OrderStatus.DELIVERED)
                    .build();

            mockMvc.perform(patch(BASE_URL + "/{id}/status", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("BUSINESS_ERROR"));
        }

        @Test
        @DisplayName("400 — Missing status field")
        void updateStatus_missingStatus() throws Exception {
            UUID id = UUID.randomUUID();

            mockMvc.perform(patch(BASE_URL + "/{id}/status", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"status\": null}"))
                    .andExpect(status().isBadRequest());
        }
    }
}
