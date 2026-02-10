# Architecture Documentation

Complete architecture overview, design decisions, and patterns used in the Frontend Base application.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Folder Structure](#folder-structure)
- [Layer Architecture](#layer-architecture)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Routing Architecture](#routing-architecture)
- [Component Architecture](#component-architecture)
- [Testing Architecture](#testing-architecture)
- [Build & Deployment](#build--deployment)
- [Performance Optimization](#performance-optimization)
- [Security Architecture](#security-architecture)
- [Design Decisions](#design-decisions)

## Overview

Frontend Base is built using modern React best practices with a focus on:

- **Scalability** - Easily add new features without refactoring
- **Maintainability** - Clear structure and consistent patterns
- **Performance** - Optimized bundle size and runtime performance
- **Developer Experience** - Fast development with great tooling
- **Production Readiness** - Built-in monitoring, error handling, and PWA support

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            React Components (Presentation)           │  │
│  └────────────────────┬─────────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Container Components (Logic)                │  │
│  └────┬──────────────────┬────────────────────┬─────────┘  │
│       │                  │                    │             │
│  ┌────▼─────┐    ┌──────▼──────┐    ┌────────▼────────┐   │
│  │  Custom  │    │   TanStack  │    │  Redux Store    │   │
│  │  Hooks   │    │   Query     │    │  (Global State) │   │
│  └────┬─────┘    └──────┬──────┘    └────────┬────────┘   │
└───────┼─────────────────┼────────────────────┼─────────────┘
        │                 │                    │
┌───────┼─────────────────┼────────────────────┼─────────────┐
│       ▼                 ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │             Service Layer                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │  │
│  │  │  API Service │  │ Query Hooks  │  │  Slices  │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  │  │
│  └─────────┼──────────────────┼───────────────┼────────┘  │
└────────────┼──────────────────┼───────────────┼───────────┘
             │                  │               │
┌────────────┼──────────────────┼───────────────┼───────────┐
│            ▼                  ▼               ▼           │
│  ┌──────────────────────────────────────────────────────┐│
│  │              HTTP Client (Axios)                     ││
│  └────────────────────────┬─────────────────────────────┘│
└───────────────────────────┼───────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  MSW (Dev/Test)         │
              │  or                     │
              │  Backend API (Prod)     │
              └─────────────────────────┘
```

## Architecture Principles

### 1. Separation of Concerns

Each layer has a single, well-defined responsibility:

- **Presentation Layer** - UI rendering only
- **Container Layer** - Business logic and state management
- **Service Layer** - API communication and data transformation
- **Utility Layer** - Reusable helper functions

### 2. Single Responsibility Principle

Each component, function, and module has one clear purpose:

- Components render UI
- Hooks manage side effects and state
- Services handle API calls
- Utilities provide helpers

### 3. Dependency Inversion

High-level modules don't depend on low-level modules:

```javascript
// High-level component
const CommentsPage = () => {
  const { data } = useFetchComments() // Depends on abstraction
  return <CommentsUI data={data} />
}

// Low-level implementation
export const useFetchComments = () => {
  return useQuery({
    queryFn: () => getComments(), // Can be swapped
  })
}
```

### 4. Open/Closed Principle

Open for extension, closed for modification:

```javascript
// Base component
const Button = ({ variant, ...props }) => {
  return <button className={cn(variants[variant])} {...props} />
}

// Extended without modifying original
const IconButton = (props) => {
  return <Button variant="icon" {...props} />
}
```

### 5. DRY (Don't Repeat Yourself)

Reuse code through:

- Shared components
- Custom hooks
- Utility functions
- Service layer abstraction

### 6. Composition Over Inheritance

Build complex UIs by composing simple components:

```javascript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## Folder Structure

### Root Level Structure

```
frontend-base/
├── public/              # Static assets (served as-is)
│   ├── locales/        # Translation files
│   ├── manifest.json   # PWA manifest
│   ├── sw.js           # Service worker
│   └── offline.html    # Offline fallback
│
├── src/                # Source code
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── route/         # Route configurations
│   ├── services/      # External services
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities & config
│   ├── docs/          # Technical documentation
│   └── tests/         # Test utilities
│
├── .github/            # GitHub configuration
│   ├── agents/        # AI agent configs
│   ├── prompts/       # AI prompts
│   └── skills/        # Reusable skills
│
├── docs/              # Project documentation
└── [config files]     # Various config files
```

### Detailed Source Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components (Radix UI)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── form.jsx
│   │   └── ...
│   │
│   ├── layout/                # Layout components
│   │   ├── header/
│   │   │   ├── index.jsx
│   │   │   ├── theme-switch.jsx
│   │   │   ├── language-nav.jsx
│   │   │   └── user-nav.jsx
│   │   ├── sidebars/
│   │   ├── main-layout.jsx
│   │   └── blank-layout.jsx
│   │
│   ├── comments/              # Feature-specific components
│   │   └── comment-card.jsx
│   │
│   └── ErrorBoundary.jsx      # Error boundary component
│
├── pages/                     # Page components (route handlers)
│   ├── auth/
│   │   ├── index.jsx          # Container (logic)
│   │   └── login.ui.jsx       # Presentation (UI)
│   ├── comments/
│   │   ├── index.jsx
│   │   └── comments.ui.jsx
│   ├── dashboard/
│   │   ├── index.jsx
│   │   └── dashboard.ui.jsx
│   └── misc/
│       ├── not-found.jsx
│       └── error-found.jsx
│
├── route/                     # Route configurations
│   ├── index.jsx              # Main router setup
│   ├── main.routes.jsx        # Authenticated routes
│   └── blank.routes.jsx       # Public routes
│
├── services/                  # External services
│   ├── api/                  # API service layer
│   │   ├── index.js          # Axios instance
│   │   └── comments.api.js   # Comments API
│   │
│   ├── query/                # TanStack Query hooks
│   │   └── comments.query.js
│   │
│   ├── store/                # Redux store
│   │   ├── index.js          # Store configuration
│   │   ├── reducers.js       # Root reducer
│   │   └── slices/
│   │       ├── user.slice.js
│   │       └── theme.slice.js
│   │
│   └── mock/                 # MSW mock handlers
│       ├── mock.js           # MSW setup
│       ├── index.js          # Export all handlers
│       └── comments.js       # Comment handlers
│
├── hooks/                    # Custom React hooks
│   └── use-is-mobile.jsx
│
├── lib/                      # Utilities & configuration
│   ├── constants/           # Application constants
│   │   ├── api.constant.js
│   │   ├── route.constant.js
│   │   └── index.js
│   │
│   ├── context/             # React contexts
│   │   └── theme-provider.jsx
│   │
│   ├── utils/               # Utility functions
│   │   ├── image-optimization.js
│   │   └── performance-monitoring.js
│   │
│   ├── config.js            # App configuration
│   ├── devtools.js          # DevTools setup
│   ├── i18n.js              # i18n configuration
│   ├── pwa.js               # PWA setup
│   ├── query-client.js      # TanStack Query config
│   └── utils.js             # General utilities
│
├── docs/                    # Technical documentation
│   ├── AUTHENTICATION_PATTERNS.md
│   ├── CONFIGURATION_GUIDE.md
│   ├── TESTING_GUIDE.md
│   └── ...
│
└── tests/                   # Test utilities
    ├── fixtures/            # Test data
    │   ├── comments.js
    │   ├── users.js
    │   └── api-responses.js
    │
    └── utils/               # Test helpers
        ├── test-utils.jsx   # Custom render
        ├── test-helpers.js  # Helper functions
        └── mock-factories.js # Data factories
```

### Folder Naming Conventions

- **kebab-case** for folder names: `comment-card/`
- **kebab-case** for file names: `comment-card.jsx`
- **PascalCase** for component files (optional): `CommentCard.jsx`
- **camelCase** for utility files: `imageOptimization.js`
- **SCREAMING_SNAKE_CASE** for constants: `API_ENDPOINTS`

## Layer Architecture

### 1. Presentation Layer

**Responsibility:** Render UI only, no business logic

**Location:** `src/components/`, `src/pages/**/*.ui.jsx`

**Example:**

```javascript
// src/pages/comments/comments.ui.jsx
const CommentsUI = ({
  isLoading,
  displayComments,
  onNextPage,
  onPreviousPage,
}) => {
  return (
    <div className="comments-container">
      {isLoading ? <Skeleton /> : displayComments}
      <div className="pagination">
        <Button onClick={onPreviousPage}>Previous</Button>
        <Button onClick={onNextPage}>Next</Button>
      </div>
    </div>
  )
}
```

**Guidelines:**

- Pure components when possible
- Receive data via props
- No API calls or side effects
- No business logic
- Focus on accessibility and UX

### 2. Container Layer

**Responsibility:** Business logic, data fetching, state management

**Location:** `src/pages/**/index.jsx`

**Example:**

```javascript
// src/pages/comments/index.jsx
const CommentsPage = () => {
  const { data, isLoading, isError } = useFetchComments()
  const [currentPage, setCurrentPage] = useState(1)

  const displayComments = useMemo(() => {
    // Business logic here
    return data
      ?.slice(start, end)
      .map((comment) => <CommentCard key={comment.id} {...comment} />)
  }, [data, currentPage])

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  return (
    <CommentsUI
      isLoading={isLoading}
      displayComments={displayComments}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
    />
  )
}
```

**Guidelines:**

- Contains business logic
- Manages local state
- Handles side effects
- Delegates rendering to UI components

### 3. Service Layer

**Responsibility:** API communication, external services

**Location:** `src/services/api/`, `src/services/query/`

**API Service Example:**

```javascript
// src/services/api/comments.api.js
export const getComments = async (options = {}) => {
  const { signal, params } = options
  return api.get(ct.api.comment.comment, { signal, params })
}
```

**Query Hook Example:**

```javascript
// src/services/query/comments.query.js
export const useFetchComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: async ({ signal }) => {
      const response = await getComments({ signal })
      return response.data
    },
  })
}
```

**Guidelines:**

- Single responsibility per service
- Handle errors consistently
- Support request cancellation
- Add JSDoc comments
- Export only necessary functions

### 4. Utility Layer

**Responsibility:** Reusable helper functions

**Location:** `src/lib/utils/`, `src/lib/constants/`

**Example:**

```javascript
// src/lib/utils.js
export const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
```

**Guidelines:**

- Pure functions (no side effects)
- Well-tested
- Documented with JSDoc
- Single responsibility

## Technology Stack

### Core Technologies

| Technology   | Version | Purpose                 |
| ------------ | ------- | ----------------------- |
| React        | 19.2.0  | UI library              |
| Vite         | 6.3.5   | Build tool & dev server |
| React Router | 7.6.1   | Client-side routing     |

### State Management

| Technology     | Version | Purpose                 |
| -------------- | ------- | ----------------------- |
| Redux Toolkit  | 2.9.0   | Global state management |
| TanStack Query | 5.90.12 | Server state & caching  |
| Redux Persist  | 6.0.0   | State persistence       |

### UI & Styling

| Technology   | Version | Purpose               |
| ------------ | ------- | --------------------- |
| Radix UI     | Various | Accessible components |
| Tailwind CSS | 4.1.12  | Utility-first CSS     |
| Lucide React | 0.468.0 | Icon library          |
| CVA          | 0.7.1   | Component variants    |

### Data Fetching

| Technology     | Version | Purpose              |
| -------------- | ------- | -------------------- |
| Axios          | 1.10.0  | HTTP client          |
| TanStack Query | 5.90.12 | Data synchronization |

### Forms & Validation

| Technology      | Version | Purpose           |
| --------------- | ------- | ----------------- |
| React Hook Form | 7.58.0  | Form management   |
| Zod             | 3.25.49 | Schema validation |

### Testing

| Technology      | Version | Purpose            |
| --------------- | ------- | ------------------ |
| Vitest          | 4.0.15  | Test runner        |
| Testing Library | 16.3.0  | Component testing  |
| MSW             | 2.9.0   | API mocking        |
| Happy DOM       | 17.6.3  | DOM implementation |

### Code Quality

| Technology | Version | Purpose         |
| ---------- | ------- | --------------- |
| ESLint     | 9.28.0  | Linting         |
| Prettier   | 3.5.3   | Code formatting |
| SonarJS    | 3.0.5   | Code quality    |

### Internationalization

| Technology    | Version | Purpose        |
| ------------- | ------- | -------------- |
| i18next       | 25.2.1  | i18n framework |
| react-i18next | 15.5.2  | React bindings |

### PWA & Performance

| Technology     | Version | Purpose                |
| -------------- | ------- | ---------------------- |
| Service Worker | Native  | Offline support        |
| Web Vitals     | 5.1.0   | Performance monitoring |

## Design Patterns

### 1. Container/Presentational Pattern

**Container (Smart Component):**

- Handles data fetching
- Manages state
- Contains business logic

**Presentational (Dumb Component):**

- Receives data via props
- Renders UI only
- No business logic

**Example:**

```javascript
// Container
const CommentsPage = () => {
  const { data, isLoading } = useFetchComments()
  return <CommentsUI data={data} isLoading={isLoading} />
}

// Presentational
const CommentsUI = ({ data, isLoading }) => {
  return <div>{isLoading ? 'Loading...' : data.map(...)}</div>
}
```

### 2. Custom Hooks Pattern

Extract reusable logic into custom hooks:

```javascript
// Custom hook
const useCommentsPagination = (data, perPage = 10) => {
  const [page, setPage] = useState(1)

  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage
    return data?.slice(start, start + perPage)
  }, [data, page, perPage])

  return {
    data: paginatedData,
    page,
    setPage,
    hasNext: page * perPage < data?.length,
  }
}
```

### 3. Compound Components Pattern

Components that work together:

```javascript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 4. Render Props Pattern

Share code between components using a prop whose value is a function:

```javascript
<ErrorBoundary fallback={(error) => <ErrorDisplay error={error} />}>
  <App />
</ErrorBoundary>
```

### 5. Higher-Order Component Pattern

Wrap components to add functionality:

```javascript
const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }

    return <Component {...props} />
  }
}

export default withAuth(Dashboard)
```

### 6. Service Layer Pattern

Abstract API calls into service functions:

```javascript
// Service layer
export const commentsApi = {
  getAll: (params) => api.get("/comments", { params }),
  getById: (id) => api.get(`/comments/${id}`),
  create: (data) => api.post("/comments", data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
}

// Usage
const { data } = useQuery({
  queryKey: ["comments"],
  queryFn: () => commentsApi.getAll(),
})
```

### 7. Factory Pattern (Testing)

Generate test data with factories:

```javascript
export const createMockComment = (overrides = {}) => {
  return {
    id: Math.random(),
    name: "Test User",
    email: "test@example.com",
    body: "Test comment",
    ...overrides,
  }
}
```

## Data Flow

### Query Data Flow (Read)

```
Component → Query Hook → API Service → HTTP Client → Backend
    ↓           ↓             ↓             ↓           ↓
  Render    Cache Hit    Transform      Request     Response
            or Fetch
```

**Example:**

```javascript
// 1. Component uses query hook
const CommentsPage = () => {
  const { data } = useFetchComments()
  return <CommentsUI data={data} />
}

// 2. Query hook calls API service
export const useFetchComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: () => getComments(),
  })
}

// 3. API service makes HTTP request
export const getComments = () => {
  return api.get("/comments")
}
```

### Mutation Data Flow (Write)

```
Component → Mutation Hook → API Service → HTTP Client → Backend
    ↓            ↓               ↓             ↓           ↓
  Action    Optimistic       Request       Execute     Response
            Update           Payload
    ↓
Invalidate
  Cache
```

**Example:**

```javascript
// 1. Component triggers mutation
const { mutate } = useCreateComment()
mutate({ body: "New comment" })

// 2. Mutation hook with optimistic update
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onMutate: async (newComment) => {
      // Optimistic update
      queryClient.setQueryData(["comments"], (old) => [...old, newComment])
    },
    onSuccess: () => {
      // Invalidate to refetch
      queryClient.invalidateQueries(["comments"])
    },
  })
}

// 3. API service makes POST request
export const createComment = (data) => {
  return api.post("/comments", data)
}
```

### State Data Flow

```
Action → Dispatch → Reducer → Store → Component
  ↓         ↓          ↓        ↓         ↓
User     Redux     Update    Update    Re-render
Click   Toolkit    State    Selector
```

**Example:**

```javascript
// 1. Component dispatches action
const dispatch = useDispatch()
dispatch(setTheme("dark"))

// 2. Slice handles action
const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "light" },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload
    },
  },
})

// 3. Component reads from store
const theme = useSelector((state) => state.theme.mode)
```

## State Management

### Global State (Redux)

**Use for:**

- User authentication state
- Theme preferences
- Language settings
- Data shared across many components

**Location:** `src/services/store/slices/`

**Example:**

```javascript
const userSlice = createSlice({
  name: "user",
  initialState: {
    userName: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userName = action.payload.userName
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.userName = null
      state.isAuthenticated = false
    },
  },
})
```

### Server State (TanStack Query)

**Use for:**

- API data
- Remote state
- Data that needs caching
- Data that needs background refetching

**Location:** `src/services/query/`

**Example:**

```javascript
export const useFetchComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}
```

### Local State (useState)

**Use for:**

- Component-specific state
- Form inputs
- UI state (modals, dropdowns)
- Temporary state

**Example:**

```javascript
const [isOpen, setIsOpen] = useState(false)
const [search, setSearch] = useState("")
```

### URL State (React Router)

**Use for:**

- Current page
- Query parameters
- Navigation state

**Example:**

```javascript
const [searchParams, setSearchParams] = useSearchParams()
const page = searchParams.get("page") || 1
```

## Routing Architecture

### Route Configuration

**Location:** `src/route/`

**Structure:**

```javascript
// src/route/index.jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorFound />,
    children: [
      {
        element: <MainLayout />,
        children: mainRoutes, // Authenticated routes
      },
      {
        element: <BlankLayout />,
        children: blankRoutes, // Public routes
      },
    ],
  },
])
```

### Route Protection

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}
```

### Lazy Loading

```javascript
const Dashboard = lazy(() => import('@/pages/dashboard'))

{
  path: 'dashboard',
  element: (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  ),
}
```

## Component Architecture

### Base UI Components

**Location:** `src/components/ui/`

**Purpose:** Reusable, accessible base components

**Examples:**

- Button
- Card
- Form
- Input
- Dialog

**Guidelines:**

- Use Radix UI for accessibility
- Style with Tailwind CSS
- Support variants with CVA
- Fully typed with JSDoc

### Layout Components

**Location:** `src/components/layout/`

**Purpose:** Application layout structure

**Components:**

- `MainLayout` - Authenticated layout (header + sidebar)
- `BlankLayout` - Public layout (no header/sidebar)
- `Header` - Application header
- `Sidebar` - Navigation sidebar

### Feature Components

**Location:** `src/components/{feature}/`

**Purpose:** Feature-specific reusable components

**Example:** `src/components/comments/comment-card.jsx`

**Guidelines:**

- Group by feature
- Keep components focused
- Use composition

### Page Components

**Location:** `src/pages/`

**Purpose:** Route handler components

**Structure:**

```
src/pages/comments/
├── index.jsx        # Container (logic)
└── comments.ui.jsx  # Presentation (UI)
```

## Testing Architecture

### Test Organization

```
src/tests/
├── fixtures/              # Test data
│   ├── comments.js       # Comment fixtures
│   ├── users.js          # User fixtures
│   └── api-responses.js  # API response fixtures
│
└── utils/                # Test utilities
    ├── test-utils.jsx    # Custom render functions
    ├── test-helpers.js   # Helper functions
    └── mock-factories.js # Data factories
```

### Testing Layers

**Unit Tests:**

- Test individual functions
- Test utility functions
- Test custom hooks

**Component Tests:**

- Test component rendering
- Test user interactions
- Test state updates

**Integration Tests:**

- Test API integration
- Test data flow
- Test multiple components together

See [TESTING_GUIDE.md](./src/docs/TESTING_GUIDE.md) for complete testing documentation.

## Build & Deployment

### Build Process

```
Source Code → Vite Build → Optimizations → Production Bundle
     ↓             ↓             ↓                  ↓
   ESLint     Transpile    Tree Shake         dist/
  TypeCheck    Minify       Code Split
```

### Build Output

```
dist/
├── index.html           # Main HTML file
├── assets/
│   ├── index-[hash].js  # Main bundle
│   ├── vendor-[hash].js # Dependencies
│   ├── [page]-[hash].js # Route chunks
│   └── [page]-[hash].css # Styles
└── public/              # Static assets
```

### Optimization Strategies

**Code Splitting:**

- Route-based splitting
- Vendor chunk separation
- Dynamic imports

**Minification:**

- JavaScript minification (Terser)
- CSS minification (cssnano)
- HTML minification

**Asset Optimization:**

- Image optimization
- Font subsetting
- SVG optimization

## Performance Optimization

### 1. Code Splitting

```javascript
// Route-based splitting
const Dashboard = lazy(() => import("./pages/dashboard"))

// Component-based splitting
const HeavyComponent = lazy(() => import("./components/HeavyComponent"))
```

### 2. Memoization

```javascript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])

// Memoize components
const MemoizedComponent = memo(ExpensiveComponent)
```

### 3. Virtual Scrolling

```javascript
import { useVirtualizer } from "@tanstack/react-virtual"

const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
})
```

### 4. Image Optimization

```javascript
// Lazy loading
<img loading="lazy" src="..." alt="..." />

// Responsive images
<img
  srcSet="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 800px"
  src="medium.jpg"
  alt="..."
/>
```

### 5. Bundle Size Optimization

- Tree shaking
- Import only what you need
- Use dynamic imports
- Monitor bundle size

## Security Architecture

### 1. XSS Protection

```javascript
import DOMPurify from "dompurify"

const safeHTML = DOMPurify.sanitize(userInput)
```

### 2. CSRF Protection

```javascript
api.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken()
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken
  }
  return config
})
```

### 3. Secure Headers

```javascript
// Content Security Policy
headers: {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'"
}
```

### 4. Authentication

- JWT tokens stored in memory (not localStorage)
- Refresh token in httpOnly cookie
- Auto token refresh

See [SECURITY_GUIDE.md](./src/docs/SECURITY_GUIDE.md) for complete security documentation.

## Design Decisions

### Why Vite over Create React App?

- ⚡ Faster dev server (ESBuild)
- 🎯 Better build performance
- 📦 Smaller bundle size
- 🔧 Better plugin ecosystem
- 🚀 Active development

### Why Redux Toolkit over Context API?

- 🎯 Better performance (selective re-renders)
- 🔧 DevTools integration
- 📦 Middleware support
- 🧪 Easier testing
- 📚 Established patterns

### Why TanStack Query over Redux for API?

- 🎯 Built for async data
- 💾 Automatic caching
- 🔄 Background refetching
- ⚡ Request deduplication
- 🧪 Better testing story

### Why Radix UI over Material-UI?

- ♿ Better accessibility (WCAG 2.1)
- 🎨 Unstyled (full control)
- 📦 Smaller bundle size
- 🔧 Composable primitives
- 🚀 Performance focused

### Why MSW over axios-mock-adapter?

- 🌐 Network-level mocking
- 🧪 Works in both tests and dev
- 📝 Better DX (similar to real API)
- 🔧 No code changes between dev/prod
- 🎯 Service worker based

### Why Vitest over Jest?

- ⚡ Faster (uses Vite)
- 🔧 Same config as build
- 📦 ESM support out of the box
- 🎯 Better DX
- 🚀 Active development

---

**For more information, see:**

- [API.md](./API.md) - API documentation
- [TESTING_GUIDE.md](./src/docs/TESTING_GUIDE.md) - Testing guide
- [CONFIGURATION_GUIDE.md](./src/docs/CONFIGURATION_GUIDE.md) - Configuration
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
