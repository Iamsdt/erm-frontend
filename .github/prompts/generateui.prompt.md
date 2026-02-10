---
agent: FrontendMode
---

# Generate Full-Featured UI Page

Generate a complete, production-ready page with UI, API integration, and tests.

**CRITICAL:** Read @.github/copilot-instructions.md for all standards (kebab-case, hooks, SOLID, responsive, imports, styling)

## Workflow

### Phase 1: Plan
1. **Create todo list** - Example steps:
   - [ ] Analyze requirements & design UI
   - [ ] Create MSW mock handlers
   - [ ] Create Axios API functions
   - [ ] Create TanStack Query hooks
   - [ ] Create Redux slice (if global state needed)
   - [ ] Create page component (business logic)
   - [ ] Create UI component (presentation)
   - [ ] Update router config
   - [ ] Write unit tests
   - [ ] Test in browser (chrome-devtools)

2. **Analyze requirements**
   - API endpoints needed (GET/POST/PUT/DELETE)
   - Global vs local state (Redux only if shared across components)
   - Container/Presenter structure
   - Responsive layout breakpoints

### Phase 2: Backend (3-Tier)

3. **MSW Mock Handlers** - `src/services/mock/[name].js`
```javascript
import { http, HttpResponse } from 'msw'
export default [
  http.get('/api/name', () => HttpResponse.json({ data: [...] })),
  http.post('/api/name', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ data: { id: 1, ...body } })
  })
]
```
Import in `src/services/mock/mock.js`

4. **Axios API** - `src/services/api/[name].api.js`
```javascript
import api from "@api/"
import ct from "@constants/"
export const getFeatureName = async () => {
  const response = await api.get(ct.api.featureName.list)
  return response.data
}
```

5. **Add Constants** - `src/lib/constants/api.constant.js`
```javascript
featureName: { list: "feature-name/", detail: "feature-name/:id" }
```

6. **TanStack Query Hooks** - `src/services/query/[name].query.js`
```javascript
export const useFetchFeatureName = () => {
  return useQuery({
    queryKey: ["featureName"],
    queryFn: async ({ signal }) => {
      const response = await getFeatureName({ signal }) // Signal for auto-cancel
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}
```
**Mutations:** Use optimistic updates (onMutate → setQueryData, onError → rollback, onSuccess → invalidate)

7. **Redux Slice** (only if global state needed) - `src/services/store/slices/[name].slice.js`

### Phase 3: UI Components

8. **Page Component** - `src/pages/[name]/index.jsx` (Container)
```javascript
import { useFetchFeatureName } from "@query/feature-name.query"
import { useRequestCancellation } from "@hooks/use-request-cancellation"
import { sanitizeHtml } from "@/lib/utils/sanitize"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import FeatureNameUI from "./feature-name.ui"

const FeatureName = () => {
  useRequestCancellation() // Auto-cancel on unmount
  const { data, isLoading, error } = useFetchFeatureName()
  
  const sanitizedData = data?.map(item => ({
    ...item,
    content: sanitizeHtml(item.content) // Always sanitize user content
  }))

  return (
    <ErrorBoundary>
      <FeatureNameUI data={sanitizedData} isLoading={isLoading} error={error} />
    </ErrorBoundary>
  )
}
```

9. **UI Component** - `src/pages/[name]/[name].ui.jsx` (Presenter)
- **Use shadcn/ui + Tailwind**
- **Responsive:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `p-4 md:p-6 lg:p-8`, 44px touch targets
- **States:** Loading (Skeleton), Error (user-friendly), Empty (no data)
- **Performance:** `loading="lazy"` on images, React.memo if needed
- **Accessibility:** Semantic HTML, ARIA labels, keyboard nav, focus indicators, WCAG contrast
- **PropTypes** for type checking

10. **Add Route** - `src/lib/constants/route.constant.js` + `src/route/main.routes.jsx` (or `blank.routes.jsx`)
```javascript
{ path: ct.route.featureName.LIST, element: <FeatureName /> }
```

### Phase 4: Testing

11. **Unit Tests** - `src/pages/[name]/[name].test.jsx`
```javascript
import { describe, it } from "vitest"
import { render, screen } from "@testing-library/react"
import FeatureName from "./index"

describe("FeatureName", () => {
  it("renders loading state", () => { /* ... */ })
  it("renders data correctly", () => { /* ... */ })
  it("handles errors", () => { /* ... */ })
})
```
- Use `@testing-library/react` + MSW mocks
- Test: loading, error, success states + user interactions

12. **Browser Test** (chrome-devtools)
- Test responsive: 375px (mobile), 768px (tablet), 1920px (desktop)
- Verify API calls, loading states, error handling
- Check console for errors

### Phase 5: Validate

13. **Checklist**
- [ ] **Code:** kebab-case files, hooks only, alias imports, SOLID, Tailwind+shadcn/ui, PropTypes
- [ ] **Architecture:** MSW + API (ct.api) + Query (signal) + Container/Presenter
- [ ] **Security:** sanitizeHtml(), Zod validation, ErrorBoundary
- [ ] **Performance:** useRequestCancellation, lazy images, skeletons, memoization
- [ ] **Responsive:** 375px/768px/1920px tested, mobile-first, 44px touch targets
- [ ] **Accessibility:** Semantic HTML, ARIA, keyboard nav, WCAG contrast
- [ ] **States:** Loading/error/empty handled, toasts for actions
- [ ] **Testing:** Unit tests pass, 80%+ coverage, no console errors
- [ ] **Production:** No console.log/debugger, build succeeds

14. **Run:** `npm run test` + `npm run lint`

## Success Criteria
✅ All todos checked | Functional + responsive UI | Data flow: MSW → API → Query → Component | Route accessible  
✅ Security: sanitized content, validated inputs, ErrorBoundary | No XSS  
✅ Performance: Request cancellation, lazy images, skeletons, no memory leaks  
✅ Responsive: 375px/768px/1920px work, touch-friendly  
✅ Accessibility: Semantic HTML, ARIA, keyboard nav, WCAG contrast  
✅ Tests pass (≥80% coverage), no lint/console errors  
✅ Production-ready code following all conventions

## Key Reminders
- **Todo first**, test incrementally, use chrome-devtools
- **Security:** Always `sanitizeHtml()`, Zod validation, ErrorBoundary
- **Performance:** `useRequestCancellation()`, `loading="lazy"`, skeletons
- **Responsive:** Mobile-first, test 375px/768px/1920px, 44px targets
- **Accessibility:** Semantic HTML, ARIA, keyboard, WCAG contrast
- **States:** Handle loading/error/empty, user-friendly messages, toasts
- **Tests:** 80%+ coverage, edge cases

**Docs:** [SECURITY_GUIDE.md](../../src/docs/SECURITY_GUIDE.md) | [REQUEST_CANCELLATION_GUIDE.md](../../src/docs/REQUEST_CANCELLATION_GUIDE.md) | [TESTING_GUIDE.md](../../src/docs/TESTING_GUIDE.md) | [ARCHITECTURE.md](../../src/docs/ARCHITECTURE.md)
