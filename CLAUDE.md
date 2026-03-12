# ERM Frontend — CLAUDE.md

## Project Overview
Employee Relationship Management (ERM) frontend — a SaaS product for companies to manage employees, leave, attendance, projects, and HR operations. React/Vite SPA with Firebase auth, MSW mocks (no real backend yet).

## Tech Stack
- **Framework:** React 19, Vite 6
- **Routing:** react-router-dom v7
- **State:** Redux Toolkit + redux-persist (APP_STORE, USER_STORE, THEME_STORE, PROJECT_STORE)
- **Server state:** TanStack Query v5 (React Query)
- **Forms:** react-hook-form + zod validation
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix primitives)
- **Auth:** Firebase (email/password + Google)
- **Mocking:** MSW v2 (Mock Service Worker) — all API calls are mocked
- **Rich text:** BlockNote (project notes)
- **Charts:** Recharts
- **DnD:** @hello-pangea/dnd (sprint board)
- **i18n:** i18next
- **Testing:** Vitest + @testing-library/react

## Architecture

### Request Flow
```
Component → Container (index.jsx)
  → React Query hook (@query/*.query.js)
    → API function (@api/*.api.js)
      → Axios instance (src/lib/config.js)
        → MSW handler intercepts → mock data returned
```

### Layer Responsibilities
| Layer | Location | Purpose |
|-------|----------|---------|
| Pages (containers) | `src/pages/**/index.jsx` | Data fetching, state, handlers |
| Pages (presenters) | `src/pages/**/*.ui.jsx` | Pure rendering, receives props |
| API functions | `src/services/api/*.api.js` | Axios calls, raw HTTP |
| Query hooks | `src/services/query/*.query.js` | useQuery / useMutation wrappers |
| MSW mocks | `src/services/mock/*.mock.js` | Intercept requests, return mock data |
| Store slices | `src/services/store/slices/*.slice.js` | Redux slices |
| Constants | `src/lib/constants/` | Routes, API endpoints, Redux keys |
| Hooks | `src/hooks/` | Reusable React hooks |
| Guards | `src/components/guards/` | Role-based route protection |

## Directory Structure
```
src/
├── components/
│   ├── guards/         # Role guards (leave, attendance, employee-management)
│   ├── layout/         # AppSidebar, MainLayout, header components
│   └── ui/             # shadcn/ui primitives
├── hooks/              # Shared hooks (use-debounce, use-update-module, etc.)
├── lib/
│   ├── constants/      # api.constant, route.constant, redux.constant, layout.constant
│   ├── context/        # ThemeProvider
│   ├── utils/          # datetime, error-handler, sanitize, etc.
│   ├── config.js       # Axios instance
│   └── query-client.js # TanStack Query client
├── pages/
│   ├── ai/             # AI Insights, Recommendations, Analytics (hardcoded data, needs API)
│   ├── attendance/     # Employee clock/history, Admin logs/live/summary
│   ├── auth/           # Login (Firebase)
│   ├── daily-update/   # Standup, Team Updates, Progress Log (hardcoded, needs API)
│   ├── dashboard/      # Role-based dashboard (admin vs employee)
│   ├── employee-management/ # List, Create, Edit, Invite, Departments, 360 Profile
│   ├── leave-admin/    # Dashboard, Approvals, Manual Record, Settings
│   ├── leave-dashboard/ # Calendar view
│   ├── leave-employee/ # Dashboard, Request
│   ├── notifications/  # Notifications page
│   ├── policy/         # Policy management
│   ├── profile/        # User profile + team management
│   ├── projects/       # Project list, details, settings, notes
│   ├── rewards/        # Rewards page
│   └── sprint-board/   # Kanban sprint board
├── route/
│   └── main.routes.jsx # All app routes (lazy-loaded)
└── services/
    ├── api/            # Axios API functions per domain
    ├── mock/           # MSW handlers per domain
    ├── query/          # React Query hooks per domain
    └── store/          # Redux store, reducers, slices
```

## Key Commands
```bash
npm run dev          # Start dev server (MSW enabled)
npm run build        # Production build
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier
npm run test         # Vitest
npm run test:ui      # Vitest with UI + coverage
```

## Environment Setup
Required env vars (see `.env.example`):
- `VITE_API_URL` — Backend base URL (currently all mocked via MSW)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_SENTRY_DSN` (optional, for error monitoring)

## Path Aliases (vite.config)
```
@/          → src/
@pages      → src/pages
@api        → src/services/api
@query      → src/services/query
@constants  → src/lib/constants
```

## Conventions

### File Naming
- Container (data logic): `index.jsx`
- Presenter (UI only): `<name>.ui.jsx`
- API module: `<domain>.api.js`
- Query hooks: `<domain>.query.js`
- MSW handlers: `<domain>.mock.js`
- Redux slice: `<name>.slice.js`
- Hooks: `use-<name>.js` or `use-<name>.jsx`

### Component Rules
- Functional components only, PropTypes on every component
- Container/presenter split for all page-level components
- No `any` prop types — define shapes with `PropTypes.shape()`
- `defaultProps` for all optional props
- Pages use `index.jsx` as the lazy-loaded entry point

### Routing
- All routes are lazy-loaded via `React.lazy()` in `src/route/main.routes.jsx`
- Role-based access enforced via guard components
- Use React Router `<Link to>` for all internal navigation — never `<a href>`

### Redux Store Keys
```
APP_STORE    → { currentModule, standupStatus }
USER_STORE   → { isAuthenticated, userName, userEmail, leave_management_role, employee_management_role, attendance_management_role }
THEME_STORE  → { theme }
PROJECT_STORE → { ... }
```

### API Endpoints
All prefixed with `/api/v1/`. See `src/lib/constants/api.constant.js` for full list.

### Adding a New Feature
1. Add route constant to `src/lib/constants/route.constant.js`
2. Add API endpoint to `src/lib/constants/api.constant.js`
3. Create API function in `src/services/api/<domain>.api.js`
4. Create MSW handler in `src/services/mock/<domain>.mock.js` and register it
5. Create query hook in `src/services/query/<domain>.query.js`
6. Build container `src/pages/<domain>/index.jsx`
7. Build presenter `src/pages/<domain>/<name>.ui.jsx`
8. Register route in `src/route/main.routes.jsx`
9. Add sidebar entry in `src/components/layout/app-sidebar.jsx`

## Current Focus
- **Phase 1:** Polish existing pages to production quality
  - Sidebar `<a href>` → `<Link>` fix (SPA navigation)
  - useDebounce hook for employee search
  - Admin logs: replace hardcoded KNOWN_EMPLOYEES with API fetch
  - Attendance history: dynamic year range
  - Remove legacy Comments page from routes
- **Phase 2:** Wire Daily Updates + AI pages to MSW API layers
- **Phase 3:** SaaS readiness — org setup, onboarding, role management UI

## Known Issues / TODOs
- `src/pages/daily-update/` pages have hardcoded data — need API layer
- `src/pages/ai/` pages have hardcoded data — need API layer
- `src/pages/notifications/` has hardcoded notification count
- `src/components/layout/app-sidebar.jsx` `listOfProjects` data is wrong (copied leave admin items — needs fix)
