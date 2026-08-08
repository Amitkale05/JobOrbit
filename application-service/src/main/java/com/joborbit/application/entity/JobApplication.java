package com.joborbit.application.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * WHY: Maps to the "applications" table - the join between a job seeker and
 * a job they applied to. jobId/applicantId/recruiterId are logical FKs into
 * job_db / auth_db (this service never queries those databases directly;
 * the frontend supplies whatever extra job/user details it needs by calling
 * Job Service / User Service itself through the Gateway).
 */
@Entity
@Table(name = "applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_id", "applicant_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "applicant_id", nullable = false)
    private Long applicantId;

    @Column(name = "recruiter_id", nullable = false)
    private Long recruiterId;

    @Lob
    private String coverLetter;

    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.appliedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
