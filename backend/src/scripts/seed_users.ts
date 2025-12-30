/**
 * PHTS System - User Seeding Script
 *
 * This script populates the 'users' table from the HRMS 'employees' view.
 *
 * Default Authentication:
 * - Username: citizen_id (13-digit Thai Citizen ID)
 * - Password: birthdate in DDMMYYYY format (e.g., 25021990)
 * - Default Role: USER
 *
 * Usage:
 *   npx ts-node src/scripts/seed_users.ts
 *
 * Requirements:
 *   - mysql2 package installed
 *   - bcryptjs package installed
 *   - @types/bcryptjs package installed (dev dependency)
 *   - .env file configured with database credentials
 *
 * @author Database Specialist (Sub-Agent 1)
 * @date 2025-12-30
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Interface for employee data from HRMS
 */
interface EmployeeRecord {
  citizen_id: string;
  birthdate?: Date | string | null;
  first_name?: string;
  last_name?: string;
}

/**
 * Configuration for database connection
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phts_system',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

/**
 * Number of bcrypt salt rounds for password hashing
 */
const SALT_ROUNDS = 10;

/**
 * Converts a Date object to DDMMYYYY format for default password
 *
 * @param date - The birthdate to convert
 * @returns Formatted date string (DDMMYYYY) or null if invalid
 */
function formatBirthdateToPassword(date: Date | string | null | undefined): string | null {
  if (!date) {
    return null;
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check for invalid dates
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = dateObj.getFullYear();

    return `${day}${month}${year}`;
  } catch (error) {
    console.error('Error formatting birthdate:', error);
    return null;
  }
}

/**
 * Main seeding function
 */
async function seedUsers(): Promise<void> {
  let connection: mysql.Connection | null = null;

  try {
    console.log('========================================');
    console.log('PHTS User Seeding Script');
    console.log('========================================\n');

    // Establish database connection
    console.log(`Connecting to database: ${dbConfig.database}@${dbConfig.host}...`);
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully.\n');

    // Fetch all employees from the HRMS view
    console.log('Fetching employees from HRMS employees view...');
    const [employees] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT
        citizen_id,
        first_name,
        last_name
      FROM employees
      WHERE citizen_id IS NOT NULL
        AND citizen_id != ''
      ORDER BY citizen_id`
    );

    if (!employees || employees.length === 0) {
      console.warn('WARNING: No employees found in the employees view.');
      console.log('Please ensure the employees view is properly configured and contains data.\n');
      return;
    }

    console.log(`Found ${employees.length} employees to process.\n`);

    // NOTE: The employees view doesn't include birthdate field
    // We need to fetch birthdate from the source HRMS table
    console.log('Fetching birthdates from HRMS source table...');
    const [hrmsData] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT
        id as citizen_id,
        birthdate
      FROM hrms_databases.tb_ap_index_view
      WHERE id IS NOT NULL
        AND id != ''`
    );

    // Create a map of citizen_id -> birthdate for quick lookup
    const birthdateMap = new Map<string, Date | string | null>();
    hrmsData.forEach((row) => {
      birthdateMap.set(row.citizen_id, row.birthdate);
    });

    console.log(`Fetched birthdate information for ${birthdateMap.size} employees.\n`);

    // Process each employee
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    console.log('Processing employees...\n');

    for (const employee of employees as EmployeeRecord[]) {
      const { citizen_id, first_name, last_name } = employee;
      const displayName = `${first_name || ''} ${last_name || ''}`.trim() || citizen_id;

      try {
        // Get birthdate from map
        const birthdate = birthdateMap.get(citizen_id);

        // Generate default password from birthdate
        const defaultPassword = formatBirthdateToPassword(birthdate);

        if (!defaultPassword) {
          console.warn(`  ⚠ SKIP: ${displayName} (${citizen_id}) - No valid birthdate found`);
          skipCount++;
          continue;
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

        // Insert user into users table (INSERT IGNORE for idempotency)
        await connection.query(
          `INSERT IGNORE INTO users (citizen_id, password_hash, role, is_active)
           VALUES (?, ?, 'USER', 1)`,
          [citizen_id, passwordHash]
        );

        console.log(`  ✓ SUCCESS: ${displayName} (${citizen_id}) - Default password: ${defaultPassword}`);
        successCount++;
      } catch (error) {
        console.error(`  ✗ ERROR: ${displayName} (${citizen_id}) - ${error}`);
        errorCount++;
      }
    }

    // Summary
    console.log('\n========================================');
    console.log('Seeding Summary');
    console.log('========================================');
    console.log(`Total Employees Processed: ${employees.length}`);
    console.log(`Successfully Inserted:     ${successCount}`);
    console.log(`Skipped (No Birthdate):    ${skipCount}`);
    console.log(`Errors:                    ${errorCount}`);
    console.log('========================================\n');

    if (successCount > 0) {
      console.log('Users have been seeded successfully!');
      console.log('Default password format: DDMMYYYY (based on birthdate)');
      console.log('Default role: USER\n');
    }
  } catch (error) {
    console.error('\n========================================');
    console.error('FATAL ERROR');
    console.error('========================================');
    console.error('An error occurred during the seeding process:\n');
    console.error(error);
    console.error('\nPlease check your database configuration and try again.\n');
    process.exit(1);
  } finally {
    // Close database connection
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Execute the seeding function
seedUsers()
  .then(() => {
    console.log('\nSeeding script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nSeeding script failed:', error);
    process.exit(1);
  });
