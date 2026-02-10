# Authentication Patterns

This document provides guidance on implementing authentication in this React application using axios interceptors. The examples below show how to integrate Firebase Authentication and JWT-based authentication.

## Table of Contents

1. [Firebase Authentication](#firebase-authentication)
2. [JWT Token Authentication](#jwt-token-authentication)
3. [Error Handling](#error-handling)
4. [Best Practices](#best-practices)

---

## Firebase Authentication

### Setup

1. Install Firebase SDK:

```bash
npm install firebase
```

2. Create Firebase configuration file (`src/lib/firebase.js`):

```javascript
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
}

const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)
```

### Request Interceptor

Add the following to `src/services/api/index.js`:

```javascript
import axios from "axios"
import { firebaseAuth } from "../lib/firebase"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Firebase Auth Promise - waits for auth state to be determined
const firebaseAuthPromise = new Promise((resolve) => {
  const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
    unsubscribe()
    resolve(user)
  })
})

// Timeout promise to prevent hanging
const timeoutPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error("Firebase app initialization timed out"))
  }, 5000)
})

// Request interceptor - adds Firebase ID token to requests
instance.interceptors.request.use(
  async function (config) {
    try {
      // Wait for Firebase auth to initialize or timeout
      await Promise.race([firebaseAuthPromise, timeoutPromise])

      const idToken = (await firebaseAuth.currentUser?.getIdToken()) ?? ""

      if (idToken.length !== 0) {
        config.headers.Authorization = `Bearer ${idToken}`
      }
    } catch (error) {
      console.error("Firebase auth error:", error)
      // Optionally redirect to login or handle error
      // window.location.href = "/login"
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handles auth errors
instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Refresh Firebase token
        const newToken = await firebaseAuth.currentUser?.getIdToken(true)

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return instance(originalRequest)
        }
      } catch (refreshError) {
        // Token refresh failed - redirect to login
        console.error("Token refresh failed:", refreshError)
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // Handle other error status codes
    if (error.response === null) {
      // Network error
      if (window.location.pathname !== "/misc/maintenance/") {
        window.location.href = "/misc/maintenance/"
      }
    } else if (error.response?.status === 400) {
      // Bad request - handle validation errors
      console.error("Bad request:", error.response.data)
    } else if (error.response?.status === 502) {
      // Bad gateway - server error
      if (window.location.pathname !== "/misc/maintenance/") {
        window.location.href = "/misc/maintenance/"
      }
    }

    return Promise.reject(error)
  }
)

export default instance
```

---

## JWT Token Authentication

### Setup

For JWT-based authentication, you'll typically store the token in a secure location (httpOnly cookies are preferred, but localStorage can be used for client-side apps).

### Token Storage Utility

Create `src/lib/auth/token-storage.js`:

```javascript
/**
 * Token storage utility
 * Note: For production, prefer httpOnly cookies set by the server
 */

const TOKEN_KEY = "auth_token"
const REFRESH_TOKEN_KEY = "refresh_token"

export const tokenStorage = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (token) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  hasToken: () => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}
```

### Request Interceptor

Add the following to `src/services/api/index.js`:

```javascript
import axios from "axios"
import { tokenStorage } from "../lib/auth/token-storage"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - adds JWT token to requests
instance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handles token refresh and errors
instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenStorage.getRefreshToken()

        if (!refreshToken) {
          // No refresh token - redirect to login
          tokenStorage.clearTokens()
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Call your refresh token endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {
            refreshToken: refreshToken,
          }
        )

        const { token, refreshToken: newRefreshToken } = response.data

        // Update tokens
        tokenStorage.setToken(token)
        if (newRefreshToken) {
          tokenStorage.setRefreshToken(newRefreshToken)
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`
        return instance(originalRequest)
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        tokenStorage.clearTokens()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // Handle other error status codes
    if (error.response === null) {
      // Network error
      console.error("Network error:", error.message)
    } else if (error.response?.status === 400) {
      // Bad request
      console.error("Bad request:", error.response.data)
    } else if (error.response?.status === 403) {
      // Forbidden
      window.location.href = "/misc/not-authorized/"
    } else if (
      error.response?.status === 502 ||
      error.response?.status === 503
    ) {
      // Server error
      window.location.href = "/misc/maintenance/"
    }

    return Promise.reject(error)
  }
)

export default instance
```

### Login Example

```javascript
import axios from "../services/api"
import { tokenStorage } from "../lib/auth/token-storage"

export const login = async (email, password) => {
  try {
    const response = await axios.post("/auth/login", {
      email,
      password,
    })

    const { token, refreshToken, user } = response.data

    // Store tokens
    tokenStorage.setToken(token)
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken)
    }

    // Update Redux store with user data
    dispatch(setUser(user))

    return { success: true, user }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    }
  }
}
```

### Logout Example

```javascript
import { tokenStorage } from "../lib/auth/token-storage"
import { logout as logoutAction } from "../store/slices/user.slice"

export const logout = async () => {
  try {
    // Optionally call logout endpoint
    await axios.post("/auth/logout")
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Clear tokens and Redux state
    tokenStorage.clearTokens()
    dispatch(logoutAction())
    window.location.href = "/login"
  }
}
```

---

## Error Handling

### Common HTTP Status Codes

- **400 Bad Request**: Validation errors, malformed request
- **401 Unauthorized**: Token missing, expired, or invalid
- **403 Forbidden**: User doesn't have permission
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server error
- **502 Bad Gateway**: Upstream server error
- **503 Service Unavailable**: Service temporarily unavailable

### Error Response Format

Your API should return errors in a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": {
      "field": "email",
      "reason": "required"
    }
  }
}
```

---

## Best Practices

### 1. Token Security

- **Prefer httpOnly cookies** for token storage (set by server)
- If using localStorage, be aware of XSS vulnerabilities
- Never store sensitive data in localStorage
- Implement token rotation/refresh mechanism

### 2. Error Handling

- Always handle 401 errors (token expiration)
- Implement automatic token refresh
- Provide user-friendly error messages
- Log errors for debugging (but not sensitive data)

### 3. Request Retry

- Implement retry logic for transient failures (5xx errors)
- Don't retry on 4xx errors (client errors)
- Use exponential backoff for retries

### 4. Loading States

- Show loading indicators during authentication
- Handle timeout scenarios gracefully
- Provide clear feedback to users

### 5. Security Headers

Ensure your backend sets appropriate security headers:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`
- `X-Content-Type-Options: nosniff`

### 6. Environment Variables

Always use environment variables for:

- API base URLs
- Authentication service keys
- Feature flags

Never commit sensitive keys to version control.

---

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [JWT.io - JWT Introduction](https://jwt.io/introduction)
- [Axios Interceptors Documentation](https://axios-http.com/docs/interceptors)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
