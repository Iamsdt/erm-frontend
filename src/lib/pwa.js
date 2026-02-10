/**
 * PWA (Progressive Web App) Utilities
 * 
 * Handles:
 * - Service Worker registration
 * - Install prompt
 * - Update notifications
 * - Offline detection
 */

import { config } from "./config"

let deferredPrompt = null
let serviceWorkerRegistration = null

/**
 * Register service worker
 * @returns {Promise<ServiceWorkerRegistration|null>}
 */
export async function registerServiceWorker() {
  if (!config.features.enablePWA) {
    console.log("PWA is disabled in configuration")
    return null
  }

  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker is not supported in this browser")
    return null
  }

  try {
    console.log("Registering Service Worker...")

    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })

    serviceWorkerRegistration = registration

    console.log("Service Worker registered successfully")

    // Check for updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker available
            console.log("New Service Worker available")

            // Notify user about update
            notifyUserAboutUpdate()
          }
        })
      }
    })

    // Check for updates every hour
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000)

    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.unregister()
      console.log("Service Worker unregistered")
    }
  } catch (error) {
    console.error("Service Worker unregistration failed:", error)
  }
}

/**
 * Notify user about service worker update
 */
function notifyUserAboutUpdate() {
  // You can show a toast/notification here
  // Example using custom event:
  const event = new CustomEvent("sw-update-available", {
    detail: { registration: serviceWorkerRegistration },
  })
  window.dispatchEvent(event)

  // Or show browser notification (if permitted)
  if (Notification.permission === "granted") {
    new Notification("Update Available", {
      body: "A new version is available. Click to reload.",
      icon: "/icons/icon-192x192.png",
      tag: "app-update",
    })
  }
}

/**
 * Update service worker immediately
 */
export function updateServiceWorker() {
  if (!serviceWorkerRegistration) {
    console.warn("No service worker registration found")
    return
  }

  const worker = serviceWorkerRegistration.waiting

  if (worker) {
    worker.postMessage({ type: "SKIP_WAITING" })

    // Reload page when new service worker takes control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload()
    })
  }
}

/**
 * Clear all service worker caches
 */
export async function clearServiceWorkerCache() {
  if (!serviceWorkerRegistration) {
    return
  }

  try {
    serviceWorkerRegistration.active?.postMessage({ type: "CLEAR_CACHE" })
    console.log("Service Worker cache cleared")
  } catch (error) {
    console.error("Failed to clear Service Worker cache:", error)
  }
}

/**
 * Capture install prompt
 */
export function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()

    // Stash the event so it can be triggered later
    deferredPrompt = e

    console.log("Install prompt available")

    // Dispatch custom event so UI can show install button
    window.dispatchEvent(new Event("pwa-installable"))
  })

  // Log install
  window.addEventListener("appinstalled", () => {
    console.log("PWA installed successfully")
    deferredPrompt = null

    // Track installation (optional)
    // analytics.track('pwa_installed')
  })
}

/**
 * Show install prompt
 * @returns {Promise<{outcome: string}>}
 */
export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.log("Install prompt not available")
    return { outcome: "unavailable" }
  }

  try {
    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice

    console.log(`User response to install prompt: ${outcome}`)

    // Clear the deferred prompt
    deferredPrompt = null

    return { outcome }
  } catch (error) {
    console.error("Error showing install prompt:", error)
    return { outcome: "error" }
  }
}

/**
 * Check if app is installed
 * @returns {boolean}
 */
export function isAppInstalled() {
  // Check if running as PWA
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  )
}

/**
 * Check if install prompt is available
 * @returns {boolean}
 */
export function isInstallPromptAvailable() {
  return deferredPrompt !== null
}

/**
 * Setup offline/online detection
 */
export function setupNetworkDetection() {
  // Initial status
  updateOnlineStatus()

  // Listen for status changes
  window.addEventListener("online", () => {
    console.log("Network: Online")
    updateOnlineStatus()

    // Dispatch custom event
    window.dispatchEvent(new Event("app-online"))
  })

  window.addEventListener("offline", () => {
    console.log("Network: Offline")
    updateOnlineStatus()

    // Dispatch custom event
    window.dispatchEvent(new Event("app-offline"))
  })
}

/**
 * Update online status indicator
 */
function updateOnlineStatus() {
  const isOnline = navigator.onLine

  // You can update UI here
  document.body.classList.toggle("is-offline", !isOnline)
  document.body.classList.toggle("is-online", isOnline)
}

/**
 * Request notification permission
 * @returns {Promise<NotificationPermission>}
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Notifications not supported")
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    console.log("Notification permission:", permission)
    return permission
  }

  return Notification.permission
}

/**
 * Subscribe to push notifications
 * @param {string} vapidPublicKey - VAPID public key
 * @returns {Promise<PushSubscription|null>}
 */
export async function subscribeToPushNotifications(vapidPublicKey) {
  if (!serviceWorkerRegistration) {
    console.error("Service Worker not registered")
    return null
  }

  try {
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })

    console.log("Push subscription successful")

    // Send subscription to your server
    // await fetch('/api/push-subscribe', {
    //   method: 'POST',
    //   body: JSON.stringify(subscription),
    //   headers: { 'Content-Type': 'application/json' }
    // })

    return subscription
  } catch (error) {
    console.error("Push subscription failed:", error)
    return null
  }
}

/**
 * Convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

/**
 * Initialize PWA features
 */
export function initializePWA() {
  if (!config.features.enablePWA) {
    console.log("PWA features are disabled")
    return
  }

  console.log("Initializing PWA features...")

  // Register service worker
  registerServiceWorker()

  // Setup install prompt
  setupInstallPrompt()

  // Setup network detection
  setupNetworkDetection()

  console.log("PWA initialized")
}
