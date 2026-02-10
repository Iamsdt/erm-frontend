/**
 * Enables API request mocking based on environment configuration.
 *
 * Dynamically imports the mock service worker and starts it to intercept network requests.
 * Only enabled when:
 * - VITE_ENABLE_MOCKING is true
 * - Running in development mode
 *
 * @async
 * @function enableMocking
 * @returns {Promise<void>|undefined} A promise that resolves when the mock worker is started, or undefined if disabled.
 */
export const enableMocking = async () => {
  // Check if mocking is explicitly disabled or in production
  const enableMocking = import.meta.env.VITE_ENABLE_MOCKING === "true"
  const isProduction = import.meta.env.PROD

  // Don't enable mocking in production or when explicitly disabled
  if (isProduction || !enableMocking) {
    if (isProduction) {
      console.log("Mocking disabled in production")
    } else {
      console.log("Mocking disabled (VITE_ENABLE_MOCKING=false)")
    }
    return
  }

  console.log("Initializing Mock Service Worker...")

  const { worker } = await import("./services/mock")

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  // eslint-disable-next-line consistent-return
  return worker.start({
    onUnhandledRequest: "warn", // Warn about unhandled requests
  })
}
