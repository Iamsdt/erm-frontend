/**
 * HTTPS Enforcement Utility
 *
 * Enforces HTTPS in production environments.
 * Note: HTTPS should primarily be enforced server-side.
 * This is a client-side fallback check.
 */

/**
 * Enforces HTTPS by redirecting HTTP to HTTPS in production
 * Skips enforcement for localhost (development)
 */
export const enforceHTTPS = () => {
  // Only enforce in production
  if (!import.meta.env.PROD) {
    return
  }

  // Skip for localhost
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return
  }

  // Redirect HTTP to HTTPS
  if (window.location.protocol !== "https:") {
    const httpsUrl = `https:${window.location.href.substring(window.location.protocol.length)}`
    window.location.replace(httpsUrl)
  }
}

/**
 * Checks if the current connection is using HTTPS
 * @returns {boolean} True if using HTTPS or localhost
 */
export const isSecureConnection = () => {
  return (
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  )
}
