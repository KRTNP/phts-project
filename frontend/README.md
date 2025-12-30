# PHTS Frontend - Public Health Talent System

Professional hospital-grade frontend for managing healthcare staff talent allowances (ค่าตอบแทนกำลังคนด้านสาธารณสุข).

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **UI Library**: Material UI v7 (MUI)
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Fonts**: Sarabun (Google Fonts) - Thai language optimized

## Design System: Medical Clean

A professional, minimalist theme designed for healthcare environments:

- **Primary Color**: Deep Teal (#00695f) - Conveys trust and professionalism
- **Background**: Light Gray (#F4F6F8) - Reduces eye strain
- **Typography**: Sarabun font family - Thai language support
- **Components**: Custom MUI theme with soft shadows and rounded corners
- **Style**: Glassmorphism for login, clean cards for dashboards

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page (redirects to login)
│   ├── login/
│   │   └── page.tsx            # Login page with form validation
│   └── dashboard/
│       ├── user/               # USER role dashboard
│       ├── approver/           # HEAD_DEPT role dashboard
│       ├── officer/            # PTS_OFFICER role dashboard
│       ├── hr-head/            # HEAD_HR role dashboard
│       ├── director/           # DIRECTOR role dashboard
│       ├── finance/            # FINANCE_OFFICER role dashboard
│       ├── finance-head/       # HEAD_FINANCE role dashboard
│       └── admin/              # ADMIN role dashboard
├── components/
│   └── dashboard/
│       └── DashboardLayout.tsx # Reusable dashboard layout
├── services/
│   └── authService.ts          # Authentication service
├── lib/
│   └── axios.ts                # Axios instance with interceptors
├── theme/
│   ├── palette.ts              # Color palette
│   ├── typography.ts           # Typography settings
│   ├── index.ts                # Theme composition
│   └── ThemeRegistry.tsx       # MUI theme provider for App Router
└── types/
    └── auth.ts                 # Authentication type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3001`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env.local` file (already created):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Run development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication

### Login Credentials Format

- **Username**: 13-digit Thai Citizen ID (e.g., `1234567890123`)
- **Password**: User's birthdate in `DDMMYYYY` format (e.g., `25021990`)

### User Roles & Routes

| Role | Route | Description |
|------|-------|-------------|
| USER | `/dashboard/user` | General staff |
| HEAD_DEPT | `/dashboard/approver` | Department head |
| PTS_OFFICER | `/dashboard/officer` | PTS admin staff |
| HEAD_HR | `/dashboard/hr-head` | HR head |
| DIRECTOR | `/dashboard/director` | Hospital director |
| FINANCE_OFFICER | `/dashboard/finance` | Finance staff |
| HEAD_FINANCE | `/dashboard/finance-head` | Finance head |
| ADMIN | `/dashboard/admin` | System administrator |

### JWT Token Management

- Tokens are stored in `localStorage` as `phts_token`
- User profile is stored as `phts_user`
- Automatic redirect to `/login` on 401 Unauthorized
- Token is attached to all API requests via Axios interceptor

## Features Implemented

### Login Page (`/login`)
- Glassmorphism card design with gradient background
- Real-time Citizen ID validation (13 digits, numeric only)
- Password visibility toggle
- Form validation with Thai error messages
- Loading states during authentication
- Role-based redirection after successful login
- Accessible form with proper labels and ARIA attributes

### Dashboard Layout
- Responsive app bar with user info and role badge
- User menu with logout functionality
- Professional header with hospital icon
- Footer with copyright
- Protected routes (redirects to login if not authenticated)

### Theme System
- Custom MUI theme with Medical Clean palette
- Sarabun font from Google Fonts
- Consistent component styling (buttons, cards, inputs)
- Soft shadows for depth
- Responsive typography

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## API Integration

The frontend communicates with the backend via:

- **Base URL**: `http://localhost:3001` (configurable via env)
- **Login Endpoint**: `POST /api/auth/login`
- **Request Format**:
  ```json
  {
    "citizen_id": "1234567890123",
    "password": "25021990"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "citizen_id": "1234567890123",
      "role": "USER",
      "is_active": true,
      "last_login_at": "2025-12-30T..."
    }
  }
  ```

## Accessibility

- All form inputs have proper labels
- Color contrast meets WCAG AA standards
- Keyboard navigation supported
- Focus states clearly visible
- Error messages associated with inputs
- Responsive design for mobile/tablet/desktop

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps (Future Development)

- Employee profile management
- Leave request system
- PTS payment history
- Approval workflows
- Admin panel features
- Reports and analytics
- Real-time notifications

## Notes

- No registration page - users are seeded from HRMS database
- All authentication happens via backend API
- Client-side routing with Next.js App Router
- Type-safe with TypeScript throughout

## License

Internal hospital system - Proprietary
