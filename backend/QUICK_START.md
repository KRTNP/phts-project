# PHTS Backend - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
cd D:\phts-workspace\phts-project\backend
npm install
```

### 2. Configure Database
Edit `.env` file and set your MySQL password:
```env
DB_PASSWORD=your_password_here
```

### 3. Create Users Table
```bash
mysql -u root -p phts_system < src/database/init_users.sql
```

### 4. Seed Users
```bash
npm run seed:users
```

That's it! Users are now loaded from HRMS.

---

## 📋 What Was Created

### SQL Schema
- **File**: `src/database/init_users.sql`
- **Purpose**: Creates the `users` table for authentication
- **Table**: `users` with 8 columns (user_id, citizen_id, password_hash, role, etc.)

### Seeding Script
- **File**: `src/scripts/seed_users.ts`
- **Purpose**: Populates users from HRMS `employees` view
- **Features**:
  - Auto-generates passwords from birthdates (DDMMYYYY format)
  - Hashes passwords with bcrypt
  - Safe to run multiple times (idempotent)

### Configuration
- **File**: `.env`
- **Purpose**: Database connection credentials
- **Security**: DO NOT commit this file!

---

## 🔐 Default Login Credentials

After seeding, employees can log in with:

- **Username**: Their 13-digit Thai Citizen ID
- **Password**: Their birthdate in DDMMYYYY format

**Example**:
- Citizen ID: `1234567890123`
- Born: March 15, 1985
- Password: `15031985`

---

## 🎭 User Roles

All users start with role = `USER`. Update roles as needed:

```sql
-- Make someone an admin
UPDATE users SET role = 'ADMIN' WHERE citizen_id = '1234567890123';

-- Make someone a department head
UPDATE users SET role = 'HEAD_DEPT' WHERE citizen_id = '2345678901234';

-- Make someone a PTS officer
UPDATE users SET role = 'PTS_OFFICER' WHERE citizen_id = '3456789012345';
```

**Available Roles**:
- `USER` - General Staff
- `HEAD_DEPT` - Department Head
- `PTS_OFFICER` - PTS Admin Staff
- `HEAD_HR` - HR Head
- `DIRECTOR` - Hospital Director
- `FINANCE_OFFICER` - Finance Staff
- `HEAD_FINANCE` - Finance Head
- `ADMIN` - System Administrator

---

## 📊 Verify Setup

```bash
# Check users were created
mysql -u root -p phts_system -e "SELECT COUNT(*) FROM users;"

# View sample users
mysql -u root -p phts_system -e "SELECT citizen_id, role, created_at FROM users LIMIT 5;"

# Check role distribution
mysql -u root -p phts_system -e "SELECT role, COUNT(*) FROM users GROUP BY role;"
```

---

## 🔧 Troubleshooting

### No employees found?
- Ensure `phts_system.sql` is loaded: `mysql -u root -p < D:\phts-workspace\phts_system.sql`

### Users skipped (no birthdate)?
- Normal for employees with missing birthdate in HRMS
- Check the seeding output log for details

### Need to re-seed?
```sql
TRUNCATE TABLE users;
```
Then run `npm run seed:users` again.

---

## 📚 Full Documentation

- **Detailed Setup**: See `SETUP.md`
- **Database Guide**: See `src/database/README.md`
- **Scripts Guide**: See `src/scripts/README.md`

---

## 🚀 Running the Server

### Start Development Server
```bash
npm run dev
```

Server starts on: **http://localhost:3001**

### Test API Endpoints

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Login (Test User):**
```bash
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"citizen_id\":\"1234567890123\",\"password\":\"25021990\"}"
```

**Get Current User (Protected):**
```bash
curl -X GET http://localhost:3001/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Users Available

**Admin User (Active):**
- Citizen ID: `1234567890123`
- Password: `25021990`
- Role: ADMIN

**Inactive User (for testing 403):**
- Citizen ID: `9876543210987`
- Password: `15081995`
- Role: USER (Inactive)

---

## 🔜 Next Steps

1. ✅ ~~Implement authentication API endpoints~~ (COMPLETED)
2. ✅ ~~Create JWT token generation~~ (COMPLETED)
3. Build login page in frontend
4. Connect frontend to authentication API
5. Implement role-based routing in frontend
6. Add password change functionality

---

## 📖 Documentation

- **API Documentation**: `backend/README.md`
- **Implementation Details**: `BACKEND_AUTHENTICATION_IMPLEMENTATION.md`
- **Database Guide**: `src/database/README.md`

---

**Created**: 2025-12-30
**Updated**: 2025-12-30
**Version**: 1.0.0
**Database**: MySQL 9.x
**Node.js**: 18+
**Status**: Authentication API COMPLETED ✓
