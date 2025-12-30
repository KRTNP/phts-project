# PHTS - Public Health Talent System

**ระบบค่าตอบแทนกำลังคนด้านสาธารณสุข**

A hospital staff management system for Thai healthcare facilities. Manages professional talent allowances (PTS payments), leave tracking, and employee data integrated with existing HRMS.

---

## Project Structure

```
phts-project/
├── frontend/          # Next.js (App Router) + Material UI v5
├── backend/           # Express.js + TypeScript + Passport.js (JWT)
└── README.md          # This file
```

### Frontend (`/frontend`)

- **Framework**: Next.js 14+ with App Router
- **UI Library**: Material UI (MUI) v5
- **Language**: TypeScript
- **Styling**: Emotion (MUI default) + Thai font support (Sarabun/Prompt)
- **Theme**: "Medical Clean" - Minimalist, Professional, Trustworthy

### Backend (`/backend`)

- **Framework**: Express.js
- **Language**: TypeScript (with JavaScript interoperability)
- **Authentication**: Passport.js with JWT Strategy
- **Database**: MySQL 9.x via `mysql2` driver
- **Database Name**: `phts_system`

---

## Tech Stack Summary

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js (App Router), MUI v5, TypeScript |
| Backend    | Node.js, Express.js, TypeScript     |
| Auth       | Passport.js (JWT Strategy)          |
| Database   | MySQL 9.x (`mysql2` driver)         |
| Structure  | Monorepo                            |

---

## Authentication Concept

- **Username**: 13-digit Thai Citizen ID (`citizen_id`)
- **Default Password**: User's birthdate in `DDMMYYYY` format (e.g., `25021990`)
- **No Registration Page**: Users are pre-seeded from HRMS `employees` view
- **JWT Token Payload**: `{ userId, citizenId, role }`

---

## User Roles

| Role Code         | Description                    | Dashboard Route           |
|-------------------|--------------------------------|---------------------------|
| `USER`            | General Staff (Requester)      | `/dashboard/user`         |
| `HEAD_DEPT`       | Head of Department             | `/dashboard/approver`     |
| `PTS_OFFICER`     | P.T.S. Officer (Admin Staff)   | `/dashboard/officer`      |
| `HEAD_HR`         | Head of Human Resources        | `/dashboard/hr-head`      |
| `DIRECTOR`        | Hospital Director              | `/dashboard/director`     |
| `FINANCE_OFFICER` | Finance Staff                  | `/dashboard/finance`      |
| `HEAD_FINANCE`    | Head of Finance                | `/dashboard/finance-head` |
| `ADMIN`           | System Administrator           | `/dashboard/admin`        |

---

## Database Architecture

The system uses `phts_system` database which integrates with existing `hrms_databases`:

### Core Tables
- `holidays` - Thai public holidays for work day calculations
- `pts_payment_history` - Monthly PTS payment records per employee
- `pts_rate_adjustments` - PTS rate change history

### Views (pulling from HRMS)
- `employees` - Main employee data with computed PTS rates
- `employee_licenses` - Professional licenses
- `employee_movements` - Employment status changes
- `leave_requests` - Leave records with automatic classification
- `leave_quotas` - Annual leave allowances
- `pts_rate_history_combined` - Combined rate adjustments

---

## UI/UX Design System

**Theme: "Medical Clean"**

| Property     | Value                                    |
|--------------|------------------------------------------|
| Style        | Minimalist, Professional, Trustworthy    |
| Primary      | Deep Teal / Medical Blue                 |
| Background   | Light Gray `#F4F6F8`                     |
| Typography   | 'Sarabun' or 'Prompt' (Google Fonts)     |
| Accessibility| WCAG 2.1 AA compliance minimum           |

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- MySQL 9.x
- npm or yarn

### Installation

```bash
# Clone the repository
cd phts-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

1. Create the `phts_system` database
2. Run the migration script (see `/backend/migrations`)
3. Seed initial user data from HRMS

### Running Development Servers

```bash
# Terminal 1: Backend (port 3001)
cd backend
npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend
npm run dev
```

---

## Development Phase

**Current Phase**: Part 1 - Identity & Foundation

### Part 1 Deliverables
1. Monorepo Project Structure
2. Database Migration Script (`users` table creation & seeding)
3. Backend Authentication API (Login endpoint)
4. Frontend Login Page with Role-Based Redirection

---

## Related Documentation

- `doc_1_requirements.md` - Part 1 Requirements Specification
- `phts_system.sql` - Database Schema
- `CLAUDE.md` - AI Assistant Guidelines

---

## License

Proprietary - Internal Use Only
