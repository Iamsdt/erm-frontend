/**
 * DateTime Utilities (Native JavaScript)
 *
 * Provides date/time functionality without external dependencies.
 * Zero bundle size impact, uses native browser APIs.
 *
 * For more complex use cases, consider date-fns or Day.js.
 * See: src/docs/DEPENDENCY_OPTIMIZATION_GUIDE.md
 */

/**
 * Get user's timezone
 * @returns {string} IANA timezone identifier (e.g., "America/New_York")
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Format date with timezone
 * @param {Date|string|number} date - Date to format
 * @param {string} timezone - IANA timezone (optional, defaults to user's timezone)
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string} Formatted date string
 *
 * @example
 * formatDateWithTimezone(new Date(), 'America/New_York', {
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 *   hour: '2-digit',
 *   minute: '2-digit'
 * })
 * // "January 11, 2026 at 03:30 PM"
 */
export function formatDateWithTimezone(
  date,
  timezone = getUserTimezone(),
  options = {}
) {
  const d = date instanceof Date ? date : new Date(date)

  const defaultOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }

  return new Intl.DateTimeFormat("en-US", {
    ...defaultOptions,
    ...options,
  }).format(d)
}

/**
 * Format date (simple, no timezone)
 * @param {Date|string|number} date - Date to format
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date)

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  }).format(d)
}

/**
 * Convert date to specific timezone
 * @param {Date|string} date - Date to convert
 * @param {string} timezone - Target timezone
 * @returns {Date} Date object representing the time in target timezone
 */
export function toTimezone(date, timezone) {
  const d = date instanceof Date ? date : new Date(date)
  const tzString = d.toLocaleString("en-US", { timeZone: timezone })
  return new Date(tzString)
}

/**
 * Get timezone offset in minutes
 * @param {string} timezone - IANA timezone
 * @param {Date} date - Reference date (optional, defaults to now)
 * @returns {number} Offset in minutes from UTC
 */
export function getTimezoneOffset(timezone, date = new Date()) {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }))

  return (tzDate.getTime() - utcDate.getTime()) / 60000
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - Date to compare
 * @param {Date} baseDate - Base date to compare against (optional, defaults to now)
 * @returns {string} Relative time string
 *
 * @example
 * getRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * getRelativeTime(new Date(Date.now() + 86400000)) // "in 1 day"
 */
export function getRelativeTime(date, baseDate = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const diffMs = d.getTime() - baseDate.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  const isPast = diffMs < 0
  const prefix = isPast ? "" : "in "
  const suffix = isPast ? " ago" : ""

  const abs = Math.abs

  if (abs(diffYear) > 0) {
    return `${prefix}${abs(diffYear)} year${abs(diffYear) > 1 ? "s" : ""}${suffix}`
  }
  if (abs(diffMonth) > 0) {
    return `${prefix}${abs(diffMonth)} month${abs(diffMonth) > 1 ? "s" : ""}${suffix}`
  }
  if (abs(diffDay) > 0) {
    return `${prefix}${abs(diffDay)} day${abs(diffDay) > 1 ? "s" : ""}${suffix}`
  }
  if (abs(diffHour) > 0) {
    return `${prefix}${abs(diffHour)} hour${abs(diffHour) > 1 ? "s" : ""}${suffix}`
  }
  if (abs(diffMin) > 0) {
    return `${prefix}${abs(diffMin)} minute${abs(diffMin) > 1 ? "s" : ""}${suffix}`
  }
  if (abs(diffSec) > 10) {
    return `${prefix}${abs(diffSec)} seconds${suffix}`
  }

  return "just now"
}

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const d = date instanceof Date ? date : new Date(date)
  const today = new Date()

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export function isYesterday(date) {
  const d = date instanceof Date ? date : new Date(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  )
}

/**
 * Format time (hours:minutes)
 * @param {Date|string} date - Date to format
 * @param {boolean} use24Hour - Use 24-hour format (default: false)
 * @returns {string} Formatted time string
 *
 * @example
 * formatTime(new Date(), false) // "03:30 PM"
 * formatTime(new Date(), true)  // "15:30"
 */
export function formatTime(date, use24Hour = false) {
  const d = date instanceof Date ? date : new Date(date)

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour,
  }).format(d)
}

/**
 * Get start of day
 * @param {Date} date - Date
 * @returns {Date} Start of day (00:00:00.000)
 */
export function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day
 * @param {Date} date - Date
 * @returns {Date} End of day (23:59:59.999)
 */
export function endOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Add days to date
 * @param {Date} date - Date
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date} New date
 */
export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Add months to date
 * @param {Date} date - Date
 * @param {number} months - Number of months to add (can be negative)
 * @returns {Date} New date
 */
export function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

/**
 * Get ISO string (UTC)
 * @param {Date} date - Date
 * @returns {string} ISO string
 */
export function toISOString(date = new Date()) {
  return date.toISOString()
}

/**
 * Parse ISO string
 * @param {string} isoString - ISO date string
 * @returns {Date} Date object
 */
export function fromISOString(isoString) {
  return new Date(isoString)
}

// Export default timezone getter for convenience
export const userTimezone = getUserTimezone()
