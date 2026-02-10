# API Mocking Guide

## Overview

This application uses **Mock Service Worker (MSW)** for API mocking during development. Mocking is automatically controlled by environment variables and only runs when explicitly enabled.

---

## How It Works

### Environment-Based Configuration

**Development Mode** (`.env.development`):
```bash
VITE_ENABLE_MOCKING=true
```
- ✅ Mocking is **enabled** by default
- All API calls are intercepted by MSW
- Useful for development without a real backend

**Production Mode** (`.env.production`):
```bash
VITE_ENABLE_MOCKING=false
```
- ❌ Mocking is **disabled** by default
- API calls go to real backend
- No mock service worker loaded

### Automatic Behavior

The application automatically:
1. ✅ Checks `config.enableMocking` and `config.isDevelopment`
2. ✅ Only loads MSW when both conditions are true
3. ✅ Skips mocking entirely in production
4. ✅ Logs status to console

```javascript
// In main.jsx
if (config.enableMocking && config.isDevelopment) {
  console.log("🔧 Mocking enabled in development mode")
  enableMocking()
    .then(() => renderApp())
    .catch((error) => {
      console.error("Failed to enable mocking:", error)
      renderApp()
    })
} else {
  if (config.isProduction) {
    console.log("🚀 Running in production mode")
  }
  renderApp()
}
```

---

## Configuration

### Enable/Disable Mocking

**Option 1: Environment File** (Recommended)
```bash
# .env.development
VITE_ENABLE_MOCKING=true  # Enable mocking

# .env.production
VITE_ENABLE_MOCKING=false # Disable mocking
```

**Option 2: Runtime Override**
```bash
# Disable mocking in development
VITE_ENABLE_MOCKING=false npm run dev

# Enable mocking in production (not recommended!)
VITE_ENABLE_MOCKING=true npm run build
```

### Check Current Status

```javascript
import { config } from '@/lib/config'

console.log('Mocking enabled:', config.enableMocking)
console.log('Environment:', config.isDevelopment ? 'development' : 'production')
```

---

## Mock Service Worker

### Location

- **Service Worker**: `public/mockServiceWorker.js` (auto-generated)
- **Mock Handlers**: `src/services/mock/` directory
- **Mock Configuration**: `src/mock.js`

### Current Mocks

```
src/services/mock/
  ├── index.js       # MSW worker initialization
  ├── mock.js        # Handler exports
  └── comments.js    # Example comment mocks
```

### Example Mock Handler

```javascript
// src/services/mock/comments.js
import { http, HttpResponse } from 'msw'

export const commentHandlers = [
  // GET /comments
  http.get('/comments', () => {
    return HttpResponse.json([
      { id: 1, text: 'Mock comment 1' },
      { id: 2, text: 'Mock comment 2' }
    ])
  }),

  // POST /comments
  http.post('/comments', async ({ request }) => {
    const newComment = await request.json()
    return HttpResponse.json(
      { id: Date.now(), ...newComment },
      { status: 201 }
    )
  })
]
```

---

## Adding New Mocks

### Step 1: Create Mock Handler

```javascript
// src/services/mock/users.js
import { http, HttpResponse } from 'msw'

export const userHandlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ])
  }),

  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com'
    })
  })
]
```

### Step 2: Register Handlers

```javascript
// src/services/mock/mock.js
import { commentHandlers } from './comments'
import { userHandlers } from './users' // Add import

export const handlers = [
  ...commentHandlers,
  ...userHandlers  // Add handlers
]
```

### Step 3: Test

```bash
npm run dev
# Open browser console - should see:
# 🔧 Mocking enabled in development mode
# [MSW] Mocking enabled.
```

---

## Console Output

### Development with Mocking Enabled

```
🔧 Mocking enabled in development mode
Initializing Mock Service Worker...
[MSW] Mocking enabled.
[MSW] Intercepting: GET /api/comments
```

### Production Mode

```
🚀 Running in production mode
Mocking disabled in production
```

### Development with Mocking Disabled

```
Mocking disabled (VITE_ENABLE_MOCKING=false)
```

---

## Troubleshooting

### Problem: Mocks Not Working

**Check 1: Environment Variable**
```bash
# Verify VITE_ENABLE_MOCKING is true
echo $VITE_ENABLE_MOCKING

# Or check in console
console.log(import.meta.env.VITE_ENABLE_MOCKING)
```

**Check 2: Development Mode**
```javascript
// Mocking only works in development
console.log(import.meta.env.DEV)  // Should be true
console.log(import.meta.env.PROD) // Should be false
```

**Check 3: Service Worker**
```bash
# Verify mockServiceWorker.js exists
ls public/mockServiceWorker.js

# If missing, regenerate:
npx msw init public/ --save
```

**Check 4: Browser Console**
Look for MSW logs in browser console:
- `[MSW] Mocking enabled.` - MSW is active
- `[MSW] Intercepting: ...` - Requests are being intercepted

### Problem: Real API Calls in Development

**Solution**: Set `VITE_ENABLE_MOCKING=true`

```bash
# In .env.development
VITE_ENABLE_MOCKING=true

# Restart dev server
npm run dev
```

### Problem: Mocks Running in Production

**Solution**: Set `VITE_ENABLE_MOCKING=false`

```bash
# In .env.production
VITE_ENABLE_MOCKING=false

# Rebuild
npm run build
```

### Problem: MSW Service Worker Not Registering

**Solution 1**: Check service worker file
```bash
# Should exist at:
ls public/mockServiceWorker.js

# If missing:
npx msw init public/ --save
```

**Solution 2**: Check browser
- Open DevTools > Application > Service Workers
- Look for "mockServiceWorker.js"
- If not registered, clear cache and reload

---

## Best Practices

### 1. Keep Mocks Realistic

```javascript
// ❌ Bad - Too simple
http.get('/api/users', () => {
  return HttpResponse.json([{ id: 1, name: 'User' }])
})

// ✅ Good - Realistic data
http.get('/api/users', () => {
  return HttpResponse.json([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ])
})
```

### 2. Simulate Network Delays

```javascript
import { delay, http, HttpResponse } from 'msw'

http.get('/api/users', async () => {
  await delay(500) // Simulate 500ms network delay
  return HttpResponse.json([...])
})
```

### 3. Handle Errors

```javascript
// Simulate error responses
http.post('/api/users', async ({ request }) => {
  const user = await request.json()
  
  // Validation error
  if (!user.email) {
    return HttpResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }
  
  // Success
  return HttpResponse.json(user, { status: 201 })
})
```

### 4. Use Dynamic Responses

```javascript
http.get('/api/users/:id', ({ params }) => {
  const userId = parseInt(params.id)
  
  // Not found
  if (userId > 100) {
    return HttpResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
  
  // Found
  return HttpResponse.json({
    id: userId,
    name: `User ${userId}`
  })
})
```

### 5. Disable for Specific Tests

```javascript
// In test file
import { server } from '@/services/mock'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('with custom mock', () => {
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json([{ id: 999, name: 'Test User' }])
    })
  )
  
  // Test code...
})
```

---

## Production Deployment

### Checklist

Before deploying to production:

- [ ] Set `VITE_ENABLE_MOCKING=false` in `.env.production`
- [ ] Build: `npm run build`
- [ ] Verify build doesn't include MSW: Check `dist/` folder
- [ ] Test production build: `npm run preview`
- [ ] Verify real API calls work
- [ ] Deploy

### Verification

```bash
# Build for production
npm run build

# Check bundle size (MSW should not be included)
ls -lh dist/assets/

# Preview production build
npm run preview

# Test in browser - should see:
# 🚀 Running in production mode
# Mocking disabled in production
```

---

## Advanced Configuration

### Custom MSW Options

```javascript
// src/mock.js
export const enableMocking = async () => {
  // ... checks ...
  
  const { worker } = await import("./services/mock")
  
  return worker.start({
    onUnhandledRequest: 'warn',        // Warn about unhandled requests
    quiet: false,                      // Show all logs
    serviceWorker: {
      url: '/mockServiceWorker.js',   // Custom service worker path
      options: {
        scope: '/',                    // Service worker scope
      }
    }
  })
}
```

### Conditional Mocking by Feature

```javascript
// Only mock specific APIs
if (config.enableMocking && config.isDevelopment) {
  const { worker } = await import("./services/mock")
  
  // Only use specific handlers
  const handlers = [
    ...commentHandlers,
    // Don't mock user handlers - use real API
  ]
  
  worker.use(...handlers)
  await worker.start()
}
```

---

## Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW Examples](https://github.com/mswjs/examples)
- [Mock API Responses](https://mswjs.io/docs/basics/response-resolver)
- [Request Handlers](https://mswjs.io/docs/basics/request-handler)

---

## Summary

✅ **Mocking is environment-aware**
- Enabled in development by default
- Disabled in production by default
- Controlled by `VITE_ENABLE_MOCKING`

✅ **Automatic and Safe**
- No manual configuration needed
- Fails gracefully if MSW fails to load
- No performance impact in production

✅ **Easy to Extend**
- Add new mocks in `src/services/mock/`
- Register in `mock.js`
- Test in development immediately

---

**Last Updated**: January 11, 2026  
**Version**: 1.0
