-- =====================================================================
-- SMART CAMPUS LOST & FOUND MANAGEMENT SYSTEM
-- Database Schema: MySQL 8.0+
-- Database Name: smart_lost_found
-- =====================================================================

CREATE DATABASE IF NOT EXISTS smart_lost_found CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_lost_found;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE
DROP TABLE IF EXISTS item_history;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS found_items;
DROP TABLE IF EXISTS lost_items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NULL,
    department VARCHAR(100) NULL,
    year_of_study INT NULL,
    phone_number VARCHAR(20) NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    account_status ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_reg_no (registration_number),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    icon VARCHAR(50) NULL DEFAULT 'Package',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. LOST ITEMS TABLE
CREATE TABLE lost_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(20) NOT NULL UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    category_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    date_lost DATE NOT NULL,
    time_lost VARCHAR(50) NULL,
    location VARCHAR(150) NOT NULL,
    image_url VARCHAR(500) NULL,
    identifying_details TEXT NULL,
    contact_preference VARCHAR(50) DEFAULT 'EMAIL',
    reported_by BIGINT NOT NULL,
    status ENUM('LOST', 'FOUND_MATCH', 'RECOVERED', 'CANCELLED') NOT NULL DEFAULT 'LOST',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lost_category FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE,
    CONSTRAINT fk_lost_user FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_lost_category (category_id),
    INDEX idx_lost_reporter (reported_by),
    INDEX idx_lost_status (status),
    INDEX idx_lost_date (date_lost)
) ENGINE=InnoDB;

-- 4. FOUND ITEMS TABLE
CREATE TABLE found_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(20) NOT NULL UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    category_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    date_found DATE NOT NULL,
    time_found VARCHAR(50) NULL,
    location VARCHAR(150) NOT NULL,
    image_url VARCHAR(500) NULL,
    identifying_details TEXT NULL,
    reported_by BIGINT NOT NULL,
    status ENUM('AVAILABLE', 'CLAIMED', 'HANDED_OVER', 'REJECTED') NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_found_category FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE,
    CONSTRAINT fk_found_user FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_found_category (category_id),
    INDEX idx_found_reporter (reported_by),
    INDEX idx_found_status (status),
    INDEX idx_found_date (date_found)
) ENGINE=InnoDB;

-- 5. CLAIMS TABLE
CREATE TABLE claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_code VARCHAR(20) NOT NULL UNIQUE,
    found_item_id BIGINT NOT NULL,
    claimed_by BIGINT NOT NULL,
    claim_description TEXT NOT NULL,
    identifying_details TEXT NOT NULL,
    claim_status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    reviewed_by BIGINT NULL,
    admin_remarks TEXT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_claim_item FOREIGN KEY (found_item_id) REFERENCES found_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_claim_claimant FOREIGN KEY (claimed_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_claim_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_claim_found_item (found_item_id),
    INDEX idx_claim_user (claimed_by),
    INDEX idx_claim_status (claim_status)
) ENGINE=InnoDB;

-- 6. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    reference_id VARCHAR(50) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_read (is_read)
) ENGINE=InnoDB;

-- 7. ITEM HISTORY (AUDIT TRAIL) TABLE
CREATE TABLE item_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_type ENUM('LOST', 'FOUND', 'CLAIM') NOT NULL,
    item_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by BIGINT NULL,
    remarks TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_user FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_history_item (item_type, item_id)
) ENGINE=InnoDB;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

