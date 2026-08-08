package com.joborbit.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WHY: Entry point for the Application microservice (port 8084). Owns
 * application_db exclusively - tracks which job seeker applied to which job
 * and the status of that application. jobId and applicantId are logical
 * references to records living in job_db / auth_db respectively (no shared
 * database, no direct service-to-service calls).
 */
@SpringBootApplication
public class ApplicationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationServiceApplication.class, args);
    }
}
