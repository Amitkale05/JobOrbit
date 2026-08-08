-- ============================================================
-- JobOrbit :: auth_db
-- Owned exclusively by Auth Service (port 8081)
-- Note: Hibernate (ddl-auto=update) will create/update these
-- tables automatically on service startup. This script is
-- provided for manual setup / documentation / CDAC evaluation.
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_auth_db1;
USE auth_db;

CREATE TABLE IF NOT EXISTS roles (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('ADMIN'), ('RECRUITER'), ('JOB_SEEKER')
ON DUPLICATE KEY UPDATE name = name;

CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name  VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,
    role_id    BIGINT        NOT NULL,
    enabled    BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at DATETIME      NOT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- Optional: seed an admin account for first login
-- Password below is a BCrypt hash of "Admin@123" - change in production.
-- INSERT INTO users (full_name, email, password, role_id, enabled, created_at)
-- VALUES ('Platform Admin', 'admin@joborbit.com', '$2a$10$replace_with_real_bcrypt_hash',
--         (SELECT id FROM roles WHERE name = 'ADMIN'), TRUE, NOW());
