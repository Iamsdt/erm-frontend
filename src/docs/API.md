# API Documentation

Complete API documentation for the Frontend Base application, including endpoints, request/response formats, error handling, and integration patterns.

## 📋 Table of Contents

- [Overview](#overview)
- [Base Configuration](#base-configuration)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Request/Response Format](#requestresponse-format)
- [Error Handling](#error-handling)
- [API Service Layer](#api-service-layer)
- [TanStack Query Integration](#tanstack-query-integration)
- [Mock API (MSW)](#mock-api-msw)
- [Request Cancellation](#request-cancellation)
- [Best Practices](#best-practices)

## Overview

The application uses a clean architecture for API integration:

```
Component → Query Hook → API Service → HTTP Client → Backend
    ↓           ↓            ↓              ↓            ↓
Comments    useFetchComments getComments   Axios      REST API
```

### Key Features

- ✅ **Service Layer Abstraction** - Clean API service layer
- ✅ **Automatic Caching** - TanStack Query handles caching
- ✅ **Request Cancellation** - Automatic cleanup on unmount
- ✅ **Mock API Support** - MSW for development and testing
- ✅ **Error Handling** - Consistent error handling patterns
- ✅ **Type Safety** - JSDoc comments for all API functions

## Base Configuration

### API Client Setup

**Location:** `src/services/api/index.js`

```javascript
import axios from "axios"
import ct from "@constants/"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: ct.api.baseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
```

### Environment Configuration

**Location:** `src/lib/config.js`

```javascript
export const config = {
  api: {
    baseUrl:
      import.meta.env.VITE_API_BASE_URL ||
      "https://jsonplaceholder.typicode.com",
    timeout: 30000,
  },
  features: {
    enableMSW: import.meta.env.VITE_ENABLE_MSW === "true",
    enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === "true",
  },
}
```

### Constants

**Location:** `src/lib/constants/api.constant.js`

```javascript
export const API_ENDPOINTS = {
  comment: {
    comment: "/comments",
    commentById: (id) => `/comments/${id}`,
  },
  user: {
    profile: "/user/profile",
    login: "/auth/login",
    logout: "/auth/logout",
  },
}
```

## Authentication

### Login

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

**Service Function:**

```javascript
// src/services/api/auth.api.js
export const login = async (credentials) => {
  return api.post(ct.api.user.login, credentials)
}
```

### Logout

**Endpoint:** `POST /auth/logout`

**Request:**

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Token Refresh

**Endpoint:** `POST /auth/refresh`

**Request:**

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "expiresIn": 3600
  }
}
```

## API Endpoints

### Comments

#### Get All Comments

**Endpoint:** `GET /comments`

**Query Parameters:**

- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `sort` (optional) - Sort field (default: 'createdAt')
- `order` (optional) - Sort order: 'asc' or 'desc' (default: 'desc')

**Request Example:**

```http
GET /comments?page=1&limit=10&sort=createdAt&order=desc
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "postId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "body": "This is a great comment!",
      "avatar": "https://i.pravatar.cc/150?u=john@example.com",
      "likes": 42,
      "date": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 10,
    "totalPages": 50
  }
}
```

**Service Function:**

```javascript
// src/services/api/comments.api.js
export const getComments = async (options = {}) => {
  const { signal, params } = options

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    params,
    signal,
  }

  return api.get(ct.api.comment.comment, config)
}
```

**Query Hook:**

```javascript
// src/services/query/comments.query.js
export const useFetchComments = (params) => {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: async ({ signal }) => {
      const response = await getComments({ signal, params })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}
```

#### Get Comment by ID

**Endpoint:** `GET /comments/:id`

**Request Example:**

```http
GET /comments/123
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "postId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "body": "This is a great comment!",
    "avatar": "https://i.pravatar.cc/150?u=john@example.com",
    "likes": 42,
    "date": "2024-01-15T10:30:00Z"
  }
}
```

**Service Function:**

```javascript
export const getCommentById = async (id, options = {}) => {
  const { signal } = options

  return api.get(ct.api.comment.commentById(id), {
    signal,
    headers: { "Content-Type": "application/json" },
  })
}
```

#### Create Comment

**Endpoint:** `POST /comments`

**Request:**

```json
{
  "postId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "body": "This is my new comment!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 501,
    "postId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "body": "This is my new comment!",
    "avatar": "https://i.pravatar.cc/150?u=john@example.com",
    "likes": 0,
    "date": "2024-01-15T10:30:00Z"
  },
  "message": "Comment created successfully"
}
```

**Service Function:**

```javascript
export const createComment = async (data, options = {}) => {
  const { signal } = options

  return api.post(ct.api.comment.comment, data, {
    signal,
    headers: { "Content-Type": "application/json" },
  })
}
```

**Mutation Hook:**

```javascript
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createComment(data),
    onSuccess: () => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}
```

#### Update Comment

**Endpoint:** `PUT /comments/:id`

**Request:**

```json
{
  "body": "Updated comment text"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "body": "Updated comment text",
    "updatedAt": "2024-01-15T10:35:00Z"
  },
  "message": "Comment updated successfully"
}
```

**Service Function:**

```javascript
export const updateComment = async (id, data, options = {}) => {
  const { signal } = options

  return api.put(ct.api.comment.commentById(id), data, {
    signal,
    headers: { "Content-Type": "application/json" },
  })
}
```

#### Delete Comment

**Endpoint:** `DELETE /comments/:id`

**Response:**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Service Function:**

```javascript
export const deleteComment = async (id, options = {}) => {
  const { signal } = options

  return api.delete(ct.api.comment.commentById(id), {
    signal,
    headers: { "Content-Type": "application/json" },
  })
}
```

### User Profile

#### Get User Profile

**Endpoint:** `GET /user/profile`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://i.pravatar.cc/150?u=123",
    "role": "user",
    "createdAt": "2023-01-15T10:30:00Z",
    "preferences": {
      "theme": "dark",
      "language": "en"
    }
  }
}
```

#### Update User Profile

**Endpoint:** `PUT /user/profile`

**Request:**

```json
{
  "name": "John Updated",
  "preferences": {
    "theme": "light",
    "language": "hi"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Updated",
    "preferences": {
      "theme": "light",
      "language": "hi"
    }
  },
  "message": "Profile updated successfully"
}
```

## Request/Response Format

### Standard Request Format

All API requests follow this format:

```typescript
interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  url: string
  headers?: Record<string, string>
  params?: Record<string, any> // Query parameters
  data?: any // Request body
  signal?: AbortSignal // For cancellation
}
```

### Standard Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format"
    }
  }
}
```

## Error Handling

### Error Codes

| Code                  | HTTP Status | Description                     |
| --------------------- | ----------- | ------------------------------- |
| `UNAUTHORIZED`        | 401         | Authentication required         |
| `FORBIDDEN`           | 403         | Insufficient permissions        |
| `NOT_FOUND`           | 404         | Resource not found              |
| `VALIDATION_ERROR`    | 400         | Request validation failed       |
| `CONFLICT`            | 409         | Resource conflict               |
| `RATE_LIMIT`          | 429         | Too many requests               |
| `SERVER_ERROR`        | 500         | Internal server error           |
| `SERVICE_UNAVAILABLE` | 503         | Service temporarily unavailable |

### Error Handling in Components

```javascript
const CommentsPage = () => {
  const { data, error, isError } = useFetchComments()

  useEffect(() => {
    if (error) {
      // Get user-friendly error message
      const message = getErrorMessage(error)

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }
  }, [error])

  if (isError) {
    return <ErrorDisplay error={error} />
  }

  return <CommentsUI data={data} />
}
```

### Error Utility Functions

```javascript
// src/lib/utils/error.js

/**
 * Extract user-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message
  }

  if (error.response?.status === 404) {
    return "Resource not found"
  }

  if (error.response?.status === 401) {
    return "Please log in to continue"
  }

  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your connection"
  }

  return "Something went wrong. Please try again"
}

/**
 * Check if error is cancellation
 */
export const isCancelledError = (error) => {
  return axios.isCancel(error) || error.name === "CanceledError"
}
```

## API Service Layer

### Service Layer Pattern

The application uses a service layer to abstract API calls:

```javascript
// src/services/api/comments.api.js

/**
 * Fetches comments from the API
 * @param {Object} options - Request options
 * @param {AbortSignal} options.signal - Abort signal for cancellation
 * @param {Object} options.params - Query parameters
 * @returns {Promise} API response
 */
export const getComments = async (options = {}) => {
  const { signal, params } = options

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    params,
    signal,
  }

  return api.get(ct.api.comment.comment, config)
}
```

### Benefits

1. **Single Source of Truth** - Change endpoint once
2. **Easy Mocking** - Mock service functions in tests
3. **Type Safety** - JSDoc comments provide type hints
4. **Consistency** - Same error handling everywhere
5. **Testability** - Easy to test in isolation

## TanStack Query Integration

### Query Hooks

```javascript
// src/services/query/comments.query.js

/**
 * Fetch comments with automatic request cancellation
 */
export const useFetchComments = (params) => {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: async ({ signal }) => {
      const response = await getComments({ signal, params })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
```

### Mutation Hooks

```javascript
/**
 * Create comment mutation
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createComment(data),
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments"] })

      // Snapshot previous value
      const previousComments = queryClient.getQueryData(["comments"])

      // Optimistically update
      queryClient.setQueryData(["comments"], (old) => [...old, newComment])

      return { previousComments }
    },
    onError: (err, newComment, context) => {
      // Rollback on error
      queryClient.setQueryData(["comments"], context.previousComments)
    },
    onSuccess: () => {
      // Refetch after success
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}
```

### Query Configuration

**Location:** `src/lib/query-client.js`

```javascript
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

## Mock API (MSW)

### MSW Setup

**Location:** `src/services/mock/mock.js`

```javascript
import { setupWorker } from "msw/browser"
import { handlers } from "./index"

export const worker = setupWorker(...handlers)

// Start MSW in development
if (import.meta.env.VITE_ENABLE_MSW === "true") {
  worker.start({
    onUnhandledRequest: "warn",
  })
}
```

### Mock Handlers

**Location:** `src/services/mock/comments.js`

```javascript
import { http, HttpResponse } from "msw"
import { mockComments } from "@/tests/fixtures/comments"

export const commentHandlers = [
  // Get all comments
  http.get("/comments", () => {
    return HttpResponse.json({
      success: true,
      data: mockComments,
    })
  }),

  // Get comment by ID
  http.get("/comments/:id", ({ params }) => {
    const comment = mockComments.find((c) => c.id === params.id)

    if (!comment) {
      return HttpResponse.json(
        { success: false, error: { code: "NOT_FOUND" } },
        { status: 404 }
      )
    }

    return HttpResponse.json({ success: true, data: comment })
  }),

  // Create comment
  http.post("/comments", async ({ request }) => {
    const data = await request.json()

    return HttpResponse.json({
      success: true,
      data: { id: Date.now(), ...data },
      message: "Comment created successfully",
    })
  }),
]
```

See [MOCKING_GUIDE.md](./src/docs/MOCKING_GUIDE.md) for complete MSW documentation.

## Request Cancellation

All API requests support automatic cancellation:

```javascript
// Automatic cancellation with TanStack Query
export const useFetchComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: async ({ signal }) => {
      // Signal is automatically provided by TanStack Query
      const response = await getComments({ signal })
      return response.data
    },
  })
}
```

**Benefits:**

- ✅ Automatic cleanup on component unmount
- ✅ Cancels previous request on refetch
- ✅ Prevents memory leaks
- ✅ Improves performance

See [REQUEST_CANCELLATION_GUIDE.md](./src/docs/REQUEST_CANCELLATION_GUIDE.md) for details.

## Best Practices

### 1. Always Use Service Layer

❌ **Bad:**

```javascript
const { data } = useQuery({
  queryKey: ["comments"],
  queryFn: () => axios.get("/comments"),
})
```

✅ **Good:**

```javascript
const { data } = useFetchComments()
```

### 2. Pass Abort Signal

❌ **Bad:**

```javascript
export const getComments = () => {
  return api.get("/comments")
}
```

✅ **Good:**

```javascript
export const getComments = (options = {}) => {
  const { signal } = options
  return api.get("/comments", { signal })
}
```

### 3. Use Proper Query Keys

❌ **Bad:**

```javascript
useQuery({ queryKey: ["data"], ... })
```

✅ **Good:**

```javascript
useQuery({ queryKey: ["comments", { page, filter }], ... })
```

### 4. Handle Errors Properly

❌ **Bad:**

```javascript
try {
  await createComment(data)
} catch (error) {
  console.error(error)
}
```

✅ **Good:**

```javascript
try {
  await createComment(data)
  toast({ title: "Success", description: "Comment created" })
} catch (error) {
  if (!isCancelledError(error)) {
    const message = getErrorMessage(error)
    toast({ title: "Error", description: message, variant: "destructive" })
  }
}
```

### 5. Use Optimistic Updates

```javascript
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onMutate: async (newComment) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["comments"] })
      const previous = queryClient.getQueryData(["comments"])
      queryClient.setQueryData(["comments"], (old) => [...old, newComment])
      return { previous }
    },
    onError: (err, vars, context) => {
      // Rollback on error
      queryClient.setQueryData(["comments"], context.previous)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}
```

### 6. Add Loading States

```javascript
const { data, isLoading, isError, error } = useFetchComments()

if (isLoading) return <Skeleton />
if (isError) return <ErrorDisplay error={error} />
return <CommentsUI data={data} />
```

### 7. Implement Proper Pagination

```javascript
export const useFetchComments = (page, limit) => {
  return useQuery({
    queryKey: ["comments", page, limit],
    queryFn: async ({ signal }) => {
      const response = await getComments({
        signal,
        params: { page, limit },
      })
      return response.data
    },
    keepPreviousData: true, // Keep showing old data while fetching new
  })
}
```

---

**For more information:**

- [MOCKING_GUIDE.md](./src/docs/MOCKING_GUIDE.md) - Complete MSW guide
- [REQUEST_CANCELLATION_GUIDE.md](./src/docs/REQUEST_CANCELLATION_GUIDE.md) - Request cancellation patterns
- [AUTHENTICATION_PATTERNS.md](./src/docs/AUTHENTICATION_PATTERNS.md) - Auth implementation
- [TESTING_GUIDE.md](./src/docs/TESTING_GUIDE.md) - Testing API integrations
