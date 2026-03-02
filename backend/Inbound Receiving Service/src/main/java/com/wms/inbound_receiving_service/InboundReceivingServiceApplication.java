package com.wms.inbound_receiving_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients      // Enables communication with other EC2 services
@EnableDiscoveryClient   // Registers this service with the Eureka server
public class InboundReceivingServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(InboundReceivingServiceApplication.class, args);
	}
}
