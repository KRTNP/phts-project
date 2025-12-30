# Database Setup Guide

This directory contains SQL schema files for the PHTS system.

## Files

### `init_users.sql`
Creates the `users` table for authentication and authorization.

**Table Structure:**
- `user_id` - Primary key (auto-increment)
- `citizen_id` - 13-digit Thai Citizen ID (unique, acts as username)
- `password_hash` - Bcrypt hashed password
- `role` - User role (ENUM: USER, HEAD_DEPT, PTS_OFFICER, HEAD_HR, DIRECTOR, FINANCE_OFFICER, HEAD_FINANCE, ADMIN)
- `is_active` - Account status (boolean)
- `last_login_at` - Last login timestamp
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

## How to Execute

### Option 1: Using MySQL Command Line

```bash
# Navigate to the database directory
cd backend/src/database

# Execute the SQL file
mysql -u root -p phts_system < init_users.sql
```

### Option 2: Using MySQL Workbench or Other GUI Tools

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Select the `phts_system` database
4. Open `init_users.sql`
5. Execute the script

### Option 3: From Project Root (Windows)

```bash
# From D:\phts-workspace\phts-project\backend
mysql -u root -p phts_system < src/database/init_users.sql
```

## After Table Creation

Once the table is created, run the seeding script to populate users from the HRMS employees view:

```bash
# Navigate to backend directory
cd backend

# Run the seeding script
npx ts-node src/scripts/seed_users.ts
```

See `../scripts/README.md` for more information on the seeding process.

## Important Notes

1. The `users` table must be created before running the seed script
2. Ensure the `employees` view exists in the `phts_system` database
3. The HRMS source table (`hrms_databases.tb_ap_index_view`) must contain `birthdate` field
4. Default passwords are generated from birthdates in DDMMYYYY format
5. All passwords are hashed using bcrypt before storage

## Troubleshooting

### Error: "Table 'users' already exists"
This is normal if you've run the script before. The script includes `DROP TABLE IF EXISTS` to handle this.

### Error: "Database 'phts_system' doesn't exist"
Create the database first:
```sql
CREATE DATABASE phts_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error: "Access denied"
Ensure you have proper MySQL credentials and database permissions.
