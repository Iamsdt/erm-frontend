/**
 * Helper utilities for web application testing with Playwright
 */

/**
 * Wait for a condition to be true with timeout
 * @param {Function} condition - Function that returns boolean
 * @param {number} timeout - Timeout in milliseconds
 * @param {number} interval - Check interval in milliseconds
 */
const waitForCondition = async (condition, timeout = 5000, interval = 100) => {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
  throw new Error("Condition not met within timeout")
}

/**
 * Capture browser console logs
 * @param {Page} page - Playwright page object
 * @returns {Array} Array of console messages
 */
const captureConsoleLogs = (page) => {
  const logs = []
  page.on("console", (message) => {
    logs.push({
      type: message.type(),
      text: message.text(),
      timestamp: new Date().toISOString(),
    })
  })
  return logs
}

/**
 * Take screenshot with automatic naming
 * @param {Page} page - Playwright page object
 * @param {string} name - Base name for screenshot
 */
const captureScreenshot = async (page, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `${name}-${timestamp}.png`
  await page.screenshot({ path: filename, fullPage: true })
  console.log(`Screenshot saved: ${filename}`)
  return filename
}

module.exports = {
  waitForCondition,
  captureConsoleLogs,
  captureScreenshot,
}
