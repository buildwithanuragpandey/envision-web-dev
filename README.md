# ClubFlow – Role-Based Club & Project Management System

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-v19-61dafb.svg)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

**ClubFlow** is a modern, production-ready, full-stack Role-Based Club Management System designed for colleges, universities, and student/professional organizations. It enables seamless coordination of members, projects, project teams, project leads, tasks, deadlines, priorities, and analytics with strict **Role-Based Access Control (RBAC)**.

---

## 1. Project Overview & Problem Statement

Managing active collegiate and organization clubs often leads to fractured communication across fragmented spreadsheets, chat channels, and siloed task lists. 

**ClubFlow solves this by providing:**
- **Granular RBAC boundaries**: Strict segregation between Administrators, Project Leads, and Club Members.
- **Dynamic Team Formation**: Multiple members per project, multiple projects per member, and one designated Project Lead per initiative.
- **Real-Time Deliverable Tracking**: Real progress calculations derived directly from task completions (`(completedTasks / totalTasks) * 100`).
- **Interactive Kanban Boards**: Drag-and-drop or single-click status updates (`TODO` ➔ `IN_PROGRESS` ➔ `COMPLETED`).
- **Deadline Monitoring**: Intelligent visual markers for upcoming, due-today, and overdue deliverables.
- **Audit Logging**: Comprehensive activity tracking for project creations, lead assignments, status transitions, and member updates.

---

## 2. User Roles & Permissions (RBAC Matrix)

| Capability / Action | Admin (`ADMIN`) | Project Lead (`PROJECT_LEAD`) | Member (`MEMBER`) |
| :--- | :---: | :---: | :---: |
| **View Executive Club Dashboard** | ✅ Yes | ❌ (Own Lead Hub) | ❌ (Own Dashboard) |
| **Manage Members (Add, Edit, Deactivate, Delete)** | ✅ Yes | ❌ No | ❌ No |
| **Create & Delete Projects** | ✅ Yes | ❌ No | ❌ No |
| **Assign Project Leads** | ✅ Yes | ❌ No | ❌ No |
| **Add / Remove Team Members in Project** | ✅ Yes | ✅ (Own Led Projects) | ❌ No |
| **Create Tasks in Project** | ✅ Yes | ✅ (Own Led Projects) | ❌ No |
| **Edit Task Details & Priorities** | ✅ Yes | ✅ (Own Led Projects) | ❌ No |
| **Update Task Status (`TODO` ➔ `IN_PROGRESS` ➔ `COMPLETED`)** | ✅ Yes | ✅ (Own Led Projects) | ✅ (Assigned Tasks) |
| **View Assigned Projects & Tasks** | ✅ All | ✅ (Led & Assigned) | ✅ (Assigned only) |
| **View Club Directory** | ✅ Full Access | ✅ Full Access | ✅ Read-only Directory |

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Tailored SaaS aesthetic, custom scrollbars, subtle shadows)
- **State & Server Cache**: TanStack React Query (Automatic invalidation and caching)
- **Routing**: React Router DOM v7 (Role-based route guards and protected layouts)
- **Charts & Data Visualization**: Recharts (Pie/Donut and Vertical Bar charts)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database ORM**: Prisma ORM (Relational schema with SQLite for zero-config local dev and PostgreSQL for production)
- **Authentication**: JSON Web Tokens (JWT) + bcrypt password hashing + HTTP-only cookies / Bearer headers
- **Validation**: Zod (Strict schema validation on all API requests)
- **Security**: Helmet headers, CORS credentials configuration, centralized error handling

---

## 4. System Architecture & Relational Schema

```mermaid
erDiagram
    USER ||--o{ PROJECT_MEMBER : "participates in"
    PROJECT ||--o{ PROJECT_MEMBER : "has team"
    USER ||--o{ PROJECT : "leads"
    USER ||--o{ PROJECT : "created by"
    PROJECT ||--o{ TASK : "contains"
    USER ||--o{ TASK : "assigned to"
    USER ||--o{ TASK : "created by"
    USER ||--o{ ACTIVITY_LOG : "triggers"

    USER {
        string id PK
        string name
        string email UK
        string passwordHash
        string role "ADMIN | PROJECT_LEAD | MEMBER"
        string department
        string year
        boolean isActive
        datetime createdAt
    }

    PROJECT {
        string id PK
        string name
        string description
        string status "PLANNING | ACTIVE | COMPLETED | ARCHIVED"
        datetime startDate
        datetime endDate
        string projectLeadId FK
        string createdById FK
        datetime createdAt
    }

    PROJECT_MEMBER {
        string id PK
        string projectId FK
        string userId FK
        datetime joinedAt
    }

    TASK {
        string id PK
        string title
        string description
        string projectId FK
        string assignedToId FK
        string createdById FK
        string priority "LOW | MEDIUM | HIGH | URGENT"
        string status "TODO | IN_PROGRESS | COMPLETED"
        datetime deadline
        datetime completedAt
        datetime createdAt
    }

    ACTIVITY_LOG {
        string id PK
        string userId FK
        string action
        string entityType
        string entityId
        string description
        datetime createdAt
    }
```

---

## 5. Demo Credentials (Ready for Immediate Testing)

All accounts share the default local password: **`Password123!`**

| Role | Email | Name | Focus / Responsibility |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clubflow.local` | Dr. Eleanor Vance | Faculty Advisor & Executive Club Head |
| **Project Lead** | `lead@clubflow.local` | David Kim | Senior Lead (Robotics Rover & AI Hub) |
| **Project Lead** | `sarah.lead@clubflow.local` | Sarah Jenkins | Lead (Tech Symposium Portal) |
| **Member 1** | `member1@clubflow.local` | Alex Rivera | Senior CS (Rover & Symposium teams) |
| **Member 2** | `member2@clubflow.local` | Priya Sharma | Junior SE (Rover & Mobile App teams) |
| **Member 3** | `member3@clubflow.local` | Marcus Chen | Sophomore UI/UX (Symposium & AI Hub) |
| **Member 4** | `member4@clubflow.local` | Elena Rostova | Sophomore EE (Rover & Mobile App) |
| **Member 5** | `member5@clubflow.local` | Jordan Taylor | Freshman Data Science (Symposium) |

> 💡 *Tip: The login page includes 1-click quick-fill buttons for Admin, Lead, and Member!*

---

## 6. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher, v20+ recommended)
- npm (v9 or higher)

### 1. Clone & Setup Workspace
```bash
# Navigate to project directory
cd "/Users/anuragpandey/Desktop/envision(web-dev)"

# Install workspace root packages
npm install
```

### 2. Backend & Database Setup
```bash
cd server

# Install dependencies
npm install

# Push schema to SQLite database (or Postgres) and generate Prisma Client
npx prisma db push

# Seed realistic demo data (Projects, Tasks, Members, Audit Logs)
npm run seed
```

### 3. Frontend Setup
```bash
cd ../client

# Install dependencies
npm install

# Build / Verify client
npm run build
```

---

## 7. Running the Application

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

### Option B: Run Individually in Separate Terminals
```bash
# Terminal 1 - Backend API Server (Port 5001)
cd server
npm run dev

# Terminal 2 - Frontend Client (Port 5173)
cd client
npm run dev
```

Access the application in your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 8. REST API Reference

All protected endpoints require either an HTTP-only session cookie or the `Authorization: Bearer <jwt_token>` header.

### Authentication (`/api/auth`)
- `POST /api/auth/login` – Authenticate with email & password. Returns JWT and user payload.
- `POST /api/auth/logout` – Clear auth cookie.
- `GET /api/auth/me` – Retrieve current authenticated user profile.
- `POST /api/auth/change-password` – Change password.
- `PATCH /api/auth/profile` – Update profile details (name, department, year, avatar).

### Users & Members (`/api/users`)
- `GET /api/users` – List members (supports `?search=`, `?role=`, `?department=`, `?isActive=`).
- `GET /api/users/:id` – Retrieve member profile, memberships, and assigned tasks.
- `POST /api/users` – *(Admin only)* Create new member account.
- `PATCH /api/users/:id` – *(Admin only)* Update member details, role, or active status.
- `DELETE /api/users/:id` – *(Admin only)* Delete/deactivate user.

### Projects (`/api/projects`)
- `GET /api/projects` – List all projects with computed progress percentages.
- `GET /api/projects/:id` – Retrieve full project details, team roster, and task board.
- `POST /api/projects` – *(Admin only)* Create new project with optional initial lead and team.
- `PATCH /api/projects/:id` – *(Admin / Assigned Lead)* Update project details.
- `DELETE /api/projects/:id` – *(Admin only)* Delete project and cascade delete tasks.
- `GET /api/projects/:id/members` – Retrieve project team roster.
- `POST /api/projects/:id/members` – *(Admin / Assigned Lead)* Add member to team.
- `DELETE /api/projects/:id/members/:userId` – *(Admin / Assigned Lead)* Remove member from team.
- `PATCH /api/projects/:id/lead` – *(Admin only)* Appoint or change Project Lead.

### Tasks (`/api/tasks`)
- `GET /api/tasks` – List tasks (supports `?search=`, `?status=`, `?priority=`, `?projectId=`, `?assignedToId=`, `?dueFilter=`).
- `GET /api/tasks/:id` – Retrieve task details.
- `POST /api/tasks` – *(Admin / Assigned Lead)* Create and assign task.
- `PATCH /api/tasks/:id` – *(Admin / Assigned Lead)* Update task details, priority, or deadline.
- `PATCH /api/tasks/:id/status` – *(Admin / Assigned Lead / Assigned Member)* Update status (`TODO`, `IN_PROGRESS`, `COMPLETED`).
- `DELETE /api/tasks/:id` – *(Admin / Assigned Lead)* Delete task.

### Dashboards & Analytics (`/api/dashboard`)
- `GET /api/dashboard/admin` – *(Admin only)* Club-wide KPIs, project progress list, status/priority charts, activity logs.
- `GET /api/dashboard/lead` – *(Admin / Project Lead)* Led projects summary, team workload table, urgent milestones.
- `GET /api/dashboard/member` – Personal assigned projects, tasks due soon, personal completion rate.

---

## 9. Key User Flows Tested & Verified

1. **Admin Full Lifecycle Flow**:
   - Login as `admin@clubflow.local`.
   - Inspect KPI cards, completion rates, and Recharts distribution.
   - Create new project ➔ Assign Project Lead ➔ Add members to project roster.
   - Verify that changes appear in real-time.

2. **Project Lead Workflow**:
   - Login as `lead@clubflow.local`.
   - View assigned led projects and team members.
   - Create tasks, assign deadlines and priority tiers (`URGENT`, `HIGH`).
   - Monitor team performance and completion percentages.

3. **Member Progression Flow**:
   - Login as `member1@clubflow.local`.
   - View multiple assigned projects (Mars Rover, Symposium, AI Hub).
   - Change task status directly from `TODO` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
   - Observe immediate recalculation of personal and project completion progress.

4. **Security & RBAC Boundary Enforcement**:
   - Member attempting to hit Admin APIs returns `403 Forbidden`.
   - Project Lead attempting to edit an unrelated project returns `403 Forbidden`.
   - Unauthenticated requests are immediately redirected to `/login`.

---

## 10. Folder Structure

```
clubflow/
├── package.json               # Root workspace scripts (npm run dev, seed, build)
├── .gitignore                 # Safe gitignore (excludes .env, node_modules, dist, *.db)
├── .env.example               # Environment variables template
├── README.md                  # Comprehensive documentation
│
├── server/                    # Backend (Express + TypeScript + Prisma)
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma      # Relational schema (User, Project, Task, Member, Log)
│   │   └── seed.ts            # Realistic seed script
│   └── src/
│       ├── index.ts           # Server entrypoint with Helmet, CORS, and routes
│       ├── config/            # Environment configurations
│       ├── types/             # Domain TypeScript types
│       ├── utils/             # JWT, Bcrypt, Prisma client
│       ├── validators/        # Zod request validators
│       ├── middleware/        # Auth, RBAC, Error & Validation middlewares
│       ├── services/          # Business logic & KPI calculation services
│       ├── controllers/       # REST API controllers
│       └── routes/            # Express route definitions
│
└── client/                    # Frontend (React 19 + TypeScript + Vite + Tailwind)
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx           # React DOM root with TanStack Query & AuthProvider
        ├── App.tsx            # Route tree with ProtectedRoute & RoleGuard
        ├── api/client.ts      # Axios API client with token interceptors
        ├── context/           # AuthContext & ToastContext
        ├── types/             # Frontend interfaces
        ├── components/
        │   ├── common/        # Buttons, Modals, Badges, ProgressBars, Skeleton
        │   ├── layout/        # AppLayout, Role-aware Sidebar, Top Header
        │   ├── projects/      # ProjectModal, AddMemberModal
        │   ├── tasks/         # Interactive KanbanBoard, TaskModal
        │   └── members/       # MemberModal
        └── pages/             # All Role Dashboards, Projects, Tasks, Directory, Analytics
```

---

## 11. Security & Production Deployment Notes

- **Password Hashing**: Uses `bcryptjs` with salt factor 10.
- **JWT Authentication**: Signed with strong secret and configurable expiration (`7d`).
- **PostgreSQL Ready**: To connect to a remote or local PostgreSQL database (such as Supabase, Neon, AWS RDS, or Docker), simply update `DATABASE_URL` in `server/.env` to:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/clubflow?schema=public"
  ```
  and change `provider = "postgresql"` in `server/prisma/schema.prisma`.
- **Environment Safety**: Secrets and credentials are never stored in git or exposed to client bundles.
