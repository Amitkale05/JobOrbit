package com.joborbit.auth.repository;

import com.joborbit.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * WHY: Repository layer isolates persistence (Hibernate/JPA) details from the
 * service layer. Extending JpaRepository gives CRUD + paging for free.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
