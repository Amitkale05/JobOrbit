package com.joborbit.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the API Gateway.
 *
 * WHY THIS CLASS EXISTS:
 * The API Gateway is the single entry point for the entire JobOrbit platform.
 * The React frontend NEVER talks to Auth/User/Job/Application services directly -
 * it only talks to this Gateway (port 8080), which then forwards ("routes") the
 * request to the correct downstream microservice based on the URL path.
 *
 * This centralizes cross-cutting concerns (CORS, JWT validation, logging) in one
 * place instead of duplicating that logic in every microservice.
 */
@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
