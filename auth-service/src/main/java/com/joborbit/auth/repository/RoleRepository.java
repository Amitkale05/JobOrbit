package com.joborbit.auth.repository;

import com.joborbit.auth.entity.Role;
import com.joborbit.auth.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
