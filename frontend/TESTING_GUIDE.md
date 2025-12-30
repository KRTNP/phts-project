# Part 2: Request System - Testing Guide

## Prerequisites

### 1. Start Backend Server
```bash
cd backend
npm run dev
# Should run on http://localhost:3001
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
# Should run on http://localhost:3000
```

### 3. Verify Database
Ensure MySQL is running and `phts_system` database is initialized with request tables.

---

## Test User Accounts

You'll need test users for each role. If not created, use the backend seeding script or create manually.

| Role | Username (Citizen ID) | Password | Dashboard URL |
|------|----------------------|----------|---------------|
| USER | 1234567890123 | 01011990 | /dashboard/user |
| HEAD_DEPT | 1234567890124 | 01011985 | /dashboard/approver |
| PTS_OFFICER | 1234567890125 | 01011988 | /dashboard/officer |
| HEAD_HR | 1234567890126 | 01011980 | /dashboard/hr-head |
| DIRECTOR | 1234567890127 | 01011975 | /dashboard/director |
| HEAD_FINANCE | 1234567890128 | 01011982 | /dashboard/finance-head |

---

## Testing Scenarios

### Scenario 1: Complete Workflow (Happy Path)

#### Step 1: User Creates Request
1. Login as **USER** (citizen ID: 1234567890123)
2. Navigate to dashboard (`/dashboard/user`)
3. Click **"ยื่นคำขอใหม่"** button
4. Fill out the form:
   - Select request type: "ขอรับค่าตอบแทนใหม่"
   - Enter notes: "ขอรับค่าตอบแทน พ.ต.ส. สำหรับตำแหน่งพยาบาลวิชาชีพ"
   - Upload files: Select 1-2 PDF or image files
5. Click **"ส่งคำขอ"**
6. Verify success toast appears
7. Check redirected to user dashboard
8. Verify request appears in "คำขอของฉัน" table
9. Note the request ID (e.g., #1)

**Expected Result:**
- Request created with status "รอดำเนินการ" (PENDING)
- Current step shows "ขั้นตอนที่ 1: หัวหน้าแผนก"

#### Step 2: HEAD_DEPT Approves
1. Logout and login as **HEAD_DEPT** (1234567890124)
2. Navigate to `/dashboard/approver`
3. Verify the request appears in pending list
4. Click **approve icon** (green checkmark)
5. In dialog, optionally add comment: "อนุมัติ เห็นควรดำเนินการ"
6. Click **"อนุมัติ"**
7. Verify success toast
8. Verify request removed from pending list

**Expected Result:**
- Request moved to Step 2 (PTS_OFFICER)

#### Step 3: PTS_OFFICER Approves
1. Logout and login as **PTS_OFFICER** (1234567890125)
2. Navigate to `/dashboard/officer`
3. Verify request appears
4. Approve with comment: "ตรวจสอบคุณสมบัติแล้ว ถูกต้อง"
5. Verify success

**Expected Result:**
- Request moved to Step 3 (HEAD_HR)

#### Step 4: HEAD_HR Approves
1. Logout and login as **HEAD_HR** (1234567890126)
2. Navigate to `/dashboard/hr-head`
3. Approve request

**Expected Result:**
- Request moved to Step 4 (DIRECTOR)

#### Step 5: DIRECTOR Approves
1. Logout and login as **DIRECTOR** (1234567890127)
2. Navigate to `/dashboard/director`
3. Approve request

**Expected Result:**
- Request moved to Step 5 (HEAD_FINANCE)

#### Step 6: HEAD_FINANCE Approves (Final)
1. Logout and login as **HEAD_FINANCE** (1234567890128)
2. Navigate to `/dashboard/finance-head`
3. Approve with comment: "อนุมัติการเบิกจ่าย"

**Expected Result:**
- Request status changed to "อนุมัติแล้ว" (APPROVED)
- Request no longer appears in any pending lists

#### Step 7: User Views Completed Request
1. Login as **USER** again
2. Go to dashboard
3. Click on the completed request in the table
4. Verify request detail page shows:
   - Status: "อนุมัติแล้ว" (green chip)
   - All attachments listed
   - Complete approval timeline with 6 actions
   - All comments visible

---

### Scenario 2: Rejection Flow

#### Test Rejection
1. Create new request as USER
2. Login as HEAD_DEPT
3. Click **reject icon** (red X)
4. Enter reason: "เอกสารไม่ครบถ้วน กรุณาแนบใบประกอบวิชาชีพ"
5. Click **"ไม่อนุมัติ"**

**Expected Result:**
- Request status: "ไม่อนุมัติ" (REJECTED - red)
- Request removed from all pending lists
- User can view rejection reason in request detail

---

### Scenario 3: Return Flow

#### Test Return to Previous Step
1. Create new request as USER
2. HEAD_DEPT approves (moves to Step 2)
3. Login as PTS_OFFICER
4. Click **return icon** (blue undo)
5. Enter reason: "กรุณาตรวจสอบเอกสารเพิ่มเติม"
6. Click **"ส่งกลับ"**

**Expected Result:**
- Request status: "ส่งกลับแก้ไข" (RETURNED - blue)
- Request goes back to Step 1
- HEAD_DEPT can see it in pending list again
- User can see return reason

---

### Scenario 4: Multiple Requests

#### Test Request List & Filtering
1. Login as USER
2. Create 3 different requests:
   - Request A: NEW_ENTRY
   - Request B: EDIT_INFO
   - Request C: RATE_CHANGE
3. Submit all three
4. Verify all appear in user's request table
5. Verify correct types shown

#### Test Approver View with Multiple Requests
1. Login as HEAD_DEPT
2. Verify all 3 requests appear in pending list
3. Approve Request A
4. Reject Request B
5. Return Request C
6. Verify list updates correctly after each action

---

## UI/UX Testing

### Responsive Design
- [ ] Test on desktop (1920px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Verify tables scroll horizontally on mobile
- [ ] Verify forms stack vertically on mobile

### File Upload
- [ ] Drag and drop single file
- [ ] Drag and drop multiple files
- [ ] Click to browse files
- [ ] Upload PDF file
- [ ] Upload JPG file
- [ ] Upload PNG file
- [ ] Try invalid file type (should show error)
- [ ] Try file > 5MB (should show error)
- [ ] Try uploading 6 files (should show error)
- [ ] Remove uploaded file
- [ ] Verify file icons display correctly

### Form Validation
- [ ] Try submitting without selecting request type
- [ ] Try submitting without notes
- [ ] Try submitting without files
- [ ] Verify Thai error messages display
- [ ] Verify required fields marked with *

### Loading States
- [ ] Verify spinner on page load
- [ ] Verify skeleton on table load
- [ ] Verify button shows loading during submit
- [ ] Verify dialog shows loading during action

### Error Handling
- [ ] Stop backend server
- [ ] Try creating request (should show connection error)
- [ ] Try viewing requests (should show error)
- [ ] Restart backend, verify works again

### Toast Notifications
- [ ] Verify success toast on create
- [ ] Verify success toast on approve
- [ ] Verify success toast on reject
- [ ] Verify success toast on return
- [ ] Verify error toast on failure
- [ ] Verify toast auto-closes after 6 seconds
- [ ] Verify toast can be manually closed

---

## API Integration Testing

### Check Network Tab
For each action, verify in browser DevTools:

#### Create Request
```
POST /api/requests
Content-Type: multipart/form-data
Status: 201 Created
Response: { success: true, data: {...}, message: "..." }
```

#### Get Requests
```
GET /api/requests
Status: 200 OK
Response: { success: true, data: [...] }
```

#### Approve Request
```
POST /api/requests/:id/approve
Status: 200 OK
Response: { success: true, data: {...}, message: "..." }
```

---

## Common Issues & Troubleshooting

### Issue: "การเชื่อมต่อล้มเหลว"
**Solution:** Ensure backend is running on port 3001

### Issue: Request not appearing in approver list
**Solution:**
- Check user role matches the current step
- Verify request status is PENDING
- Check backend console for errors

### Issue: File upload fails
**Solution:**
- Check file size < 5MB
- Verify file type is PDF/JPG/PNG
- Check backend upload directory exists and has write permissions

### Issue: Timeline not showing
**Solution:**
- Verify backend returns `actions` array with request
- Check date formatting works with Thai locale

### Issue: Auto-fill not working in RequestForm
**Solution:**
- Currently shows mock data
- In production, fetch from `/api/users/me`

---

## Performance Testing

- [ ] Create request with 5 large files (close to 5MB each)
- [ ] View request list with 50+ requests
- [ ] Test rapid approve/reject actions
- [ ] Check memory usage in DevTools

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Checklist Summary

### Critical Paths
- [x] User can create request
- [x] User can view their requests
- [x] Approver can view pending requests
- [x] Approver can approve request
- [x] Approver can reject request
- [x] Approver can return request
- [x] Request detail page shows all info
- [x] Timeline displays correctly
- [x] File upload works

### UI/UX
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Thai language
- [x] Toast notifications
- [x] Form validation

### Integration
- [x] API calls work
- [x] Authentication works
- [x] File upload works
- [x] Date formatting works

---

**All tests should pass before deploying to production!**
