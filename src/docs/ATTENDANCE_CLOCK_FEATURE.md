# Attendance Clock-In / Clock-Out Feature

> **Status: APPROVED — IMPLEMENTATION READY**  
> **Date:** February 19, 2026  
> **Author:** GitHub Copilot (research-driven)

---

## Table of Contents

1. [How Other Products Handle It](#1-how-other-products-handle-it)
2. [Key Concepts & Data Model](#2-key-concepts--data-model)
3. [API Contract (Backend Expectations)](#3-api-contract-backend-expectations)
4. [Frontend Architecture Plan](#4-frontend-architecture-plan)
5. [Employee Experience](#5-employee-experience)
6. [Admin Experience](#6-admin-experience)
7. [File & Folder Structure](#7-file--folder-structure)
8. [Integration with Existing Code](#8-integration-with-existing-code)
9. [Open Questions for Backend Team](#9-open-questions-for-backend-team)

---

## 1. How Other Products Handle It

### 1.1 Clockify (Industry-Standard Time Tracking)

**Source: https://docs.clockify.me**

Clockify is the most widely adopted open-API time-tracking system. Key design decisions:

| Concern           | Their Approach                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Clock-in          | `POST /time-entries` with `{ start: ISO_DATE, type: "REGULAR" }` — no `end` means actively running |
| Clock-out         | `PATCH /user/{userId}/time-entries` with `{ end: ISO_DATE }` — stops the running timer             |
| In-progress check | `GET /time-entries/status/in-progress` — returns currently running entry                           |
| Break tracking    | Same API, `type: "BREAK"` instead of `"REGULAR"`                                                   |
| Admin visibility  | Admins can view all in-progress entries; can also add/edit entries for other users                 |
| Activity log      | Detailed report endpoint with date range filters, exportable as JSON/CSV/XLSX                      |
| Manual entries    | Admin can `POST /user/{userId}/time-entries` to add entries for another user                       |
| Webhooks          | `NEW_TIMER_STARTED`, `TIMER_STOPPED`, `TIME_ENTRY_UPDATED` events                                  |

**Key takeaway:** Clock-in/out is just a time entry with an open or closed interval. A running entry has `start` but no `end`.

---

### 1.2 Rippling (All-in-One HR Platform)

**Source: https://www.rippling.com/time-and-attendance**

Rippling's Time & Attendance product emphasizes:

| Concern             | Their Approach                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Clock-in methods    | **Web browser, Mobile app, Physical kiosk** — all update the same underlying record                 |
| Overtime alerts     | Automatic notifications when employee approaches or exceeds overtime threshold                      |
| Break enforcement   | System flags missed breaks based on labor law rules                                                 |
| Timecard approval   | Managers receive reminders for unapproved timecards; employees reminded if they forget to clock out |
| Payroll integration | Approved hours flow directly into payroll run — no data re-entry                                    |
| Admin reports       | Real-time reports on labor cost trends, overtime by location, daily attendance                      |
| Manager actions     | Managers can edit/approve/reject timecards on behalf of employees                                   |

**Key takeaway:** The UX should reflect current status prominently (clocked in / clocked out), offer a single large action button, and surface pending approvals to managers.

---

### 1.3 BambooHR / ADP / Workday (Enterprise HR)

Common patterns observed across enterprise HR platforms:

| Feature                 | Common Pattern                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------- | ---- | -------- | --------- | -------- | ------ | ------- |
| Dashboard widget        | A persistent "You are clocked in / out" card at the top of the employee dashboard with elapsed time |
| Clock-in confirmation   | Optional note/reason field on clock-in (project, task, department)                                  |
| Geo-location (optional) | IP address or GPS latitude/longitude captured but not enforced                                      |
| Mobile-first            | Large tap targets (minimum 44×44px), prominent CTA button                                           |
| Today's timeline        | Visual representation of work time, breaks, total hours so far today                                |
| Admin table             | Sortable, filterable data table — Employee                                                          | Date | Clock-In | Clock-Out | Duration | Status | Actions |
| Activity log filters    | Filter by date range, employee, department; search by name                                          |
| Anomaly highlighting    | Late arrivals, early departures, missing clock-outs highlighted in red/yellow                       |
| Export                  | CSV/Excel export of activity logs                                                                   |
| Edit/correct            | Admins can edit entries with a reason/note for audit trail                                          |

---

### 1.4 Summary of Best Practices

1. **State-first UI:** The employee's current state (IN / OUT) drives the UI — not menus or forms.
2. **Single action button:** A large "Clock In" or "Clock Out" button is the primary action.
3. **Real-time feedback:** Show elapsed time since clock-in (live counter) and today's totals.
4. **Work summary on clock-out:** Employee writes a brief description of what they worked on before clock-out — creates accountability and a record.
5. **Auto-expiry (4 hours):** If an employee forgets to clock out, the session is automatically closed after 4 hours. The entry is marked `AUTO_EXPIRED` so admins can correct it if needed.
6. **Admin log table:** Paginated, filterable, sortable list with the ability to manually edit entries.
7. **Audit trail:** Every edit or flag by admin captures `editedBy`/`flaggedBy`, timestamp, and reason.
8. **Admin manual entry:** Admin can create a clock-in/out entry on behalf of an employee when the employee missed it and explained why.
9. **Admin suspicious flag:** Admins can manually flag any entry as suspicious with a reason note — does not modify the entry, only marks it for review.

---

## 2. Key Concepts & Data Model

### 2.1 Attendance Entry (Single Record)

```json
{
  "id": 123,
  "employeeId": 456,
  "employeeName": "Jane Smith",
  "clockIn": "2026-02-19T09:02:00Z",
  "clockOut": "2026-02-19T17:31:00Z", // null = currently clocked in
  "workSummary": "Completed API integration for the leave module and fixed 3 bugs.",
  "note": "Working on finance module", // optional clock-in note
  "ipAddress": "192.168.1.10",
  "deviceInfo": "Chrome/Web",
  "durationMinutes": 509,
  "status": "COMPLETED", // IN_PROGRESS | COMPLETED | AUTO_EXPIRED | EDITED | MANUAL
  "isManualEntry": false, // true = added by admin on behalf of employee
  "manualEntryReason": null,
  "editedBy": null,
  "editedAt": null,
  "editReason": null,
  "isFlagged": false, // admin flagged as suspicious
  "flagReason": null,
  "flaggedBy": null,
  "flaggedAt": null
}
```

### 2.2 Employee Daily Summary

```json
{
  "date": "2026-02-19",
  "employeeId": 456,
  "totalWorkMinutes": 490,
  "firstClockIn": "2026-02-19T09:02:00Z",
  "lastClockOut": "2026-02-19T17:31:00Z",
  "isCurrentlyIn": false,
  "hasAutoExpiredEntry": false,   // true if any entry was auto-closed by the 4h rule today
  "entries": [ ... ]
}
```

### 2.3 Admin Activity Log Entry

```json
{
  "id": 123,
  "employeeId": 456,
  "employeeName": "Jane Smith",
  "department": "Engineering",
  "date": "2026-02-19",
  "clockIn": "2026-02-19T09:02:00Z",
  "clockOut": "2026-02-19T17:31:00Z",
  "durationMinutes": 509,
  "workSummary": "Completed API integration for the leave module.",
  "status": "COMPLETED", // IN_PROGRESS | COMPLETED | AUTO_EXPIRED | EDITED | MANUAL
  "isManualEntry": false,
  "isFlagged": false,
  "flagReason": null,
  "flaggedBy": null,
  "flaggedAt": null
}
```

---

## 3. API Contract (Backend Expectations)

The following REST endpoints should be agreed upon with the backend team. These follow the patterns already established in this codebase (Django REST Framework is inferred from the existing `api.constant.js`).

### 3.1 Employee Endpoints

| Method | Endpoint                | Description                                                                   |
| ------ | ----------------------- | ----------------------------------------------------------------------------- |
| `POST` | `attendance/clock-in/`  | Clock in — creates a new entry with `clockIn = now`                           |
| `POST` | `attendance/clock-out/` | Clock out — closes active entry with `clockOut = now`; requires `workSummary` |
| `GET`  | `attendance/status/`    | Get current session status (is employee clocked in? expiry warning?)          |
| `GET`  | `attendance/today/`     | Get today's full attendance detail                                            |
| `GET`  | `attendance/history/`   | Get paginated personal history (query: `?page=1&month=2&year=2026`)           |

**Clock-in Request Body:**

```json
{
  "note": "Starting work", // optional
  "deviceInfo": "Chrome/Web" // optional, captured automatically
}
```

**Clock-out Request Body:**

```json
{
  "workSummary": "Finished the dashboard UI and fixed login bug." // required
}
```

**Status Response:**

```json
{
  "isClocked": true,
  "clockedInAt": "2026-02-19T09:02:00Z",
  "elapsedSeconds": 3720,
  "expiresInSeconds": 720, // seconds until auto-expiry (4h limit); null if not clocked in
  "willAutoExpire": true, // true when < 30 minutes remain before auto-close
  "todayTotalMinutes": 62
}
```

> **Auto-expiry rule:** The backend automatically closes any `IN_PROGRESS` session after **4 hours** and marks it `AUTO_EXPIRED`. The frontend shows a warning banner when `willAutoExpire = true`.

### 3.2 Admin Endpoints

| Method  | Endpoint                           | Description                                                                               |
| ------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `GET`   | `attendance/admin/logs/`           | Paginated activity log (query: `?page=1&date=2026-02-19&employee_id=456&department_id=2`) |
| `GET`   | `attendance/admin/logs/{id}/`      | Single entry detail                                                                       |
| `PATCH` | `attendance/admin/logs/{id}/`      | Edit an entry's times (with mandatory `editReason`)                                       |
| `PATCH` | `attendance/admin/logs/{id}/flag/` | Flag or unflag an entry as suspicious (with mandatory `flagReason`)                       |
| `POST`  | `attendance/admin/manual-entry/`   | Create a manual clock-in/out on behalf of an employee                                     |
| `GET`   | `attendance/admin/summary/`        | Daily/weekly/monthly summary stats                                                        |
| `GET`   | `attendance/admin/live/`           | Who is currently clocked in right now                                                     |

**Admin Log Edit Request Body:**

```json
{
  "clockIn": "2026-02-19T09:00:00Z",
  "clockOut": "2026-02-19T17:30:00Z",
  "editReason": "Employee forgot to clock out" // required
}
```

**Admin Flag Request Body:**

```json
{
  "isFlagged": true,
  "flagReason": "Duration seems inconsistent with reported tasks" // required when flagging
}
```

**Admin Manual Entry Request Body:**

```json
{
  "employeeId": 456,
  "clockIn": "2026-02-19T09:00:00Z",
  "clockOut": "2026-02-19T13:00:00Z",
  "workSummary": "Employee reported working on budget report",
  "manualEntryReason": "Employee forgot to clock in — confirmed via email" // required
}
```

---

## 4. Frontend Architecture Plan

Following the established 3-tier data flow of this codebase:

```
API Layer         →   Query Layer         →   Component (UI)
attendance.api.js →   attendance.query.js  →   pages/attendance/
```

### 4.1 API Layer (`src/services/api/attendance.api.js`)

Functions to implement:

- `postClockIn(data)` — POST `attendance/clock-in/`
- `postClockOut({ workSummary })` — POST `attendance/clock-out/` — `workSummary` required
- `getAttendanceStatus({ signal })` — GET `attendance/status/`
- `getTodayAttendance({ signal })` — GET `attendance/today/`
- `getAttendanceHistory({ page, month, year, signal })` — GET `attendance/history/`
- `getAdminAttendanceLogs({ page, date, employeeId, departmentId, status, signal })` — GET `attendance/admin/logs/`
- `patchAdminAttendanceEntry(id, data)` — PATCH `attendance/admin/logs/{id}/`
- `patchAdminFlagEntry(id, { isFlagged, flagReason })` — PATCH `attendance/admin/logs/{id}/flag/`
- `postAdminManualEntry(data)` — POST `attendance/admin/manual-entry/`
- `getAdminLiveStatus({ signal })` — GET `attendance/admin/live/`
- `getAdminAttendanceSummary({ signal })` — GET `attendance/admin/summary/`

### 4.2 Query Layer (`src/services/query/attendance.query.js`)

TanStack Query hooks:

- `useAttendanceStatus()` — polls every 60s; `staleTime: 30s`; provides `willAutoExpire` for warning banner
- `useTodayAttendance()` — `staleTime: 60s`
- `useAttendanceHistory(year, month)` — `staleTime: 5min`
- `useClockIn()` — mutation; invalidates `attendanceStatus` & `todayAttendance`
- `useClockOut()` — mutation; takes `{ workSummary }`; invalidates `attendanceStatus` & `todayAttendance`
- `useAdminAttendanceLogs(filters)` — `staleTime: 2min`
- `useAdminLiveStatus()` — polls every 30s
- `useAdminAttendanceSummary()` — `staleTime: 5min`
- `useEditAttendanceEntry()` — mutation; invalidates admin logs
- `useFlagAttendanceEntry()` — mutation; invalidates admin logs
- `useAddManualAttendanceEntry()` — mutation; invalidates admin logs & admin live

### 4.3 Route Constants

New routes to add to `src/lib/constants/route.constant.js`:

```javascript
attendance: {
  EMPLOYEE_CLOCK: "/attendance",
  EMPLOYEE_HISTORY: "/attendance/history",
  ADMIN_LOGS: "/attendance/admin/logs",
  ADMIN_LIVE: "/attendance/admin/live",
  ADMIN_SUMMARY: "/attendance/admin/summary",
}
```

### 4.4 API Constants

New keys to add to `src/lib/constants/api.constant.js`:

```javascript
attendance: {
  clockIn: "attendance/clock-in/",
  clockOut: "attendance/clock-out/",
  status: "attendance/status/",
  today: "attendance/today/",
  history: "attendance/history/",
  adminLogs: "attendance/admin/logs/",
  adminLogDetail: "attendance/admin/logs",      // append /{id}/
  adminLogFlag: "attendance/admin/logs",         // append /{id}/flag/
  adminManualEntry: "attendance/admin/manual-entry/",
  adminSummary: "attendance/admin/summary/",
  adminLive: "attendance/admin/live/",
}
```

---

## 5. Employee Experience

### 5.1 Clock Page (`/attendance`)

> **Note:** There is NO persistent clock status in the app bar/header. The clock widget lives only on this dedicated page.

**Primary widget — "Clock Card":**

```
┌────────────────────────────────────────┐
│  ● CLOCKED IN since 09:02 AM           │
│  ⏱  2h 34m elapsed | 🕗 Today: 2h 34m  │
│                                        │
│  [         🔴 Clock Out         ]      │
└────────────────────────────────────────┘
```

**Auto-expiry warning** (shown when `willAutoExpire = true`, i.e. < 30 min before 4h limit):

```
⚠️  Your session will auto-close in 18 minutes.
    Please clock out manually and add your work summary.
```

**Clock-out flow — Work Summary Dialog:**

When employee clicks "Clock Out", a modal appears **before** the request is sent:

```
┌────────────────────────────────────────────┐
│  Clock Out                             [×] │
│  ─────────────────────────────────────     │
│  What did you work on today?               │
│  ┌──────────────────────────────────────┐  │
│  │  e.g. Reviewed PRs, fixed auth bug…  │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│  (required, min 10 characters)             │
│                                            │
│  [ Cancel ]        [ Confirm Clock Out ]   │
└────────────────────────────────────────────┘
```

- `workSummary` textarea is **required** — "Confirm Clock Out" is disabled until ≥ 10 characters.
- On success, clock card switches to the clocked-out state.

**When clocked out:**

```
┌────────────────────────────────────────┐
│  ○ NOT CLOCKED IN                      │
│  🕗 Today: 5h 12m (completed)          │
│                                        │
│  [         🟢 Clock In         ]       │
└────────────────────────────────────────┘
```

**Today's Sessions** (table below card):

- Clock In | Clock Out | Duration | Work Summary | Status
- `AUTO_EXPIRED` entries highlighted in amber with note: _"Auto-closed after 4 hours"_

### 5.2 History Page (`/attendance/history`)

- Month/Year picker
- Calendar view (colored dots per day: green = complete, amber = auto-expired entry, red = missing clock-out, grey = weekend)
- Summary stats: Total days worked, Total hours, Average hours/day
- Detailed table: Date | Clock In | Clock Out | Duration | Work Summary | Status
- `AUTO_EXPIRED` and `MANUAL` entries clearly badged

---

## 6. Admin Experience

### 6.1 Live Status Page (`/attendance/admin/live`)

Real-time view of who is currently clocked in:

| Employee   | Department  | Clocked In At | Duration So Far | Expiry Warning |
| ---------- | ----------- | ------------- | --------------- | -------------- |
| Jane Smith | Engineering | 09:02 AM      | 3h 14m          | ⚠️ 46 min left |
| Alice Chen | Product     | 10:30 AM      | 1h 46m          | —              |
| …          | …           | …             | …               | …              |

- Auto-refreshes every 30 seconds
- Entries approaching the 4-hour auto-expiry threshold are highlighted in amber
- **"Not Clocked In"** section below shows employees who have not clocked in today
- Badge count in sidebar nav showing total currently clocked in

### 6.2 Activity Logs Page (`/attendance/admin/logs`)

**Filter bar:**

- Date range picker (default: today)
- Employee search/select
- Department multi-select
- Status filter: ALL | IN_PROGRESS | COMPLETED | AUTO_EXPIRED | EDITED | MANUAL | FLAGGED

**Data table columns:**

- Employee | Department | Date | Clock In | Clock Out | Duration | Work Summary | Status | Actions

**Row actions (per row):**

- 👁 **View** — opens detail drawer (full entry including work summary, edit history, flag info)
- 📝 **Edit** — opens edit modal (admin corrects clock-in/out times; reason is mandatory)
- 🚩 **Flag** — opens flag modal; admin marks entry as suspicious with a required reason  
  If already flagged: shows **Unflag** option and displays existing flag reason

**Automatic visual cues (system-detected anomalies, NOT admin flags):**

| Condition                     | Visual                    |
| ----------------------------- | ------------------------- |
| `AUTO_EXPIRED` status         | Amber row + badge         |
| `MANUAL` entry                | Blue "Manual Entry" badge |
| Admin-flagged entry           | Red row + 🚩 icon         |
| Missing clock-out on past day | Yellow warning badge      |

**Add Manual Entry button** (top-right of the page):

Opens a modal where admin can create a clock-in/out record on behalf of an employee:

```
┌──────────────────────────────────────────────────┐
│  Add Manual Attendance Entry               [×]   │
│  ────────────────────────────────────────────    │
│  Employee *           [ Select employee... ▾ ]   │
│  Clock In Date/Time * [ 2026-02-19  09:00 ]      │
│  Clock Out Date/Time* [ 2026-02-19  13:00 ]      │
│  Work Summary *       [                     ]    │
│  Reason for Manual Entry *                       │
│  [ Employee forgot to clock in — confirmed… ]    │
│                                                  │
│  [ Cancel ]                  [ Add Entry ]       │
└──────────────────────────────────────────────────┘
```

- All fields are required
- Created entry stored with `isManualEntry: true` and `manualEntryReason` recorded
- Appears in logs table with a "Manual" badge

**Flag Modal fields:**

```
┌──────────────────────────────────────────────────┐
│  Flag Entry as Suspicious                  [×]   │
│  ────────────────────────────────────────────    │
│  Entry: Jane Smith — Feb 19, 09:02 → 13:02       │
│  Reason *                                        │
│  [ Duration inconsistent with project scope… ]   │
│                                                  │
│  [ Cancel ]                    [ Flag Entry ]    │
└──────────────────────────────────────────────────┘
```

**Edit Modal fields:**

- Clock In (date-time picker)
- Clock Out (date-time picker)
- Edit Reason (required textarea)
- Work Summary (shows existing summary, optional to edit)

**Export:**

- Export current filtered view as CSV or Excel (includes work summaries)

### 6.3 Summary / Analytics Page (`/attendance/admin/summary`)

**Stat cards (top row):**

- Present Today | Auto-Expired | Absent | Flagged Entries

**Charts:**

- Daily attendance bar chart (week view)
- Department-wise attendance heatmap (optional future enhancement)

**Top metrics table:**

- Employee | Days Present (month) | Avg Hours/Day | Late Arrivals | Early Departures

---

## 7. File & Folder Structure

```
src/
├── lib/
│   └── constants/
│       ├── api.constant.js          ← ADD attendance keys
│       └── route.constant.js        ← ADD attendance routes
│
├── services/
│   ├── api/
│   │   └── attendance.api.js        ← NEW
│   ├── query/
│   │   └── attendance.query.js      ← NEW
│   └── mock/
│       └── attendance.mock.js       ← NEW (MSW handlers for dev)
│
├── pages/
│   ├── attendance/
│   │   ├── employee/
│   │   │   ├── index.jsx            ← logic (useClockIn, useClockOut, useAttendanceStatus)
│   │   │   ├── clock.ui.jsx         ← Clock card + sessions table
│   │   │   ├── history/
│   │   │   │   ├── index.jsx
│   │   │   │   └── history.ui.jsx   ← Calendar + table view
│   │   │   └── components/
│   │   │       ├── clock-card.jsx
│   │   │       ├── clock-out-dialog.jsx   ← Work summary textarea before clock-out
│   │   │       ├── auto-expiry-banner.jsx ← Warning banner when session nearing 4h limit
│   │   │       └── session-table.jsx
│   │   └── admin/
│   │       ├── logs/
│   │       │   ├── index.jsx        ← logic (useAdminAttendanceLogs + all mutations)
│   │       │   ├── logs.ui.jsx      ← filter bar + data table
│   │       │   └── components/
│   │       │       ├── logs-filters.jsx
│   │       │       ├── logs-table.jsx
│   │       │       ├── edit-entry-modal.jsx
│   │       │       ├── flag-entry-modal.jsx    ← Flag / unflag with reason
│   │       │       └── manual-entry-modal.jsx  ← Admin adds entry for an employee
│   │       ├── live/
│   │       │   ├── index.jsx
│   │       │   └── live.ui.jsx
│   │       └── summary/
│   │           ├── index.jsx
│   │           └── summary.ui.jsx
│
└── components/
    └── ui/
        └── (existing) — no new shared UI components needed
```

---

## 8. Integration with Existing Code

### 8.1 Router (`src/route/main.routes.jsx`)

Add attendance routes inside the authenticated layout:

```jsx
// Employee routes
{ path: routes.attendance.EMPLOYEE_CLOCK, element: <AttendanceClock /> },
{ path: routes.attendance.EMPLOYEE_HISTORY, element: <AttendanceHistory /> },

// Admin routes (wrapped with role guard)
{ path: routes.attendance.ADMIN_LOGS, element: <AdminAttendanceLogs /> },
{ path: routes.attendance.ADMIN_LIVE, element: <AdminLiveStatus /> },
{ path: routes.attendance.ADMIN_SUMMARY, element: <AdminAttendanceSummary /> },
```

### 8.2 Sidebar Menu (`src/lib/menu-list.js`)

Add attendance menu group:

```javascript
// Employee menu item
{
  href: routes.attendance.EMPLOYEE_CLOCK,
  label: "Attendance",
  icon: Clock,
  submenus: [
    { href: routes.attendance.EMPLOYEE_CLOCK, label: "Clock In/Out" },
    { href: routes.attendance.EMPLOYEE_HISTORY, label: "My History" },
  ]
}

// Admin menu item (conditionally shown for admin role)
{
  href: routes.attendance.ADMIN_LOGS,
  label: "Attendance (Admin)",
  icon: ClipboardList,
  submenus: [
    { href: routes.attendance.ADMIN_LIVE, label: "Live Status" },
    { href: routes.attendance.ADMIN_LOGS, label: "Activity Logs" },
    { href: routes.attendance.ADMIN_SUMMARY, label: "Summary" },
  ]
}
```

### 8.3 Dashboard Widget

Add a small "Clock Status" card to the main dashboard (`src/pages/dashboard/`). **There is no persistent clock indicator in the header/app bar** — the dashboard widget is the only secondary entry point.

- If clocked in: green dot + elapsed time + "Go to Attendance →" link
- If clocked out: grey dot + "Clock In" button (navigates to the `/attendance` page which has the full flow)
- If `willAutoExpire = true`: amber dot + "Session expiring soon" text
- Sources data from `useAttendanceStatus()` (polls every 60s)

### 8.4 MSW Mock (`src/services/mock/attendance.mock.js`)

Dev mocks for all endpoints so frontend can be built independently of backend:

```javascript
import { http, HttpResponse } from "msw"

export default [
  http.get("/api/attendance/status/", () =>
    HttpResponse.json({
      isClocked: false,
      clockedInAt: null,
      elapsedSeconds: null,
      expiresInSeconds: null,
      willAutoExpire: false,
      todayTotalMinutes: 0,
    })
  ),
  http.post("/api/attendance/clock-in/", () =>
    HttpResponse.json({
      id: 1,
      clockedInAt: new Date().toISOString(),
    })
  ),
  http.post("/api/attendance/clock-out/", () =>
    HttpResponse.json({ success: true })
  ),
  // ... etc
]
```

---

## 9. Open Questions for Backend Team

Before starting frontend implementation, the following should be confirmed:

| #   | Question                                                                                                                   | Why It Matters                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | What is the exact base URL and endpoint naming convention? (e.g., `attendance/` vs `time-attendance/`)                     | API constants, Axios config                                       |
| 2   | Is the clock-in/out endpoint self-scoped (uses auth token) or requires `employeeId`?                                       | Simplifies or complicates the API layer                           |
| 3   | How is "currently clocked in" communicated — a dedicated `status` endpoint or embedded in a user profile response?         | Determines polling strategy                                       |
| 4   | Does the backend return errors in the same envelope format as leave endpoints?                                             | Error handling strategy                                           |
| 5   | Should the frontend store `clockedInAt` in Redux/localStorage to prevent unnecessary API calls on navigation?              | Offline/PWA behavior                                              |
| 6   | Is the 4-hour auto-expiry enforced entirely server-side (cron job), or does the backend expect the frontend to trigger it? | Affects whether frontend needs to handle the state transition     |
| 7   | When an entry is `AUTO_EXPIRED`, can the employee retroactively add a work summary from the history page?                  | UX flow; might need a `PATCH attendance/history/{id}/summary/`    |
| 8   | Will the "Activity Logs" support server-side pagination + filtering, or do we filter client-side?                          | Determines if we use `useQuery` with params or `useInfiniteQuery` |
| 9   | What role system is used? Is there an `is_admin` or `is_hr` flag to gate admin views?                                      | Guards, menu visibility                                           |
| 10  | Is geo-location (IP/GPS capture) required in Phase 1 or Phase 2?                                                           | Scope definition                                                  |

---

## Summary

| Phase             | Scope                                                                                          | Pages                                    |
| ----------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Phase 1 (MVP)** | Clock In (4h auto-expiry) + Clock Out (work summary) + Admin Logs (edit + flag + manual entry) | Employee Clock page, Admin Activity Logs |
| **Phase 2**       | History Calendar + Admin Live Status (expiry indicators)                                       | Employee History, Admin Live Status      |
| **Phase 3**       | Summary Analytics + Dashboard Widget + Export                                                  | Admin Summary, Dashboard integration     |

**Recommended Phase 1 deliverables:**

1. `attendance.api.js` — clock-in, clock-out, status, admin logs + flag + manual-entry
2. `attendance.query.js` — 5 query hooks + 5 mutations
3. `pages/attendance/employee/` — Clock card + clock-out dialog (work summary) + auto-expiry banner + sessions table
4. `pages/attendance/admin/logs/` — Filter table + edit modal + flag modal + manual entry modal
5. MSW mock handlers for dev
6. Constants updated (API + routes)
7. Menu items added

---

_Approved and updated per feedback. Ready to begin Phase 1 implementation._
