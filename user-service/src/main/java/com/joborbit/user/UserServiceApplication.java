package com.joborbit.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WHY: Entry point for the User microservice (port 8082). Owns user_db
 * exclusively - profiles, resumes, skills, education, experience. Never
 * talks to Auth/Job/Application services directly; it trusts the identity
 * (X-User-Id / X-User-Name / X-User-Role) forwarded by the API Gateway,
 * which already verified the caller's JWT.
 */
@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
