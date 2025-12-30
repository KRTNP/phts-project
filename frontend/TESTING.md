# PHTS Frontend - Testing Guide

## Prerequisites

1. Backend API must be running on `http://localhost:3001`
2. Database must be seeded with test users

## Starting the Frontend

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The application will be available at: http://localhost:3000

## Test User Credentials

Based on the backend seeding, you can test with these sample credentials:

### Admin User
- **Citizen ID**: `1234567890123`
- **Password**: `01011990` (birthdate: Jan 1, 1990)
- **Role**: ADMIN
- **Expected Redirect**: `/dashboard/admin`

### Regular User
- **Citizen ID**: (Use any seeded citizen ID from database)
- **Password**: User's birthdate in DDMMYYYY format
- **Expected Redirect**: Based on user's role

## Testing Checklist

### Login Page (`/login`)
- [ ] Visit http://localhost:3000 (should redirect to `/login`)
- [ ] Verify glassmorphism card design with gradient background
- [ ] Test Citizen ID validation:
  - [ ] Empty field shows error
  - [ ] Non-numeric input is rejected
  - [ ] Less than 13 digits shows error
  - [ ] More than 13 digits is prevented
- [ ] Test password field:
  - [ ] Toggle visibility with eye icon
  - [ ] Empty field shows error
- [ ] Test form submission:
  - [ ] Invalid credentials show error alert
  - [ ] Valid credentials redirect to appropriate dashboard
  - [ ] Loading spinner appears during authentication

### Authentication Flow
- [ ] JWT token is stored in localStorage as `phts_token`
- [ ] User data is stored in localStorage as `phts_user`
- [ ] Refresh page on dashboard - should stay logged in
- [ ] Clear localStorage - should redirect to login

### Dashboard Pages

Test each role's dashboard:

1. **USER Dashboard** (`/dashboard/user`)
   - [ ] Shows 3 info cards (Personal Info, Requests, PTS History)
   - [ ] Welcome message displays
   - [ ] App bar shows role badge

2. **HEAD_DEPT Dashboard** (`/dashboard/approver`)
   - [ ] Shows 3 info cards (Pending, Approved, Staff)
   - [ ] Appropriate welcome message

3. **PTS_OFFICER Dashboard** (`/dashboard/officer`)
   - [ ] Basic dashboard layout
   - [ ] Role-specific messaging

4. **HEAD_HR Dashboard** (`/dashboard/hr-head`)
   - [ ] Dashboard displays correctly

5. **DIRECTOR Dashboard** (`/dashboard/director`)
   - [ ] Dashboard displays correctly

6. **FINANCE_OFFICER Dashboard** (`/dashboard/finance`)
   - [ ] Dashboard displays correctly

7. **HEAD_FINANCE Dashboard** (`/dashboard/finance-head`)
   - [ ] Dashboard displays correctly

8. **ADMIN Dashboard** (`/dashboard/admin`)
   - [ ] Dashboard displays correctly
   - [ ] All admin privileges mentioned

### Dashboard Common Features
- [ ] App bar with hospital icon and system name
- [ ] Role badge displays correctly (Thai + English)
- [ ] User menu accessible via avatar icon
- [ ] Citizen ID shown in menu
- [ ] Logout button works (clears storage, redirects to login)
- [ ] Footer displays copyright

### Responsive Design
- [ ] Mobile (320px): Single column layout, cards stack
- [ ] Tablet (768px): Two column grid
- [ ] Desktop (1024px+): Three column grid
- [ ] No horizontal scroll on any device

### Accessibility
- [ ] Tab navigation works throughout
- [ ] Focus states visible
- [ ] Form labels properly associated
- [ ] Error messages announced
- [ ] Color contrast meets WCAG AA

### Theme & Design
- [ ] Sarabun font loads from Google Fonts
- [ ] Primary teal color (#00695f) used consistently
- [ ] Background gray (#F4F6F8) applied
- [ ] Card shadows subtle and professional
- [ ] Button hover states smooth
- [ ] Rounded corners (12px) consistent

### Error Handling
- [ ] Invalid credentials show Thai error message
- [ ] Network errors handled gracefully
- [ ] 401 responses clear auth and redirect to login
- [ ] Loading states prevent double submission

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Known Limitations (Part 1)

- No registration page (users seeded from backend)
- Dashboards are skeleton UI (no actual functionality yet)
- No password reset feature
- No "remember me" option
- No multi-language switcher (Thai + English mixed)

## Next Testing Phase (Future)

After Part 2+ implementation:
- Employee profile management
- Leave request flows
- PTS payment calculations
- Approval workflows
- Admin panel features
- Reports and analytics

## Troubleshooting

### Issue: Login fails with network error
**Solution**: Ensure backend is running on port 3001

### Issue: Styles not loading
**Solution**: Check Google Fonts connection, ensure Emotion cache is working

### Issue: Redirect not working after login
**Solution**: Check browser console for role mismatch or routing errors

### Issue: TypeScript errors in IDE
**Solution**: Run `npm install` and restart TypeScript server

### Issue: Build fails
**Solution**: Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Performance Metrics

Expected performance:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.0s
- Bundle size: < 500KB (gzipped)

## Security Checklist

- [ ] JWT token stored securely (localStorage with httpOnly consideration for future)
- [ ] No sensitive data in URL parameters
- [ ] CSRF protection via backend
- [ ] XSS prevention via React's built-in escaping
- [ ] No credentials in client-side code
- [ ] API requests use HTTPS in production

## Reporting Issues

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Console errors (if any)
6. Screenshot (if applicable)
