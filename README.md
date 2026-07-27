# Smart Society Hub 🏠

An all-in-one digital platform for residential society management connecting residents, committee members, security guards, maintenance staff, and vendors.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Framer Motion |
| State | Zustand + React Query |
| Backend | Node.js + Express.js + Socket.IO |
| Auth | JWT (Access + Refresh Tokens) |
| DB (Relational) | SQLite3 (Node.js built-in) |
| DB (Document) | MongoDB + Mongoose |
| File Storage | Cloudinary |
| Charts | Recharts |

## Getting Started

### Prerequisites
- Node.js v22+ (required for built-in `node:sqlite`)
- MongoDB (local or Atlas URI)

### 1. Clone & setup environment

```bash
cp .env.example server/.env
cp .env.example client/.env
# Edit server/.env with your MongoDB URI, Cloudinary, and SMTP config
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

## Project Structure

```
Smart Society Hub/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/          # AuthGuard, RoleGuard
│   │   │   └── layout/        # Sidebar, Topbar, DashboardLayout
│   │   ├── hooks/             # useSocket
│   │   ├── pages/             # All pages
│   │   │   ├── auth/          # Login, Register, ForgotPassword
│   │   │   └── dashboards/    # 5 role dashboards
│   │   ├── services/          # api.js, auth.service.js
│   │   ├── store/             # Zustand stores
│   │   └── App.jsx            # Router
├── server/                    # Node.js + Express backend
│   └── src/
│       ├── config/            # DB connections, Socket.IO
│       ├── controllers/       # Auth, Users
│       ├── middleware/        # Auth, RBAC, Error, Upload
│       ├── models/            # Mongoose models
│       ├── routes/            # API routes
│       └── utils/             # JWT, Email, Response helpers
├── database/
│   ├── sqlite/schema.sql      # SQLite schema reference
│   └── mongo/indexes.js       # MongoDB index definitions
├── .env.example               # Environment variable template
└── prd.md                     # Product Requirements Document
```

## User Roles

| Role | Description |
|---|---|
| `resident` | Society residents with standard access |
| `committee` | Admin with management and analytics access |
| `security` | Gate management and visitor verification |
| `maintenance` | Maintenance task tracking and updates |
| `vendor` | External service providers |

## API Endpoints (Phase 1)

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login (returns JWT tokens)
- `POST /api/auth/logout` — Logout
- `POST /api/auth/refresh-token` — Refresh access token
- `GET /api/auth/verify-email?token=` — Verify email
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password
- `GET /api/auth/me` — Get current user (protected)

### Users
- `GET /api/users/` — List all users (committee only)
- `GET /api/users/:id` — Get user by ID
- `PATCH /api/users/profile` — Update profile
- `PATCH /api/users/avatar` — Upload avatar
- `PATCH /api/users/change-password` — Change password
- `PATCH /api/users/:id/toggle-active` — Activate/deactivate user (committee only)

## Implementation Phases

- **Phase 1** ✅ — Core foundation: Auth, RBAC, Role dashboards, DB setup
- **Phase 2** 🔜 — Visitor management, Complaints, Billing, Notifications
- **Phase 3** 🔜 — Parking, Marketplace, Notice Board, Events, Facilities, Polls
- **Phase 4** 🔜 — Security, Analytics, AI features
