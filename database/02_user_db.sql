-- ============================================================
-- JobOrbit :: user_db
-- Owned exclusively by User Service (port 8082)
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_user_db1;
USE user_db;

CREATE TABLE IF NOT EXISTS profiles (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT       NOT NULL UNIQUE,   -- logical FK -> auth_db.users.id
    full_name        VARCHAR(100),
    email            VARCHAR(150),
    phone            VARCHAR(15),
    headline         VARCHAR(150),
    location         VARCHAR(100),
    summary          TEXT,
    resume_file_name VARCHAR(255),
    resume_file_url  VARCHAR(255),
    created_at       DATETIME NOT NULL,
    updated_at       DATETIME
);

CREATE TABLE IF NOT EXISTS education (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution    VARCHAR(150) NOT NULL,
    degree         VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100),
    start_year     INT,
    end_year       INT,
    grade          VARCHAR(20),
    profile_id     BIGINT NOT NULL,
    CONSTRAINT fk_education_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experience (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name      VARCHAR(150) NOT NULL,
    job_title         VARCHAR(100) NOT NULL,
    start_date        DATE,
    end_date          DATE,
    currently_working BOOLEAN NOT NULL DEFAULT FALSE,
    description       TEXT,
    profile_id        BIGINT NOT NULL,
    CONSTRAINT fk_experience_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skills (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(60) NOT NULL,
    proficiency VARCHAR(20),
    profile_id  BIGINT NOT NULL,
    CONSTRAINT fk_skills_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
);
