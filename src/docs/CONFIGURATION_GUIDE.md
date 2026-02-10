# Configuration & Environment Management Guide

## Overview

This guide covers the comprehensive configuration and environment management system implemented in the frontend base template. The system provides robust validation, type-safe configuration, and environment-specific settings.

## Table of Contents

1. [Environment Files](#environment-files)
2. [Configuration Validation](#configuration-validation)
3. [Using Configuration in Your Code](#using-configuration-in-your-code)
4. [Environment Variables Reference](#environment-variables-reference)
5. [Best Practices](#best-practices)

---

## Environment Files

### Available Files

The project includes three environment files:

1. **`.env.example`** - Template file with all available variables (committed to git)
2. **`.env.development`** - Development environment settings
3. **`.env.production`** - Production environment settings

### Getting Started

1. Copy `.env.example` to create your local environment file:

```bash
# For development
cp .env.example .env.development

# For production
cp .env.example .env.production
```

2. Update the values in your local `.env` files with your specific configuration.

3. **Important**: Never commit `.env.development` or `.env.production` to git. They are already in `.gitignore`.

---

## Configuration Validation

The configuration system (`src/lib/config.js`) provides automatic validation at application startup.

### Features

- **Type Validation**: Automatically converts strings to appropriate types (boolean, number)
- **Range Validation**: Validates numeric ranges (e.g., sample rates must be 0-1)
- **URL Validation**: Validates URL formats for API base URLs
- **Required Variables**: Enforces required variables (configurable per environment)
- **Default Values**: Provides sensible defaults for optional variables
- **Error Messages**: Clear, actionable error messages when validation fails

### Validation Rules

```javascript
// URL Validation
VITE_API_BASE_URL must be a valid URL

// Numeric Validation
VITE_API_TIMEOUT > 0
VITE_API_RETRY_ATTEMPTS >= 0
VITE_API_RETRY_DELAY >= 0

// Sample Rate Validation (0-1)
VITE_SENTRY_TRACES_SAMPLE_RATE: 0 <= value <= 1
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: 0 <= value <= 1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: 0 <= value <= 1
```

### Example Validation Error

```
Configuration validation failed:
- Invalid VITE_API_BASE_URL format: not-a-url
- VITE_API_TIMEOUT must be positive, got: -1000
- VITE_SENTRY_TRACES_SAMPLE_RATE must be between 0 and 1, got: 1.5
```

---

## Using Configuration in Your Code

### Import the Config Object

```javascript
import { config } from "@/lib/config"

// API Configuration
console.log(config.apiBaseUrl) // "https://api.example.com"
console.log(config.apiTimeout) // 100000
console.log(config.apiRetryAttempts) // 3

// Application Settings
console.log(config.appName) // "Frontend Base"
console.log(config.enableMocking) // true/false
console.log(config.isDevelopment) // true in dev mode
console.log(config.isProduction) // true in production

// Sentry Configuration
console.log(config.sentry.dsn) // Sentry DSN or null
console.log(config.sentry.environment) // "development" or "production"
console.log(config.sentry.tracesSampleRate) // 0.1

// Analytics
console.log(config.analytics.id) // Analytics ID or null
console.log(config.analytics.gaMeasurementId) // GA Measurement ID or null

// Feature Flags
console.log(config.features.enablePWA) // true/false
console.log(config.features.enablePerformanceMonitoring) // true/false
```

### Using Utility Functions

```javascript
import { getEnvVar, parseBoolean, parseNumber } from "@/lib/config"

// Get environment variable with default
const customVar = getEnvVar("VITE_CUSTOM_VAR", "default-value")

// Get required environment variable (throws if missing)
const requiredVar = getEnvVar("VITE_REQUIRED_VAR", null, true)

// Parse boolean
const isEnabled = parseBoolean(process.env.VITE_ENABLE_FEATURE, false)

// Parse number
const timeout = parseNumber(process.env.VITE_TIMEOUT, 5000)
```

### Example: Using in API Configuration

```javascript
// src/services/api/index.js
import { config } from "@/lib/config"
import axios from "axios"

const instance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
})
```

### Example: Using in Error Monitoring

```javascript
// src/lib/error-monitoring.js
import * as Sentry from "@sentry/react"
import { config } from "@/lib/config"

if (config.sentry.dsn && config.isProduction) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.sentry.environment,
    tracesSampleRate: config.sentry.tracesSampleRate,
    replaysSessionSampleRate: config.sentry.replaysSessionSampleRate,
    replaysOnErrorSampleRate: config.sentry.replaysOnErrorSampleRate,
  })
}
```

---

## Environment Variables Reference

### API Configuration

| Variable                    | Type   | Default                              | Description                     |
| --------------------------- | ------ | ------------------------------------ | ------------------------------- |
| `VITE_API_BASE_URL`         | string | `https://jsonplaceholder.typicode.com` | Base URL for API requests       |
| `VITE_API_TIMEOUT`          | number | `100000`                             | Request timeout in milliseconds |
| `VITE_API_RETRY_ATTEMPTS`   | number | `3`                                  | Number of retry attempts        |
| `VITE_API_RETRY_DELAY`      | number | `1000`                               | Delay between retries (ms)      |

### Application Settings

| Variable                | Type    | Default            | Description                       |
| ----------------------- | ------- | ------------------ | --------------------------------- |
| `VITE_APP_NAME`         | string  | `"Frontend Base"`  | Application name                  |
| `VITE_ENABLE_MOCKING`   | boolean | `true` (dev)       | Enable mock service worker        |

### Error Monitoring (Sentry)

| Variable                                   | Type   | Default        | Description                          |
| ------------------------------------------ | ------ | -------------- | ------------------------------------ |
| `VITE_SENTRY_DSN`                          | string | `null`         | Sentry Data Source Name              |
| `VITE_SENTRY_ENVIRONMENT`                  | string | `MODE`         | Environment name (dev/prod)          |
| `VITE_SENTRY_TRACES_SAMPLE_RATE`           | number | `0.1`          | Performance trace sampling (0-1)     |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE`  | number | `0.1`          | Session replay sampling (0-1)        |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | number | `1.0`          | Error replay sampling (0-1)          |

### Analytics

| Variable                    | Type   | Default | Description                 |
| --------------------------- | ------ | ------- | --------------------------- |
| `VITE_ANALYTICS_ID`         | string | `null`  | Analytics tracking ID       |
| `VITE_GA_MEASUREMENT_ID`    | string | `null`  | Google Analytics ID         |

### Feature Flags

| Variable                                | Type    | Default | Description                     |
| --------------------------------------- | ------- | ------- | ------------------------------- |
| `VITE_ENABLE_PWA`                       | boolean | `false` | Enable Progressive Web App      |
| `VITE_ENABLE_PERFORMANCE_MONITORING`    | boolean | `false` | Enable performance monitoring   |

---

## Best Practices

### 1. Never Commit Secrets

```bash
# ✅ GOOD - In .env.example (template)
VITE_SENTRY_DSN=

# ❌ BAD - Never commit actual secrets
VITE_SENTRY_DSN=https://actual-secret-key@sentry.io/project
```

### 2. Use Environment-Specific Files

```bash
# Development
.env.development - Development settings (mocking enabled)

# Production
.env.production - Production settings (mocking disabled, monitoring enabled)

# Local overrides (git-ignored)
.env.local - Local overrides (takes precedence)
```

### 3. Document New Variables

When adding new environment variables:

1. Add to `.env.example` with description
2. Add to all environment files (`.env.development`, `.env.production`)
3. Add to `src/lib/config.js` with validation
4. Update this documentation

### 4. Use the Config Object

```javascript
// ✅ GOOD - Use the config object
import { config } from "@/lib/config"
const url = config.apiBaseUrl

// ❌ BAD - Direct access (no validation)
const url = import.meta.env.VITE_API_BASE_URL
```

### 5. Set Appropriate Defaults

```javascript
// ✅ GOOD - Provide sensible defaults
const timeout = parseNumber(getEnvVar("VITE_API_TIMEOUT", "30000"), 30000)

// ❌ BAD - No default (may break)
const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT)
```

### 6. Validate Custom Variables

If you add custom environment variables, add validation:

```javascript
// src/lib/config.js
export const config = {
  // ... existing config
  
  // Custom configuration
  customFeature: {
    enabled: parseBoolean(getEnvVar("VITE_CUSTOM_FEATURE_ENABLED", "false"), false),
    apiKey: getEnvVar("VITE_CUSTOM_API_KEY", null),
  },
}

// Add validation
function validateConfig() {
  // ... existing validation
  
  // Custom validation
  if (config.customFeature.enabled && !config.customFeature.apiKey) {
    errors.push("VITE_CUSTOM_API_KEY is required when VITE_CUSTOM_FEATURE_ENABLED is true")
  }
}
```

### 7. Environment-Specific Required Variables

```javascript
// src/lib/config.js
const requiredEnvVars = []

if (import.meta.env.PROD) {
  // Production-only required variables
  requiredEnvVars.push("VITE_API_BASE_URL")
  requiredEnvVars.push("VITE_SENTRY_DSN")
}

// Validate
requiredEnvVars.forEach((varName) => {
  getEnvVar(varName, null, true) // Throws if missing
})
```

---

## Troubleshooting

### Configuration Validation Failed

**Error**: `Configuration validation failed: Invalid VITE_API_BASE_URL format`

**Solution**: Check that your API base URL is a valid URL:
```bash
# ✅ GOOD
VITE_API_BASE_URL=https://api.example.com

# ❌ BAD
VITE_API_BASE_URL=api.example.com
```

### Missing Required Environment Variable

**Error**: `Missing required environment variable: VITE_API_BASE_URL`

**Solution**: 
1. Check that you have a `.env.development` or `.env.production` file
2. Ensure the variable is defined in the file
3. Restart the dev server after changing environment files

### Environment Variables Not Loading

**Solution**:
1. Ensure variable names start with `VITE_` (required by Vite)
2. Restart the dev server (environment variables are loaded at build time)
3. Check that the file is in the project root
4. Verify file naming (`.env.development`, not `.env.dev`)

---

## Migration Guide

### Migrating from Hardcoded Configuration

**Before:**
```javascript
// Hardcoded values
const API_BASE_URL = "https://api.example.com"
const TIMEOUT = 30000
```

**After:**
```javascript
// Use environment variables
import { config } from "@/lib/config"

const apiBaseUrl = config.apiBaseUrl
const timeout = config.apiTimeout
```

### Adding to Existing Project

1. Copy environment files:
   ```bash
   cp .env.example .env.development
   cp .env.example .env.production
   ```

2. Update `.gitignore`:
   ```
   # Environment variables
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

3. Import and use config:
   ```javascript
   import { config } from "@/lib/config"
   ```

---

## See Also

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Error Monitoring Setup Guide](./ERROR_MONITORING_SETUP.md)
- [API Documentation](./API_GUIDE.md)
