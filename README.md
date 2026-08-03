

An all-in-one digital platform for residential society management connecting residents, committee members, security guards, maintenance staff, and vendors.



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




- Node.js v22+ (required for built-in `node:sqlite`)
- MongoDB (local or Atlas URI)



```bash
cp .env.example server/.env
cp .env.example client/.env

```



```bash
cd server
npm install
npm run dev

```



```bash
cd client
npm install
npm run dev

```



```
Smart Society Hub/
├── client/                    
│   ├── src/
│   │   ├── components/        
│   │   │   ├── auth/          
│   │   │   └── layout/        
│   │   ├── hooks/             
│   │   ├── pages/             
│   │   │   ├── auth/          
│   │   │   └── dashboards/    
│   │   ├── services/          
│   │   ├── store/             
│   │   └── App.jsx            
├── server/                    
│   └── src/
│       ├── config/            
│       ├── controllers/       
│       ├── middleware/        
│       ├── models/            
│       ├── routes/            
│       └── utils/             
├── database/
│   ├── sqlite/schema.sql      
│   └── mongo/indexes.js       
├── .env.example               
└── prd.md                     
```



| Role | Description |
|---|---|
| `resident` | Society residents with standard access |
| `committee` | Admin with management and analytics access |
| `security` | Gate management and visitor verification |
| `maintenance` | Maintenance task tracking and updates |
| `vendor` | External service providers |




- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login (returns JWT tokens)
- `POST /api/auth/logout` — Logout
- `POST /api/auth/refresh-token` — Refresh access token
- `GET /api/auth/verify-email?token=` — Verify email
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password
- `GET /api/auth/me` — Get current user (protected)


- `GET /api/users/` — List all users (committee only)
- `GET /api/users/:id` — Get user by ID
- `PATCH /api/users/profile` — Update profile
- `PATCH /api/users/avatar` — Upload avatar
- `PATCH /api/users/change-password` — Change password
- `PATCH /api/users/:id/toggle-active` — Activate/deactivate user (committee only)



- **Phase 1** ✅ — Core foundation: Auth, RBAC, Role dashboards, DB setup
- **Phase 2** ✅ — Visitor management, Complaints, Billing, Notifications (Full CRUD & Role Restrictions)
- **Phase 3** ✅ — Parking, Marketplace, Notice Board, Events, Facilities, Polls (Full CRUD & Premium UI/UX)
- **Phase 4** 🔜 — Security, Analytics, Gamification & AI features
