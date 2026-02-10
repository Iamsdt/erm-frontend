# Error Monitoring Setup Guide

This guide explains how to set up error monitoring for your application using services like Sentry.

## Table of Contents

1. [Sentry Integration](#sentry-integration)
2. [Alternative Services](#alternative-services)
3. [Custom Error Tracking](#custom-error-tracking)
4. [Testing Error Reporting](#testing-error-reporting)

---

## Sentry Integration

### Installation

1. Install Sentry SDK:

```bash
npm install @sentry/react
```

2. Create Sentry configuration file (`src/lib/sentry.js`):

```javascript
import * as Sentry from "@sentry/react"

export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn("Sentry DSN not configured. Error monitoring disabled.")
    return
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || "production",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Adjust based on your needs (0.0 to 1.0)
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  })
}
```

3. Initialize Sentry in `src/main.jsx`:

```javascript
import { initSentry } from "./lib/sentry"

// Initialize Sentry before rendering
if (import.meta.env.PROD) {
  initSentry()
}
```

4. Add Sentry DSN to `.env`:

```bash
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Features

- **Error Tracking**: Automatically captures JavaScript errors
- **Performance Monitoring**: Tracks page load times and API calls
- **Session Replay**: Records user sessions for debugging
- **Source Maps**: Upload source maps for better error stack traces

### Source Maps Upload

For production builds, upload source maps to Sentry:

1. Install Sentry CLI:

```bash
npm install --save-dev @sentry/cli
```

2. Add build script to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "build:sentry": "npm run build && sentry-cli sourcemaps inject dist && sentry-cli sourcemaps upload dist"
  }
}
```

3. Configure Sentry CLI (`.sentryclirc`):

```ini
[auth]
token=your-sentry-auth-token

[defaults]
org=your-org
project=your-project
```

---

## Alternative Services

### LogRocket

1. Install LogRocket:

```bash
npm install logrocket
```

2. Initialize in `src/main.jsx`:

```javascript
import LogRocket from "logrocket"

if (import.meta.env.PROD && import.meta.env.VITE_LOGROCKET_APP_ID) {
  LogRocket.init(import.meta.env.VITE_LOGROCKET_APP_ID)
}
```

### Bugsnag

1. Install Bugsnag:

```bash
npm install @bugsnag/js @bugsnag/plugin-react
```

2. Initialize in `src/main.jsx`:

```javascript
import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"

if (import.meta.env.PROD && import.meta.env.VITE_BUGSNAG_API_KEY) {
  Bugsnag.start({
    apiKey: import.meta.env.VITE_BUGSNAG_API_KEY,
    plugins: [new BugsnagPluginReact()],
  })
}
```

### Rollbar

1. Install Rollbar:

```bash
npm install rollbar
```

2. Initialize in `src/main.jsx`:

```javascript
import Rollbar from "rollbar"

if (import.meta.env.PROD && import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN) {
  const rollbar = new Rollbar({
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  })
}
```

---

## Custom Error Tracking

If you prefer to build your own error tracking, you can send errors to your own API:

### Update Error Handler

Modify `src/lib/utils/error-handler.js`:

```javascript
const sendToErrorEndpoint = async (errorReport) => {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/errors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorReport),
    })
  } catch (error) {
    console.error("Failed to send error to endpoint:", error)
  }
}
```

---

## Testing Error Reporting

### Test Error Boundary

1. Create a test component that throws an error:

```javascript
// src/components/TestError.jsx
const TestError = () => {
  throw new Error("Test error for error boundary")
}

export default TestError
```

2. Temporarily add it to a route to test

### Test Global Error Handler

Open browser console and run:

```javascript
// Test JavaScript error
throw new Error("Test global error handler")

// Test unhandled promise rejection
Promise.reject(new Error("Test promise rejection"))
```

### Test API Error

Make an API call to a non-existent endpoint:

```javascript
fetch("https://api.example.com/nonexistent")
  .then((response) => response.json())
  .catch((error) => console.error("API Error:", error))
```

---

## Best Practices

1. **Don't Log Sensitive Data**: Never log passwords, tokens, or PII
2. **Filter Errors**: Don't report expected errors (e.g., 404s for missing resources)
3. **Rate Limiting**: Implement rate limiting to avoid overwhelming your error service
4. **Error Grouping**: Use error IDs to group similar errors
5. **User Context**: Add user information (anonymized) to error reports
6. **Environment Tags**: Tag errors by environment (development, staging, production)

---

## Environment Variables

Add to `.env.example`:

```bash
# Error Monitoring
VITE_SENTRY_DSN=
# VITE_LOGROCKET_APP_ID=
# VITE_BUGSNAG_API_KEY=
# VITE_ROLLBAR_ACCESS_TOKEN=
```

---

## Additional Resources

- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/react/)
- [LogRocket Documentation](https://docs.logrocket.com/docs)
- [Bugsnag Documentation](https://docs.bugsnag.com/platforms/javascript/react/)
- [Rollbar Documentation](https://docs.rollbar.com/docs/javascript)
