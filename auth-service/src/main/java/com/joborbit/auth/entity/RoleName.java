package com.joborbit.auth.entity;

/**
 * WHY: Fixed set of roles the platform supports. Kept as an enum (not free
 * text) so role checks in @PreAuthorize / JWT claims are type-safe and typo-proof.
 */
public enum RoleName {
    ADMIN,
    RECRUITER,
    JOB_SEEKER
}
