/**
 * PHTS System - Create Inactive Test User Script
 *
 * Creates an inactive test user to test 403 forbidden response
 *
 * Test User Details:
 * - Citizen ID: 9876543210987
 * - Password: 15081995
 * - Role: USER
 * - Active: false
 *
 * Date: 2025-12-30
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phts_system',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

const SALT_ROUNDS = 10;

async function createInactiveUser(): Promise<void> {
  let connection: mysql.Connection | null = null;

  try {
    console.log('Creating inactive test user...');
    connection = await mysql.createConnection(dbConfig);

    const testUser = {
      citizen_id: '9876543210987',
      password: '15081995',
      role: 'USER',
    };

    const passwordHash = await bcrypt.hash(testUser.password, SALT_ROUNDS);

    await connection.query(
      `INSERT INTO users (citizen_id, password_hash, role, is_active)
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       role = VALUES(role),
       is_active = 0`,
      [testUser.citizen_id, passwordHash, testUser.role]
    );

    console.log('✓ Inactive test user created successfully!');
    console.log(`  Citizen ID: ${testUser.citizen_id}`);
    console.log(`  Password: ${testUser.password}`);
    console.log(`  Role: ${testUser.role}`);
    console.log(`  Active: No`);
  } catch (error) {
    console.error('Error creating inactive user:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createInactiveUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
