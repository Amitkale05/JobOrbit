package com.joborbit.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.joborbit.auth.entity.Role;
import com.joborbit.auth.entity.RoleName;
import com.joborbit.auth.repository.RoleRepository;

/**
 * WHY: Entry point for the Auth microservice (port 8081). Owns its own
 * database (auth_db) and is solely responsible for identity: registration,
 * login, password hashing and JWT issuance.
 */
@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    /**
     * WHY: Seeds the three fixed roles (ADMIN, RECRUITER, JOB_SEEKER) on startup
     * if they don't already exist, so the FK relationship from users -> roles
     * always has valid rows to reference without manual SQL setup.
     */
    @Bean
    CommandLineRunner seedRoles(RoleRepository roleRepository) {
        return args -> {
            for (RoleName roleName : RoleName.values()) {
                roleRepository.findByName(roleName)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
            }
        };
    }
}
