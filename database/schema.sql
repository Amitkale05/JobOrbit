-- ─────────────────────────────────────────────
-- JobConnect Auth Service — Database Schema
-- Run this file once to set up the users table
-- ─────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS jobconnect_db;
USE jobconnect_db;

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT        AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  hash_password VARCHAR(255)  NOT NULL,
  role          ENUM('ADMIN', 'RECRUITER', 'CANDIDATE') NOT NULL DEFAULT 'CANDIDATE',
  is_verified   BOOLEAN       NOT NULL DEFAULT FALSE,
  otp           VARCHAR(10)   DEFAULT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
