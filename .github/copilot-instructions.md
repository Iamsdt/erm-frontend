# Frontend Base - Codebase Standards

## Tech Stack

React 19 + Vite + SWC | Redux Toolkit + Redux Persist | TanStack Query v5 | React Router v7 | Tailwind CSS v4 + shadcn/ui | MSW (dev mocking) | i18next

## File Naming (Kebab-Case)

✅ `user-profile.jsx`, `use-user-data.js`, `auth-utils.js`  
❌ `UserProfile.jsx`, `useUserData.js`, `authUtils.js`

Code: PascalCase components, camelCase functions, SCREAMING_SNAKE_CASE constants

## React Patterns

- **Hooks only** - no class components
- **Container/Presenter**: `index.jsx` (logic) + `name.ui.jsx` (UI)
- **Hook returns**: Objects for complex `{ data, isLoading }`, arrays for simple `[value, setValue]`

## Import Aliases (Never Relative Paths)

```javascript
@/           → src/
@hooks       → src/hooks/
@lib         → src/lib/
@context     → src/lib/context/
@pages       → src/pages/
@constants   → src/lib/constants/
@api         → src/services/api/
@query       → src/services/query/
@store       → src/services/store/
```

## 3-Tier Data Flow

1. **API Layer** (`@api/`) - Axios + interceptors
2. **Query Layer** (`@query/`) - TanStack Query hooks
3. **Component** - Uses query hooks → Passes to `.ui.jsx`

Example: `index.jsx` (logic) → uses `useFetchData()` → passes to `name.ui.jsx` (UI)

## Component Patterns

**shadcn/ui + CVA for variants** ([see button.jsx](src/components/ui/button.jsx))

**Responsive (Mobile-first):**

- Breakpoints: 375px (mobile), 768px (tablet), 1920px (desktop)
- Tailwind: `sm:` `md:` `lg:` `xl:`
- Touch targets: 44x44px minimum

## Commands

```bash
npm run dev    # Port 3030
npm run test   # Vitest + coverage
npm run lint   # ESLint check/fix
npm run build  # Production build (removes console logs, splits chunks)
```

## Testing with Vitest

- Config: [vite.config.js](vite.config.js#L89-L132) (happy-dom environment)
- Setup: [src/setup-tests.js](src/setup-tests.js) - includes @testing-library/jest-dom
- Tests: Place in `src/**/*.{test,spec}.{js,jsx}`
- Use Testing Library patterns - query by role/label, not implementation details

## MSW Mocking

Auto-enabled in dev. Add handlers to `src/services/mock/`:

```javascript
import { http, HttpResponse } from "msw"
export default [
  http.get("/api/endpoint", () => HttpResponse.json({ data: [] })),
]
```

## Routing

- `main.routes.jsx` - Authenticated (with sidebar)
- `blank.routes.jsx` - Public (auth pages)

## i18n

```javascript
const { t } = useTranslation() // Translations: public/locales/{lng}/
```

## SOLID Principles

- **Single Responsibility**: One purpose per component/hook (separate logic from UI)
- **Open/Closed**: Extend via props (variants, composition)
- **Liskov Substitution**: Consistent interfaces (all inputs accept `value`, `onChange`, `error`)
- **Interface Segregation**: Focused hooks (split `useAuth` from `useUserProfile`)
- **Dependency Inversion**: Depend on abstractions (use hooks, not direct API calls)

## Styling & Linting

- **Tailwind + shadcn/ui only** (no custom CSS)
- **ESLint**: `@10xscale/eslint-modern` preset
- **JSDoc**: Required for utilities

## Security (MANDATORY)

**Sanitize user content:**

```javascript
import { sanitizeHtml, SanitizedHtml } from "@/lib/utils/sanitize"
;<SanitizedHtml html={userContent} /> // or sanitizeHtml(userContent)
```

**Validate:** Zod schemas for forms/API, PropTypes for components  
**Headers:** Pre-configured in `index.html` (CSP, X-Frame-Options)  
**Reference:** [SECURITY_GUIDE.md](src/docs/SECURITY_GUIDE.md)

- **Forms**: Use Zod schemas with React Hook Form
- **API responses**: Validate structure before using data
- **Type checking**: Use PropTypes for component props

### Security Headers

- Already configured in `index.html`
- X-Frame-Options, X-Content-Type-Options, CSP
- See [SECURITY_GUIDE.md](src/docs/SECURITY_GUIDE.md)

## Performance Optimization

**Apply these performance best practices:**

### Request Management

- **Cancel requests**: Use `useRequestCancellation()` hook or pass `signal` in API calls
- **Avoid memory leaks**: Requests auto-cancel on component unmount
- **React Query integration**: Automatic signal support

```javascript
import { useRequestCancellation } from "@hooks/use-request-cancellation"
useRequestCancellation() // Auto-cancel on unmount
// Or pass signal in React Query: queryFn: ({ signal }) => api.get(url, { signal })
```

**Optimize:** Lazy load images (`loading="lazy"`), code splitting (React.lazy()), memoization (useMemo/useCallback)  
**Reference:** [REQUEST_CANCELLATION_GUIDE.md](src/docs/REQUEST_CANCELLATION_GUIDE.md)

## Error Handling

**Wrap with ErrorBoundary:**

```javascript
<ErrorBoundary fallback={(error) => <ErrorDisplay error={error} />}>
  <YourComponent />
</ErrorBoundary>
```

**Handle states:** Loading (skeleton), error (user-friendly message), empty (no data)  
**User feedback:** Toast notifications (`@/components/ui/use-toast`)

## Configuration

```javascript
import { config } from "@/lib/config"
config.apiBaseUrl // Validated env vars
config.features.enablePWA // Feature flags
config.isDevelopment // Environment checks
```

Files: `.env.example` (template), `.env.development`, `.env.production`  
Reference: [CONFIGURATION_GUIDE.md](src/docs/CONFIGURATION_GUIDE.md)

## Performance Monitoring

Web Vitals auto-tracked (`src/lib/utils/performance-monitoring.js`) - LCP, FID, CLS, FCP, TTFB  
Reference: [FRONTEND_MONITORING.md](src/docs/FRONTEND_MONITORING.md)

## Key Files Reference

**Core:** `src/lib/config.js` (env config) | `src/services/store/index.js` (Redux) | `src/lib/query-client.js` (TanStack Query) | `src/lib/menu-list.js` (nav)

**Utils:** `src/lib/utils/sanitize.js` | `src/lib/utils/performance-monitoring.js` | `src/hooks/use-request-cancellation.jsx`

**Docs:** [ARCHITECTURE.md](src/docs/ARCHITECTURE.md) | [SECURITY_GUIDE.md](src/docs/SECURITY_GUIDE.md) | [TESTING_GUIDE.md](src/docs/TESTING_GUIDE.md) | [CONFIGURATION_GUIDE.md](src/docs/CONFIGURATION_GUIDE.md)
