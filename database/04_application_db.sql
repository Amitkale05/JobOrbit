-- ============================================================
-- JobOrbit :: application_db
-- Owned exclusively by Application Service (port 8084)
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_application_db1;
USE application_db;

CREATE TABLE IF NOT EXISTS applications (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id        BIGINT      NOT NULL,   -- logical FK -> job_db.jobs.id
    applicant_id  BIGINT      NOT NULL,   -- logical FK -> auth_db.users.id
    recruiter_id  BIGINT      NOT NULL,   -- logical FK -> auth_db.users.id
    cover_letter  TEXT,
    resume_url    VARCHAR(255),
    status        VARCHAR(20) NOT NULL DEFAULT 'APPLIED', -- APPLIED, SHORTLISTED, REJECTED, WITHDRAWN, HIRED
    applied_at    DATETIME    NOT NULL,
    updated_at    DATETIME,
    CONSTRAINT uq_job_applicant UNIQUE (job_id, applicant_id)
);

CREATE INDEX idx_applications_applicant ON applications (applicant_id);
CREATE INDEX idx_applications_recruiter ON applications (recruiter_id);
CREATE INDEX idx_applications_job ON applications (job_id);
