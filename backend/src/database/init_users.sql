/*
 * PHTS System - Users Table Initialization
 *
 * This table manages authentication credentials for the PHTS application.
 * Users are seeded from the existing HRMS employees view.
 *
 * Authentication Logic:
 * - Username: 13-digit Thai Citizen ID (citizen_id)
 * - Default Password: User's birthdate in DDMMYYYY format (hashed)
 * - No self-registration: Users must be seeded from HRMS data
 *
 * Date: 2025-12-30
 */

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT COMMENT 'Primary key for users table',
  `citizen_id` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '13-digit Thai Citizen ID - acts as username',
  `password_hash` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Bcrypt password hash',
  `role` ENUM(
    'USER',
    'HEAD_DEPT',
    'PTS_OFFICER',
    'HEAD_HR',
    'DIRECTOR',
    'FINANCE_OFFICER',
    'HEAD_FINANCE',
    'ADMIN'
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'USER' COMMENT 'User role for authorization',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Account active status (0=inactive, 1=active)',
  `last_login_at` DATETIME NULL DEFAULT NULL COMMENT 'Timestamp of last successful login',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update timestamp',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `unique_citizen_id` (`citizen_id` ASC) USING BTREE COMMENT 'Ensure one account per citizen ID',
  INDEX `idx_role` (`role` ASC) USING BTREE COMMENT 'Index for role-based queries',
  INDEX `idx_is_active` (`is_active` ASC) USING BTREE COMMENT 'Index for active user filtering',
  INDEX `idx_last_login` (`last_login_at` ASC) USING BTREE COMMENT 'Index for login activity tracking'
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = 'User authentication and authorization table'
  ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table created successfully
-- Next step: Run seed_users.ts to populate from HRMS employees view
-- ----------------------------
