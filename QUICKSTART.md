# PHTS Part 2: Request System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MySQL 9.x running
- Git (optional)

---

## Step 1: Start Backend (Terminal 1)

```bash
cd phts-project/backend

# Install dependencies (first time only)
npm install

# Create .env file (if not exists)
cat > .env << EOF
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=phts_system
EOF

# Run database migrations (first time only)
# Make sure phts_system database exists and request tables are created

# Start backend server
npm run dev
```

**Expected output:**
```
Server running on port 3001
Database connected successfully
```

---

## Step 2: Start Frontend (Terminal 2)

```bash
cd phts-project/frontend

# Install dependencies (first time only)
npm install

# Create .env.local file (if not exists)
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

# Start development server
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- Local:        http://localhost:3000
```

---

## Step 3: Open Browser

Navigate to: **http://localhost:3000**

---

## Step 4: Login

### Test User Account
```
Username: 1234567890123
Password: 01011990
```

If this doesn't work, you need to create test users in the database.

---

## Step 5: Test the Workflow

### Create a Request
1. After login, you'll see the user dashboard
2. Click **"ยื่นคำขอใหม่"** (New Request) button
3. Fill out the form:
   - Select request type: **"ขอรับค่าตอบแทนใหม่"**
   - Enter notes: **"ทดสอบระบบ"**
   - Upload a file (any PDF or image)
4. Click **"ส่งคำขอ"** (Submit)
5. You should see a success message

### View Request
1. You'll be redirected to the dashboard
2. Your request should appear in the **"คำขอของฉัน"** table
3. Click on the request to view details

### Approve as Department Head
1. Logout (menu in top-right)
2. Login as HEAD_DEPT:
   ```
   Username: 1234567890124
   Password: 01011985
   ```
3. You should see the pending request
4. Click the green checkmark to approve
5. Add optional comment and confirm

---

## 🎯 Key URLs

| Page | URL | Role Required |
|------|-----|---------------|
| Login | http://localhost:3000/login | None |
| User Dashboard | http://localhost:3000/dashboard/user | USER |
| New Request | http://localhost:3000/dashboard/user/request | USER |
| Approver (Step 1) | http://localhost:3000/dashboard/approver | HEAD_DEPT |
| Officer (Step 2) | http://localhost:3000/dashboard/officer | PTS_OFFICER |
| HR Head (Step 3) | http://localhost:3000/dashboard/hr-head | HEAD_HR |
| Director (Step 4) | http://localhost:3000/dashboard/director | DIRECTOR |
| Finance Head (Step 5) | http://localhost:3000/dashboard/finance-head | HEAD_FINANCE |

---

## 🧪 Quick Test Scenarios

### Scenario A: Happy Path (5 min)
1. Login as USER → Create request → Submit
2. Login as HEAD_DEPT → Approve
3. Login as PTS_OFFICER → Approve
4. Login as HEAD_HR → Approve
5. Login as DIRECTOR → Approve
6. Login as HEAD_FINANCE → Approve
7. Login as USER → View approved request

### Scenario B: Rejection (2 min)
1. Login as USER → Create request
2. Login as HEAD_DEPT → Reject with reason
3. Login as USER → View rejected request

### Scenario C: Return (3 min)
1. Login as USER → Create request
2. Login as HEAD_DEPT → Approve
3. Login as PTS_OFFICER → Return with reason
4. Login as HEAD_DEPT → See returned request

---

## 📋 Test User Roles

Create these users in `pts_users` table if they don't exist:

```sql
-- USER (Step 0: Creates requests)
INSERT INTO pts_users (citizen_id, role, password_hash) VALUES
('1234567890123', 'USER', '$2b$10$...'); -- password: 01011990

-- HEAD_DEPT (Step 1: First approver)
INSERT INTO pts_users (citizen_id, role, password_hash) VALUES
('1234567890124', 'HEAD_DEPT', '$2b$10$...'); -- password: 01011985

-- PTS_OFFICER (Step 2: Second approver)
INSERT INTO pts_users (citizen_id, role, password_hash) VALUES
('1234567890125', 'PTS_OFFICER', '$2b$10$...'); -- password: 01011988

-- HEAD_HR (Step 3: Third approver)
INSERT INTO pts_users (citizen_id, role, password_hash) VALUES
('1234567890126', 'HEAD_HR', '$2b$10$...'); -- password: 01011980

-- DIRECTOR (Step 4: Fourth approver)
INSERT INTO pts_users (citizen_id, role, password_hash) VALUES
('1234567890127', 'DIRECTOR', '$2b$10$...'); -- password: 01011975

-- HEAD_FINANCE (Step 5: Final approver)
INSERT INTO pts_users (citizen_id, role, password_hash) VALUES
('1234567890128', 'HEAD_FINANCE', '$2b$10$...'); -- password: 01011982
```

**Note:** Use the backend's password hashing to generate proper password hashes.

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is already in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Mac/Linux

# Check MySQL connection
mysql -u root -p
SHOW DATABASES;
USE phts_system;
SHOW TABLES;
```

### Frontend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Can't login
```bash
# Check if user exists
mysql -u root -p
USE phts_system;
SELECT citizen_id, role FROM pts_users;
```

### Request not appearing
```bash
# Check backend console for errors
# Check browser console (F12) for errors
# Check Network tab for failed API calls
```

### File upload fails
```bash
# Check backend uploads directory exists
cd backend
mkdir -p uploads

# Check permissions
ls -la uploads/  # Should be writable
```

---

## 📊 What You Should See

### User Dashboard
- Welcome message
- 3 stat cards (Profile, Requests, Payment History)
- "My Requests" section with table
- "New Request" button

### New Request Page
- Form with 4 sections:
  1. User Info (auto-filled, read-only)
  2. Request Type (radio buttons)
  3. Details/Reason (text field)
  4. File Upload (drag-drop area)
- Submit button

### Approver Dashboard
- Pending request count
- Table with pending requests
- Action buttons: View, Approve, Reject, Return

### Request Detail Page
- Request header with status
- Request details
- Attachments list
- Approval history timeline

---

## 🎨 UI Features to Check

- [ ] Medical Clean theme (teal/blue colors)
- [ ] Thai language throughout
- [ ] Status chips are color-coded
- [ ] Loading spinners appear
- [ ] Toast notifications work
- [ ] Forms validate properly
- [ ] File upload with drag-drop
- [ ] Responsive on mobile
- [ ] Timeline shows approval history

---

## 📚 Next Steps

1. ✅ Complete the Quick Start (above)
2. 📖 Read `TESTING_GUIDE.md` for detailed testing
3. 📄 Check `PART2_IMPLEMENTATION_SUMMARY.md` for architecture
4. 🧪 Run all test scenarios
5. 🚀 Deploy to staging/production

---

## 🆘 Need Help?

### Common Issues

**Issue:** "การเชื่อมต่อล้มเหลว" (Connection failed)
**Fix:** Make sure backend is running on http://localhost:3001

**Issue:** Files not uploading
**Fix:** Check backend `uploads/` directory exists and is writable

**Issue:** Timeline not showing
**Fix:** Ensure backend returns `actions` array in request details

**Issue:** Auto-fill not working
**Fix:** This is expected - uses mock data. In production, fetch from `/api/users/me`

### Check Backend Health

```bash
curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"citizen_id":"1234567890123","password":"01011990"}'
```

Should return:
```json
{
  "success": true,
  "token": "eyJ...",
  "user": {...}
}
```

---

## ✅ Success Criteria

You'll know everything is working when:

1. ✅ You can login as USER
2. ✅ You can create a request with files
3. ✅ Request appears in your list
4. ✅ You can view request details
5. ✅ Approver can see pending request
6. ✅ Approver can approve/reject/return
7. ✅ Timeline shows all actions
8. ✅ Status updates correctly

---

**Ready to start? Follow Steps 1-5 above!** 🚀
