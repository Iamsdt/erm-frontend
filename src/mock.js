/**
 * Enables API request mocking based on environment configuration.
 *
 * Dynamically imports the mock service worker and starts it to intercept network requests.
 * Only enabled when:
 * - VITE_ENABLE_MOCKING is true
 * - Running in development mode
 * @async
 * @function enableMocking
 * @returns {Promise<void>|undefined} A promise that resolves when the mock worker is started, or undefined if disabled.
 */
export const enableMocking = async () => {
  // Check if mocking is explicitly disabled or in production
  const enableMocking = import.meta.env.VITE_ENABLE_MOCKING === "true"
  const isProduction = import.meta.env.PROD

  // Don't enable mocking in production or when explicitly disabled
  if (!enableMocking) {
    if (isProduction) {
      console.warn("Mocking disabled in production")
    } else {
      console.warn("Mocking disabled (VITE_ENABLE_MOCKING=false)")
    }
    return
  }

  console.warn("Initializing Mock Service Worker...")

  const { worker } = await import("./services/mock")

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  // eslint-disable-next-line consistent-return
  return worker
    .start({
      onUnhandledRequest: "bypass", // Bypass non-API requests instead of warning
      serviceWorker: {
        url: "/mockServiceWorker.js",
        options: {
          // Only intercept requests to the API base URL
          scope: "/",
        },
      },
      // Ignore requests to local resources
      quiet: false,
    })
    .catch((error) => {
      console.error("MSW initialization error, but continuing with app:", error)
    })
}
