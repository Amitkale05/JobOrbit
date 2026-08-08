package com.joborbit.job;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WHY: Entry point for the Job microservice (port 8083). Owns job_db
 * exclusively - jobs and companies. Recruiters create/manage jobs here;
 * job seekers browse/search/filter jobs here. This service never calls
 * User Service or Application Service directly.
 */
@SpringBootApplication
public class JobServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(JobServiceApplication.class, args);
    }
}
