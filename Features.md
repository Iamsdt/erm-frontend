# ERM Frontend — Feature Status

## Completed

### Infrastructure & Foundation

- React 19 + Vite + SWC setup with code splitting (lazy loading all route pages)
- Redux Toolkit + Redux Persist (user session, theme)
- TanStack Query v5 for server state management
- React Router v7 with protected route guards
- Tailwind CSS v4 + shadcn/ui component library
- MSW-based API mocking for development
- i18n support (English + Hindi)
- PWA setup (manifest, service worker, offline page)
- Role-based route guards (`LeaveRoleGuard`, `EmployeeManagementGuard`)
- Error boundaries, 404 / router-error pages
- Web Vitals performance monitoring

---

### Pages Completed

#### Auth

- **Login** — authentication page with form

#### Dashboard

- **Main Dashboard** (`/`) — overview/home page

#### Leave Management

| Page               | Route                        | Role     |
| ------------------ | ---------------------------- | -------- |
| Leave Calendar     | `/leave/calendar`            | All      |
| Admin Dashboard    | `/leave/admin`               | Admin    |
| Approvals          | `/leave/admin/approvals`     | Admin    |
| Manual Record      | `/leave/admin/manual-record` | Admin    |
| Leave Settings     | `/leave/admin/settings`      | Admin    |
| Employee Dashboard | `/leave/employee`            | Employee |
| Request Leave      | `/leave/employee/request`    | Employee |

#### Employee Management (Admin-only)

| Page            | Route                              |
| --------------- | ---------------------------------- |
| Employee List   | `/employee-management`             |
| Create Employee | `/employee-management/create`      |
| Edit Employee   | `/employee-management/edit/:id`    |
| Invite Users    | `/employee-management/invite`      |
| Department List | `/employee-management/departments` |

#### Misc

- Comments page (`/comments`)

---

### API & Data Layer

- **Leave API**: monthly attendance, admin summary, employee profile, approvals, manual record, leave settings, submit request
- **Employee Management API**: list, detail, create, patch employees
- **Department API**: department listing
- **Comments API**: comment listing/creation
- TanStack Query hooks for all above APIs with request cancellation support

---

## To Research (Next)

_(Pending investigation of missing modules — to be filled in separately)_
