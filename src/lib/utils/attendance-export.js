/* global Blob */

const NO_LOGS_WARNING = "No logs to export"

/**
 * Format clock in time from log.
 * @param {object} log - Log object.
 * @returns {string} Formatted time string.
 */
const formatClockIn = (log) =>
  log.clockIn ? new Date(log.clockIn).toLocaleString() : ""

/**
 * Format clock out time from log.
 * @param {object} log - Log object.
 * @returns {string} Formatted time string.
 */
const formatClockOut = (log) =>
  log.clockOut ? new Date(log.clockOut).toLocaleString() : ""

/**
 * Format flag info from log.
 * @param {object} log - Log object.
 * @returns {string} Flag status.
 */
const formatFlagInfo = (log) =>
  log.isFlagged ? `Yes: ${log.flagReason || ""}` : "No"

/**
 * Format manual entry info from log.
 * @param {object} log - Log object.
 * @returns {string} Manual entry status.
 */
const formatManualInfo = (log) =>
  log.isManualEntry ? `Yes: ${log.manualEntryReason || ""}` : "No"

/**
 * Convert a single log entry to CSV row.
 * @param {object} log - Attendance log object.
 * @returns {Array<string>} CSV row values.
 */
const logToCSVRow = (log) => [
  log.employeeName || "",
  log.department || "",
  log.date || "",
  formatClockIn(log),
  formatClockOut(log),
  log.durationMinutes || "",
  log.workSummary || "",
  log.status || "",
  formatFlagInfo(log),
  formatManualInfo(log),
]

/**
 * Escape and quote a CSV cell value.
 * @param {string} cell - Cell value.
 * @returns {string} Quoted and escaped value.
 */
const escapeCSVCell = (cell) => `"${String(cell).replace(/"/g, '""')}"`

/**
 * Trigger a browser download for a blob.
 * @param {Blob} blob - Data blob to download.
 * @param {string} filename - Target filename.
 */
const triggerDownload = (blob, filename) => {
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export attendance logs to CSV.
 * @param {Array} logs - Array of attendance log objects.
 * @param {string} filename - Optional filename (default: attendance-logs.csv).
 */
export const exportLogsToCSV = (logs, filename = "attendance-logs.csv") => {
  if (!logs || logs.length === 0) {
    console.warn(NO_LOGS_WARNING)
    return
  }

  // Define CSV headers
  const headers = [
    "Employee",
    "Department",
    "Date",
    "Clock In",
    "Clock Out",
    "Duration (minutes)",
    "Work Summary",
    "Status",
    "Flagged",
    "Manual Entry",
  ]

  // Convert logs to CSV rows
  const rows = logs.map(logToCSVRow)

  // Create CSV content
  const csvContent = [
    // Headers
    headers.map(escapeCSVCell).join(","),
    // Data rows
    ...rows.map((row) => row.map(escapeCSVCell).join(",")),
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  triggerDownload(blob, filename)
}

/**
 * Export attendance logs to JSON.
 * @param {Array} logs - Array of attendance log objects.
 * @param {string} filename - Optional filename (default: attendance-logs.json).
 */
export const exportLogsToJSON = (logs, filename = "attendance-logs.json") => {
  if (!logs || logs.length === 0) {
    console.warn(NO_LOGS_WARNING)
    return
  }

  const jsonContent = JSON.stringify(logs, null, 2)
  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8;",
  })
  triggerDownload(blob, filename)
}
