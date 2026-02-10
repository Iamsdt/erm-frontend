# Testing Guide

## Overview

This guide covers the comprehensive testing utilities, fixtures, and helpers available in the project for writing effective tests.

---

## Table of Contents

1. [Test Utilities](#test-utilities)
2. [Mock Factories](#mock-factories)
3. [Test Fixtures](#test-fixtures)
4. [Test Helpers](#test-helpers)
5. [Writing Tests](#writing-tests)
6. [Best Practices](#best-practices)

---

## Test Utilities

### Custom Render Functions

#### renderWithProviders

Renders component with all providers (Redux, React Query, Router, Theme).

```javascript
import { renderWithProviders } from "@/tests/utils"

test("renders dashboard", () => {
  const { store, queryClient } = renderWithProviders(<Dashboard />, {
    preloadedState: {
      user: { userName: "John", userRole: "admin" },
    },
    route: "/dashboard",
  })

  expect(screen.getByText("Welcome John")).toBeInTheDocument()
})
```

**Options:**

- `preloadedState`: Initial Redux state
- `store`: Custom Redux store
- `queryClient`: Custom React Query client
- `route`: Initial route (e.g., `/dashboard`)
- `initialEntries`: Router entries array
- `theme`: Theme mode (`'light'` or `'dark'`)

#### renderWithRedux

Renders component with only Redux provider.

```javascript
import { renderWithRedux } from "@/tests/utils"

test("displays user name", () => {
  const { store } = renderWithRedux(<UserProfile />, {
    preloadedState: {
      user: { userName: "Jane" },
    },
  })

  expect(screen.getByText("Jane")).toBeInTheDocument()
})
```

#### renderWithQuery

Renders component with only React Query provider.

```javascript
import { renderWithQuery } from "@/tests/utils"

test("fetches data", async () => {
  const { queryClient } = renderWithQuery(<DataList />)

  await waitFor(() => {
    expect(screen.getByText("Data loaded")).toBeInTheDocument()
  })
})
```

#### renderWithRouter

Renders component with only Router provider.

```javascript
import { renderWithRouter } from "@/tests/utils"

test("navigates to home", () => {
  renderWithRouter(<Navigation />, {
    route: "/about",
  })

  const homeLink = screen.getByText("Home")
  fireEvent.click(homeLink)
})
```

### Store & Query Client Creators

```javascript
import { createTestStore, createTestQueryClient } from "@/tests/utils"

// Create test store with initial state
const store = createTestStore({
  user: { userName: "Test User" },
})

// Create test query client (no retries, no caching)
const queryClient = createTestQueryClient({
  queries: { retry: false, staleTime: 0 },
})
```

---

## Mock Factories

Factories for creating test data with unique IDs.

### User Factories

```javascript
import { createMockUser, createMockUsers, resetCounters } from "@/tests/utils"

// Create single user
const user = createMockUser({
  name: "John Doe",
  email: "john@example.com",
  userRole: "admin",
})

// Create multiple users
const users = createMockUsers(10) // Creates 10 users with unique IDs

// Reset counters (use in beforeEach)
beforeEach(() => {
  resetCounters()
})
```

### Comment Factories

```javascript
import { createMockComment, createMockComments } from "@/tests/utils"

const comment = createMockComment({
  text: "Great post!",
  userId: 1,
  postId: 5,
})

const comments = createMockComments(20, { postId: 5 })
```

### API Response Factories

```javascript
import {
  createMockApiResponse,
  createMockApiError,
  createMockPaginatedResponse,
} from "@/tests/utils"

// Success response
const response = createMockApiResponse([{ id: 1, name: "User 1" }], {
  status: 200,
})

// Error response
const error = createMockApiError("Not found", 404)

// Paginated response
const paginated = createMockPaginatedResponse(users, {
  page: 1,
  limit: 10,
  total: 50,
})
```

### Form & File Factories

```javascript
import {
  createMockFile,
  createMockImage,
  createMockFormData,
} from "@/tests/utils"

// Create file
const file = createMockFile({
  name: "document.pdf",
  size: 2048,
  type: "application/pdf",
})

// Create image
const image = createMockImage({
  name: "avatar.jpg",
  type: "image/jpeg",
})

// Create form data
const formData = createMockFormData({
  name: "John",
  email: "john@example.com",
  avatar: image,
})
```

### React Query Factories

```javascript
import { createMockQueryResult, createMockMutationResult } from "@/tests/utils"

// Query result (loading)
const loadingQuery = createMockQueryResult(null, {
  isLoading: true,
  isSuccess: false,
})

// Query result (success)
const successQuery = createMockQueryResult(users, {
  isLoading: false,
  isSuccess: true,
})

// Mutation result
const mutation = createMockMutationResult({
  mutate: vi.fn(),
  isLoading: false,
})
```

---

## Test Fixtures

Predefined test data for consistent testing.

### User Fixtures

```javascript
import { adminUser, regularUser, guestUser, testUsers } from "@/tests/fixtures"

test("admin can delete", () => {
  const { store } = renderWithProviders(<UserList />, {
    preloadedState: { user: adminUser },
  })

  expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument()
})
```

**Available Fixtures:**

- `adminUser`: Admin with full permissions
- `regularUser`: Regular user with read/write
- `guestUser`: Guest with read-only
- `inactiveUser`: Inactive user
- `testUsers`: Array of [admin, regular, guest]
- `allUsers`: Array of all users

### Comment Fixtures

```javascript
import { comment1, commentWithReplies, testComments } from "@/tests/fixtures"

test("displays comment with replies", () => {
  render(<CommentCard comment={commentWithReplies} />)

  expect(screen.getByText(commentWithReplies.text)).toBeInTheDocument()
  expect(screen.getByText("1 reply")).toBeInTheDocument()
})
```

### API Response Fixtures

```javascript
import {
  usersListResponse,
  badRequestError,
  notFoundError,
  paginatedUsersResponse,
} from "@/tests/fixtures"

// Mock successful response
vi.mock("@/services/api", () => ({
  get: vi.fn().mockResolvedValue(usersListResponse),
}))

// Mock error response
vi.mock("@/services/api", () => ({
  get: vi.fn().mockRejectedValue(notFoundError),
}))
```

---

## Test Helpers

### Waiting Utilities

```javascript
import {
  waitForText,
  waitForElementToBeRemoved,
  waitForValidation,
  flushPromises,
} from "@/tests/utils"

// Wait for specific text
await waitForText(() => screen.getByRole("heading"), "Dashboard")

// Wait for element to be removed
await waitForElementToBeRemoved(() => screen.queryByText("Loading..."))

// Wait for validation (debounced inputs)
fireEvent.change(input, { target: { value: "test" } })
await waitForValidation(500)

// Flush all promises
await flushPromises()
```

### Async Control

```javascript
import { createDeferred, delay } from "@/tests/utils"

// Manual promise control
const { promise, resolve, reject } = createDeferred()
mockApi.get.mockReturnValue(promise)

// Test loading state
expect(screen.getByText("Loading...")).toBeInTheDocument()

// Resolve later
resolve({ data: users })

// Wait
await delay(1000)
```

### Assertions

```javascript
import {
  assertAttribute,
  assertClass,
  assertVisible,
  assertCalledWith,
} from "@/tests/utils"

const button = screen.getByRole("button")

assertAttribute(button, "disabled", "true")
assertClass(button, "btn-primary")
assertVisible(button)

const mockFn = vi.fn()
mockFn("test", 123)
assertCalledWith(mockFn, ["test", 123])
```

### Mocking Browser APIs

```javascript
import {
  mockIntersectionObserver,
  mockResizeObserver,
  mockMatchMedia,
  mockLocalStorage,
  mockScrollTo,
} from "@/tests/utils"

beforeEach(() => {
  mockIntersectionObserver()
  mockResizeObserver()
  mockMatchMedia(true) // Media query matches
  mockLocalStorage()
  mockScrollTo()
})
```

### Timer Control

```javascript
import { useFakeTimers } from "@/tests/utils"

test("debounces input", () => {
  const timer = useFakeTimers()

  const onChange = vi.fn()
  render(<DebouncedInput onChange={onChange} delay={300} />)

  fireEvent.change(input, { target: { value: "test" } })

  // Not called yet
  expect(onChange).not.toHaveBeenCalled()

  // Advance time
  timer.advance(300)

  // Now called
  expect(onChange).toHaveBeenCalledWith("test")

  timer.restore()
})
```

### Console Mocking

```javascript
import { mockConsole, suppressConsole } from "@/tests/utils"

test("logs error", () => {
  const console = mockConsole(["log", "error"])

  myFunction() // Calls console.log

  expect(console.log).toHaveBeenCalledWith("Success")

  console.restore()
})

// Suppress console output
test("suppresses warnings", () => {
  const restore = suppressConsole(["warn"])

  // Warnings won't appear in test output
  console.warn("This is hidden")

  restore()
})
```

### Accessibility Testing

```javascript
import { testA11y } from "@/tests/utils"

test("is accessible", async () => {
  const { container } = render(<MyComponent />)

  // Checks for basic a11y violations
  await testA11y(container)
})
```

---

## Writing Tests

### Example: Component Test

```javascript
import { renderWithProviders, createMockUser } from "@/tests/utils"
import { adminUser } from "@/tests/fixtures"
import UserProfile from "@/components/UserProfile"

describe("UserProfile", () => {
  it("displays user information", () => {
    const user = createMockUser({ name: "John Doe" })

    renderWithProviders(<UserProfile user={user} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText(user.email)).toBeInTheDocument()
  })

  it("shows admin badge for admin users", () => {
    renderWithProviders(<UserProfile user={adminUser} />)

    expect(screen.getByText("Admin")).toBeInTheDocument()
  })
})
```

### Example: API Integration Test

```javascript
import { renderWithQuery, createMockUsers } from "@/tests/utils"
import { usersListResponse } from "@/tests/fixtures"
import api from "@/services/api"

vi.mock("@/services/api")

describe("UserList", () => {
  it("fetches and displays users", async () => {
    const users = createMockUsers(5)
    api.get.mockResolvedValue({ data: users })

    renderWithQuery(<UserList />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    // Check all users are displayed
    users.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument()
    })
  })

  it("handles error state", async () => {
    api.get.mockRejectedValue(new Error("Failed to fetch"))

    renderWithQuery(<UserList />)

    await waitFor(() => {
      expect(screen.getByText("Error loading users")).toBeInTheDocument()
    })
  })
})
```

### Example: Form Test

```javascript
import { renderWithProviders, userType } from "@/tests/utils"
import userEvent from "@testing-library/user-event"

describe("LoginForm", () => {
  it("submits form with valid data", async () => {
    const onSubmit = vi.fn()

    renderWithProviders(<LoginForm onSubmit={onSubmit} />)

    const user = userEvent.setup()

    // Type into inputs
    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    await user.type(screen.getByLabelText(/password/i), "password123")

    // Submit form
    await user.click(screen.getByRole("button", { name: /submit/i }))

    // Check submission
    expect(onSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    })
  })

  it("shows validation errors", async () => {
    renderWithProviders(<LoginForm />)

    const user = userEvent.setup()

    // Submit without filling
    await user.click(screen.getByRole("button", { name: /submit/i }))

    // Check errors
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument()
    })
  })
})
```

---

## Best Practices

### 1. Use Fixtures for Consistent Data

```javascript
// ✅ GOOD - Consistent data
import { adminUser } from "@/tests/fixtures"
renderWithProviders(<App />, { preloadedState: { user: adminUser } })

// ❌ BAD - Inconsistent data
renderWithProviders(<App />, {
  preloadedState: { user: { name: "Admin" } }, // Missing fields
})
```

### 2. Use Factories for Dynamic Data

```javascript
// ✅ GOOD - Unique data for each test
const users = createMockUsers(10)

// ❌ BAD - Hardcoded data
const users = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
]
```

### 3. Reset State Between Tests

```javascript
beforeEach(() => {
  resetCounters() // Reset factory counters
  vi.clearAllMocks() // Clear all mocks
})
```

### 4. Use renderWithProviders

```javascript
// ✅ GOOD - All providers included
renderWithProviders(<Dashboard />)

// ❌ BAD - Missing providers (may cause errors)
render(<Dashboard />)
```

### 5. Wait for Async Operations

```javascript
// ✅ GOOD - Wait for async
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument()
})

// ❌ BAD - Don't wait (may cause flaky tests)
expect(screen.getByText("Loaded")).toBeInTheDocument()
```

### 6. Use User Event Over FireEvent

```javascript
import userEvent from "@testing-library/user-event"

// ✅ GOOD - More realistic
const user = userEvent.setup()
await user.click(button)

// ❌ BAD - Less realistic
fireEvent.click(button)
```

### 7. Test User Behavior, Not Implementation

```javascript
// ✅ GOOD - Tests what user sees
expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()

// ❌ BAD - Tests implementation
expect(wrapper.find(".submit-button")).toHaveLength(1)
```

---

## Resources

- [Testing Library Documentation](https://testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: January 11, 2026  
**Version**: 1.0
