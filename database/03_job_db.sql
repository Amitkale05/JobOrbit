-- ============================================================
-- JobOrbit :: job_db
-- Owned exclusively by Job Service (port 8083)
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_job_db1;
USE job_db;

CREATE TABLE IF NOT EXISTS companies (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    industry    VARCHAR(100),
    location    VARCHAR(100),
    description TEXT,
    website     VARCHAR(255),
    logo_url    VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS jobs (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    title               VARCHAR(150) NOT NULL,
    description         TEXT         NOT NULL,
    location            VARCHAR(100),
    job_type            VARCHAR(20)  NOT NULL,   -- FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, REMOTE
    experience_required VARCHAR(100),
    min_salary          DOUBLE,
    max_salary          DOUBLE,
    skills_required     TEXT,
    status              VARCHAR(10)  NOT NULL DEFAULT 'OPEN', -- OPEN, CLOSED
    recruiter_id        BIGINT       NOT NULL,   -- logical FK -> auth_db.users.id
    company_id          BIGINT       NOT NULL,
    created_at          DATETIME     NOT NULL,
    updated_at          DATETIME,
    CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES companies (id)
);

CREATE INDEX idx_jobs_location ON jobs (location);
CREATE INDEX idx_jobs_recruiter ON jobs (recruiter_id);
