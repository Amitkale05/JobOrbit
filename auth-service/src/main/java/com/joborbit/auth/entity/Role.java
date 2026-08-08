package com.joborbit.auth.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * WHY: Maps to the "roles" table. Kept as its own entity/table (rather than
 * a plain enum column on User) so it satisfies the required schema (users,
 * roles tables) and can be extended later (e.g. permissions per role)
 * without altering the users table.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 30)
    private RoleName name;
}
