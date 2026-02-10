/**
 * Application configuration module
 * Validates required environment variables and exports configuration
 */

// Default values for optional environment variables
const defaults = {
  VITE_API_BASE_URL: "https://api.example.com",
  VITE_APP_NAME: "Frontend Base",
  VITE_ENABLE_MOCKING: "true",
  VITE_API_TIMEOUT: "100000",
  VITE_API_RETRY_ATTEMPTS: "3",
  VITE_API_RETRY_DELAY: "1000",
  VITE_SENTRY_TRACES_SAMPLE_RATE: "0.1",
  VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: "0.1",
  VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: "1.0",
}

/**
 * Get environment variable with validation and default value
 * @param {string} key - Environment variable key
 * @param {string|null} defaultValue - Default value if not set
 * @param {boolean} required - Whether the variable is required
 * @returns {string|null}
 */
const getEnvironmentVariable = (key, defaultValue = null, required = false) => {
  const value = import.meta.env[key]

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Please check your .env file and ensure ${key} is set.`
    )
  }

  return value || defaultValue
}

/**
 * Parse boolean environment variable
 * @param {string|null} value - Environment variable value
 * @param {boolean} defaultValue - Default boolean value
 * @returns {boolean}
 */
const parseBoolean = (value, defaultValue = false) => {
  if (value === null || value === undefined) return defaultValue
  return value === "true" || value === "1" || value === true
}

/**
 * Parse number environment variable
 * @param {string|null} value - Environment variable value
 * @param {number} defaultValue - Default number value
 * @returns {number}
 */
const parseNumber = (value, defaultValue) => {
  if (value === null || value === undefined) return defaultValue
  const parsed = Number(value)
  return isNaN(parsed) ? defaultValue : parsed
}

// Validate required environment variables (none required by default in development)
// In production, you may want to require VITE_API_BASE_URL
const requiredEnvironmentVariables = []

if (import.meta.env.PROD) {
  // Add production-only required variables if needed
  // Example: requiredEnvVars.push('VITE_API_BASE_URL')
}

requiredEnvironmentVariables.forEach((variableName) => {
  getEnvironmentVariable(variableName, null, true)
})

// Export configuration with defaults and validation
export const config = {
  // API Configuration
  apiBaseUrl: getEnvironmentVariable(
    "VITE_API_BASE_URL",
    defaults.VITE_API_BASE_URL
  ),
  apiTimeout: parseNumber(
    getEnvironmentVariable("VITE_API_TIMEOUT", defaults.VITE_API_TIMEOUT),
    100000
  ),
  apiRetryAttempts: parseNumber(
    getEnvironmentVariable(
      "VITE_API_RETRY_ATTEMPTS",
      defaults.VITE_API_RETRY_ATTEMPTS
    ),
    3
  ),
  apiRetryDelay: parseNumber(
    getEnvironmentVariable(
      "VITE_API_RETRY_DELAY",
      defaults.VITE_API_RETRY_DELAY
    ),
    1000
  ),

  // Application Configuration
  appName: getEnvironmentVariable("VITE_APP_NAME", defaults.VITE_APP_NAME),
  enableMocking: parseBoolean(
    getEnvironmentVariable("VITE_ENABLE_MOCKING", defaults.VITE_ENABLE_MOCKING),
    true
  ),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  // Error Monitoring (Sentry)
  sentry: {
    dsn: getEnvironmentVariable("VITE_SENTRY_DSN", null),
    environment: getEnvironmentVariable(
      "VITE_SENTRY_ENVIRONMENT",
      import.meta.env.MODE
    ),
    tracesSampleRate: parseNumber(
      getEnvironmentVariable(
        "VITE_SENTRY_TRACES_SAMPLE_RATE",
        defaults.VITE_SENTRY_TRACES_SAMPLE_RATE
      ),
      0.1
    ),
    replaysSessionSampleRate: parseNumber(
      getEnvironmentVariable(
        "VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE",
        defaults.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
      ),
      0.1
    ),
    replaysOnErrorSampleRate: parseNumber(
      getEnvironmentVariable(
        "VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE",
        defaults.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE
      ),
      1.0
    ),
  },

  // Analytics
  analytics: {
    id: getEnvironmentVariable("VITE_ANALYTICS_ID", null),
    gaMeasurementId: getEnvironmentVariable("VITE_GA_MEASUREMENT_ID", null),
  },

  // Feature Flags
  features: {
    enablePWA: parseBoolean(
      getEnvironmentVariable("VITE_ENABLE_PWA", "false"),
      false
    ),
    enablePerformanceMonitoring: parseBoolean(
      getEnvironmentVariable("VITE_ENABLE_PERFORMANCE_MONITORING", "false"),
      false
    ),
  },
}

// Validate configuration
/**
 *
 */
// eslint-disable-next-line complexity
const validateConfig = () => {
  const errors = []

  // Validate API base URL format
  if (config.apiBaseUrl) {
    try {
      new URL(config.apiBaseUrl)
    } catch {
      errors.push(`Invalid VITE_API_BASE_URL format: ${config.apiBaseUrl}`)
    }
  }

  // Validate numeric ranges
  if (config.apiTimeout <= 0) {
    errors.push(`VITE_API_TIMEOUT must be positive, got: ${config.apiTimeout}`)
  }

  if (config.apiRetryAttempts < 0) {
    errors.push(
      `VITE_API_RETRY_ATTEMPTS must be non-negative, got: ${config.apiRetryAttempts}`
    )
  }

  if (config.apiRetryDelay < 0) {
    errors.push(
      `VITE_API_RETRY_DELAY must be non-negative, got: ${config.apiRetryDelay}`
    )
  }

  // Validate Sentry sample rates (0-1)
  if (
    config.sentry.tracesSampleRate < 0 ||
    config.sentry.tracesSampleRate > 1
  ) {
    errors.push(
      `VITE_SENTRY_TRACES_SAMPLE_RATE must be between 0 and 1, got: ${config.sentry.tracesSampleRate}`
    )
  }

  if (
    config.sentry.replaysSessionSampleRate < 0 ||
    config.sentry.replaysSessionSampleRate > 1
  ) {
    errors.push(
      `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE must be between 0 and 1, got: ${config.sentry.replaysSessionSampleRate}`
    )
  }

  if (
    config.sentry.replaysOnErrorSampleRate < 0 ||
    config.sentry.replaysOnErrorSampleRate > 1
  ) {
    errors.push(
      `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE must be between 0 and 1, got: ${config.sentry.replaysOnErrorSampleRate}`
    )
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join("\n")}`)
  }
}

// Run validation
validateConfig()

// Log configuration in development
if (config.isDevelopment) {
  console.warn("🔧 App Configuration:", {
    apiBaseUrl: config.apiBaseUrl,
    appName: config.appName,
    enableMocking: config.enableMocking,
    mode: config.mode,
    sentry: config.sentry.dsn ? "Enabled" : "Disabled",
    analytics: config.analytics.id ? "Enabled" : "Disabled",
  })
}

// Export utility functions for external use
export { getEnvironmentVariable as getEnvVar, parseBoolean, parseNumber }
