package com.joborbit.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * WHY: Maps to the "profiles" table. userId is the FK reference back to the
 * User record living in Auth Service's auth_db - NOT a JPA @ManyToOne
 * relationship, because these two tables live in two different physical
 * databases (no shared database allowed, per architecture constraint).
 * The link is purely logical: userId here == users.id in auth_db, and is
 * populated from the X-User-Id header that the Gateway forwards after
 * verifying the caller's JWT.
 */
@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(length = 100)
    private String fullName;

    @Column(length = 150)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 150)
    private String headline;

    @Column(length = 100)
    private String location;

    @Lob
    private String summary;

    private String resumeFileName;
    private String resumeFileUrl;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Education> education = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Experience> experience = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Skill> skills = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
