import mysql, { Pool } from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const DB_NAME = process.env.DB_NAME || 'phts_test_request';
export const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

export async function createTestPool(): Promise<Pool> {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  await pool.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
  await pool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await pool.query(`USE \`${DB_NAME}\``);

  return pool;
}

export async function setupSchema(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INT PRIMARY KEY AUTO_INCREMENT,
      citizen_id VARCHAR(20) NOT NULL UNIQUE,
      role VARCHAR(20),
      is_active TINYINT(1) DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS pts_employees (
      citizen_id VARCHAR(20) PRIMARY KEY,
      position_name VARCHAR(100),
      department VARCHAR(100),
      sub_department VARCHAR(100),
      specialist VARCHAR(100),
      expert VARCHAR(100),
      first_name VARCHAR(100),
      last_name VARCHAR(100)
    );
    CREATE TABLE IF NOT EXISTS pts_master_rates (
      rate_id INT AUTO_INCREMENT PRIMARY KEY,
      profession_code VARCHAR(20),
      group_no INT,
      amount DECIMAL(10,2),
      is_active TINYINT(1) DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS pts_requests (
      request_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      request_no VARCHAR(20),
      status VARCHAR(20),
      current_step INT,
      request_type VARCHAR(20),
      requested_amount DECIMAL(10,2),
      effective_date DATE,
      applicant_signature_id INT,
      submission_data JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS pts_request_actions (
      action_id INT AUTO_INCREMENT PRIMARY KEY,
      request_id INT,
      actor_id INT,
      step_no INT,
      action VARCHAR(20),
      comment TEXT,
      signature_snapshot LONGBLOB,
      action_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS pts_user_signatures (
      signature_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      signature_image LONGBLOB,
      updated_at DATETIME
    );
    CREATE TABLE IF NOT EXISTS pts_employee_eligibility (
      eligibility_id INT AUTO_INCREMENT PRIMARY KEY,
      citizen_id VARCHAR(20),
      master_rate_id INT,
      effective_date DATE,
      request_id INT,
      is_active TINYINT(1) DEFAULT 1
    );
  `);
}

export function signToken(user: { userId: number; role: string; citizenId: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
}
