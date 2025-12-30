/**
 * PHTS System - Create Test User Script
 *
 * Creates a test user for authentication testing
 *
 * Test User Details:
 * - Citizen ID: 1234567890123
 * - Password: 25021990 (25th Feb 1990)
 * - Role: ADMIN
 *
 * Date: 2025-12-30
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phts_system',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

const SALT_ROUNDS = 10;

async function createTestUser(): Promise<void> {
  let connection: mysql.Connection | null = null;

  try {
    console.log('========================================');
    console.log('PHTS Test User Creation Script');
    console.log('========================================\n');

    console.log(`Connecting to database: ${dbConfig.database}@${dbConfig.host}...`);
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully.\n');

    // Test user data
    const testUser = {
      citizen_id: '1234567890123',
      password: '25021990', // DDMMYYYY format
      role: 'ADMIN',
      name: 'Admin Test User',
    };

    console.log('Creating test user...');
    console.log(`Citizen ID: ${testUser.citizen_id}`);
    console.log(`Password: ${testUser.password}`);
    console.log(`Role: ${testUser.role}\n`);

    // Hash the password
    const passwordHash = await bcrypt.hash(testUser.password, SALT_ROUNDS);

    // Insert or update test user
    await connection.query(
      `INSERT INTO users (citizen_id, password_hash, role, is_active)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       role = VALUES(role),
       is_active = VALUES(is_active)`,
      [testUser.citizen_id, passwordHash, testUser.role]
    );

    console.log('✓ Test user created successfully!\n');

    // Verify the user was created
    const [users] = await connection.query<mysql.RowDataPacket[]>(
      'SELECT user_id, citizen_id, role, is_active FROM users WHERE citizen_id = ?',
      [testUser.citizen_id]
    );

    if (users.length > 0) {
      console.log('========================================');
      console.log('Test User Details:');
      console.log('========================================');
      console.log(`User ID: ${users[0].user_id}`);
      console.log(`Citizen ID: ${users[0].citizen_id}`);
      console.log(`Role: ${users[0].role}`);
      console.log(`Active: ${users[0].is_active === 1 ? 'Yes' : 'No'}`);
      console.log('========================================\n');

      console.log('You can now test the login endpoint with:');
      console.log(`  Citizen ID: ${testUser.citizen_id}`);
      console.log(`  Password: ${testUser.password}`);
      console.log('');
    }
  } catch (error) {
    console.error('\n========================================');
    console.error('FATAL ERROR');
    console.error('========================================');
    console.error('An error occurred during test user creation:\n');
    console.error(error);
    console.error('\nPlease check your database configuration and try again.\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Execute the function
createTestUser()
  .then(() => {
    console.log('Test user creation completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test user creation failed:', error);
    process.exit(1);
  });
