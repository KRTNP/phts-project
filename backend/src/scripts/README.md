# Database Seeding Scripts

This directory contains TypeScript scripts for populating database tables from HRMS data.

## Files

### `seed_users.ts`
Populates the `users` table from the HRMS `employees` view.

**What it does:**
1. Connects to the `phts_system` database
2. Fetches all employees from the `employees` view
3. Retrieves birthdate information from `hrms_databases.tb_ap_index_view`
4. Generates default passwords from birthdates (DDMMYYYY format)
5. Hashes passwords using bcrypt (10 salt rounds)
6. Inserts users into the `users` table with default role 'USER'

**Features:**
- Idempotent: Uses `INSERT IGNORE` to prevent duplicate entries
- Safe to run multiple times
- Comprehensive error handling
- Detailed logging and progress tracking
- Skips employees with invalid/missing birthdates

## Prerequisites

Before running the seeding script, ensure:

1. **Database Table Created**
   ```bash
   mysql -u root -p phts_system < src/database/init_users.sql
   ```

2. **Dependencies Installed**
   ```bash
   npm install mysql2 bcryptjs dotenv
   npm install --save-dev @types/bcryptjs @types/node ts-node typescript
   ```

3. **Environment Variables Configured**
   Edit `backend/.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=phts_system
   ```

## How to Execute

### Method 1: Using ts-node (Recommended for Development)

```bash
# From backend directory
cd backend

# Run the script
npx ts-node src/scripts/seed_users.ts
```

### Method 2: Compile and Run

```bash
# From backend directory
cd backend

# Compile TypeScript
npx tsc

# Run compiled JavaScript
node dist/scripts/seed_users.js
```

## Expected Output

```
========================================
PHTS User Seeding Script
========================================

Connecting to database: phts_system@localhost...
Database connection established successfully.

Fetching employees from HRMS employees view...
Found 150 employees to process.

Fetching birthdates from HRMS source table...
Fetched birthdate information for 150 employees.

Processing employees...

  ✓ SUCCESS: นพ.สมชาย ใจดี (1234567890123) - Default password: 15031985
  ✓ SUCCESS: พญ.สมหญิง สวยงาม (2345678901234) - Default password: 22071990
  ⚠ SKIP: นพ.ทดสอบ ระบบ (3456789012345) - No valid birthdate found
  ...

========================================
Seeding Summary
========================================
Total Employees Processed: 150
Successfully Inserted:     148
Skipped (No Birthdate):    2
Errors:                    0
========================================

Users have been seeded successfully!
Default password format: DDMMYYYY (based on birthdate)
Default role: USER

Database connection closed.

Seeding script completed successfully.
```

## Default Authentication Credentials

After seeding, users can log in with:
- **Username**: Their 13-digit Thai Citizen ID
- **Password**: Their birthdate in DDMMYYYY format
  - Example: Born on March 15, 1985 → Password: `15031985`
  - Example: Born on July 22, 1990 → Password: `22071990`

## Important Notes

1. **Password Security**:
   - Default passwords are based on birthdates (publicly available information)
   - Users should change their passwords after first login
   - Consider implementing password reset functionality

2. **Role Assignment**:
   - All seeded users get default role: `USER`
   - Administrators must manually update roles in the database for other positions
   - Example SQL to change role:
     ```sql
     UPDATE users SET role = 'ADMIN' WHERE citizen_id = '1234567890123';
     ```

3. **Data Integrity**:
   - The script validates birthdates before creating passwords
   - Employees without valid birthdates are skipped (not inserted)
   - Check the output log for skipped employees

4. **Performance**:
   - Bcrypt hashing is CPU-intensive
   - Large datasets (1000+ employees) may take several minutes
   - Progress is logged for each employee

## Troubleshooting

### Error: "Cannot find module 'mysql2'"
```bash
npm install mysql2
```

### Error: "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs @types/bcryptjs
```

### Error: "Table 'users' doesn't exist"
Run the schema creation script first:
```bash
mysql -u root -p phts_system < src/database/init_users.sql
```

### Error: "ER_ACCESS_DENIED_ERROR"
- Check your database credentials in `.env` file
- Ensure the MySQL user has proper permissions
- Verify the database exists: `SHOW DATABASES;`

### Error: "View 'employees' doesn't exist"
- Ensure the main database schema is loaded:
  ```bash
  mysql -u root -p < phts_system.sql
  ```
- Verify the view exists:
  ```sql
  SHOW FULL TABLES WHERE table_type = 'VIEW';
  ```

### Warning: "No valid birthdate found"
- This is expected for some employees in test/incomplete data
- The script safely skips these employees
- They will need to be added manually or their birthdates corrected in HRMS

## Next Steps

After successful seeding:
1. Test login with a seeded user
2. Update roles for administrators and department heads
3. Implement password change functionality
4. Consider adding password complexity requirements
5. Set up JWT authentication middleware

## Security Recommendations

1. **Never commit `.env` file** to version control
2. Use strong database passwords in production
3. Implement password expiration policies
4. Add rate limiting to login endpoints
5. Log authentication attempts for security auditing
6. Consider implementing 2FA for admin accounts
