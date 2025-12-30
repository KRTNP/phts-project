# PHTS Backend - Setup Guide

This guide will walk you through setting up the PHTS backend database and seeding initial user data.

## Prerequisites

1. **MySQL 9.x** installed and running
2. **Node.js 18+** and npm installed
3. Access to the `phts_system` and `hrms_databases` databases

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Navigate to backend directory
cd D:\phts-workspace\phts-project\backend

# Install all dependencies
npm install
```

This will install:
- `mysql2` - MySQL database driver
- `bcryptjs` - Password hashing library
- `dotenv` - Environment variable management
- `typescript`, `ts-node`, `tsx` - TypeScript support
- And all other required dependencies

### Step 2: Configure Environment Variables

The `.env` file has been created for you. Update the database password if needed:

```env
# File: backend/.env

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here    # Update this
DB_NAME=phts_system
```

**Security Note**: Never commit the `.env` file to version control!

### Step 3: Verify Database Schema

Ensure the main `phts_system` database and `hrms_databases` are properly set up:

```bash
# Check if databases exist
mysql -u root -p -e "SHOW DATABASES LIKE 'phts_system';"
mysql -u root -p -e "SHOW DATABASES LIKE 'hrms_databases';"

# Check if employees view exists
mysql -u root -p phts_system -e "SHOW FULL TABLES WHERE table_type = 'VIEW';"
```

If `phts_system` doesn't exist, load the schema:

```bash
mysql -u root -p < D:\phts-workspace\phts_system.sql
```

### Step 4: Create Users Table

```bash
# Option 1: Using MySQL command line
mysql -u root -p phts_system < src/database/init_users.sql

# Option 2: Using MySQL Workbench
# - Open MySQL Workbench
# - Connect to your server
# - Open and execute src/database/init_users.sql
```

**Verification:**
```bash
mysql -u root -p phts_system -e "DESCRIBE users;"
```

Expected output:
```
+----------------+---------------+------+-----+-------------------+-------------------+
| Field          | Type          | Null | Key | Default           | Extra             |
+----------------+---------------+------+-----+-------------------+-------------------+
| user_id        | int           | NO   | PRI | NULL              | auto_increment    |
| citizen_id     | varchar(20)   | NO   | UNI | NULL              |                   |
| password_hash  | varchar(255)  | NO   |     | NULL              |                   |
| role           | enum(...)     | NO   |     | USER              |                   |
| is_active      | tinyint(1)    | NO   |     | 1                 |                   |
| last_login_at  | datetime      | YES  |     | NULL              |                   |
| created_at     | timestamp     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at     | timestamp     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+----------------+---------------+------+-----+-------------------+-------------------+
```

### Step 5: Seed Users from HRMS

```bash
# Run the seeding script
npm run seed:users

# OR directly with tsx
npx tsx src/scripts/seed_users.ts

# OR with ts-node
npx ts-node src/scripts/seed_users.ts
```

**Expected Output:**
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

### Step 6: Verify User Data

```bash
# Check number of users created
mysql -u root -p phts_system -e "SELECT COUNT(*) as total_users FROM users;"

# View sample users
mysql -u root -p phts_system -e "SELECT citizen_id, role, is_active, created_at FROM users LIMIT 10;"

# Check role distribution
mysql -u root -p phts_system -e "SELECT role, COUNT(*) as count FROM users GROUP BY role;"
```

### Step 7: Update User Roles (Optional)

By default, all users are seeded with role = 'USER'. To assign other roles:

```sql
-- Example: Assign ADMIN role to a specific user
UPDATE users
SET role = 'ADMIN'
WHERE citizen_id = '1234567890123';

-- Example: Assign HEAD_DEPT role to department heads
UPDATE users
SET role = 'HEAD_DEPT'
WHERE citizen_id IN (
  SELECT citizen_id
  FROM employees
  WHERE position_name LIKE '%หัวหน้าแผนก%'
);

-- Example: Assign PTS_OFFICER role
UPDATE users
SET role = 'PTS_OFFICER'
WHERE citizen_id = '9876543210987';

-- Verify changes
SELECT citizen_id, role FROM users WHERE role != 'USER';
```

## Database Schema Overview

### Users Table Structure

```sql
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `citizen_id` VARCHAR(20) NOT NULL,           -- 13-digit Thai Citizen ID (Username)
  `password_hash` VARCHAR(255) NOT NULL,       -- Bcrypt hashed password
  `role` ENUM(                                 -- User role for authorization
    'USER',                                    -- General Staff
    'HEAD_DEPT',                               -- Department Head
    'PTS_OFFICER',                             -- PTS Admin Staff
    'HEAD_HR',                                 -- HR Head
    'DIRECTOR',                                -- Hospital Director
    'FINANCE_OFFICER',                         -- Finance Staff
    'HEAD_FINANCE',                            -- Finance Head
    'ADMIN'                                    -- System Administrator
  ) NOT NULL DEFAULT 'USER',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,   -- Account active status
  `last_login_at` DATETIME NULL,               -- Last login timestamp
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `unique_citizen_id` (`citizen_id`)
);
```

### Default Authentication

- **Username**: 13-digit Thai Citizen ID (e.g., `1234567890123`)
- **Password**: Birthdate in DDMMYYYY format (e.g., `15031985` for March 15, 1985)
- **Example Login**:
  - Username: `1234567890123`
  - Password: `15031985`

## Troubleshooting

### Issue: "Cannot find module 'mysql2'"

**Solution:**
```bash
npm install mysql2 @types/node
```

### Issue: "Cannot find module 'bcryptjs'"

**Solution:**
```bash
npm install bcryptjs @types/bcryptjs
```

### Issue: "ER_ACCESS_DENIED_ERROR: Access denied for user"

**Solution:**
1. Check database password in `.env` file
2. Verify MySQL user has proper permissions:
```sql
GRANT ALL PRIVILEGES ON phts_system.* TO 'root'@'localhost';
GRANT SELECT ON hrms_databases.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Issue: "Table 'phts_system.employees' doesn't exist"

**Solution:**
Load the main database schema:
```bash
mysql -u root -p < D:\phts-workspace\phts_system.sql
```

### Issue: "No employees found in the employees view"

**Solution:**
1. Check if the `hrms_databases` exists and has data:
```sql
SELECT COUNT(*) FROM hrms_databases.tb_ap_index_view;
```

2. Verify the employees view filters:
```sql
SELECT COUNT(*) FROM phts_system.employees;
```

### Issue: "Many users skipped (No valid birthdate)"

**Solution:**
- This is expected for employees with missing birthdate data
- Check HRMS data quality:
```sql
SELECT COUNT(*)
FROM hrms_databases.tb_ap_index_view
WHERE birthdate IS NULL OR birthdate = '0000-00-00';
```
- Update birthdates in HRMS or manually create users for affected employees

### Issue: Script runs but no users inserted

**Solution:**
1. Check if users already exist:
```sql
SELECT COUNT(*) FROM users;
```

2. The script uses `INSERT IGNORE` - it won't insert duplicates
3. To re-seed, first clear the table:
```sql
TRUNCATE TABLE users;
```
Then run the seed script again.

## Security Considerations

1. **Change Default Passwords**:
   - Default passwords based on birthdates are predictable
   - Implement password change on first login
   - Consider password expiration policies

2. **Protect .env File**:
   - Never commit `.env` to version control
   - Add to `.gitignore`:
   ```
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

3. **Database Permissions**:
   - Use least privilege principle
   - Create separate DB user for the application
   - Don't use root in production

4. **Password Hashing**:
   - Script uses bcrypt with 10 salt rounds
   - Adjust `SALT_ROUNDS` in script if needed (higher = more secure but slower)

## Next Steps

After successful setup:

1. **Implement Authentication API**:
   - Create login endpoint
   - Implement JWT token generation
   - Add authentication middleware

2. **Role-Based Access Control**:
   - Create authorization middleware
   - Implement role-based route protection
   - Define permission matrices

3. **Frontend Integration**:
   - Create login page
   - Implement role-based redirection
   - Add token storage and management

4. **User Management**:
   - Password reset functionality
   - User profile updates
   - Account activation/deactivation

## File Structure

```
backend/
├── .env                          # Environment configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── SETUP.md                      # This file
├── src/
│   ├── database/
│   │   ├── init_users.sql       # Users table schema
│   │   └── README.md            # Database setup guide
│   └── scripts/
│       ├── seed_users.ts        # User seeding script
│       └── README.md            # Scripts documentation
└── dist/                         # Compiled JavaScript (after build)
```

## Support

For issues or questions:
1. Check this guide and the README files in subdirectories
2. Review error messages and logs
3. Verify database schema and connections
4. Contact the development team

---

**Last Updated**: 2025-12-30
**Version**: 1.0.0
