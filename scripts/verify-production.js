#!/usr/bin/env node

/**
 * Production Build Verification Script
 *
 * Verifies that the production build doesn't contain debug code
 * such as console statements or debugger keywords.
 *
 * Usage: node scripts/verify-production.js
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const distributionPath = join(process.cwd(), "dist")

if (!existsSync(distributionPath)) {
  console.error("❌ dist/ directory not found. Run 'npm run build' first.")
  process.exit(1)
}

let foundIssues = false

// Recursively check all JS files in dist
/**
 *
 */
const checkFiles = (dir) => {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      checkFiles(filePath)
    } else if (file.endsWith(".js") || file.endsWith(".html")) {
      try {
        const content = readFileSync(filePath, "utf-8")

        // Check for console statements (excluding console.error which might be intentional)
        if (
          content.includes("console.log") ||
          content.includes("console.debug") ||
          content.includes("console.info") ||
          content.includes("console.warn")
        ) {
          console.error(`❌ Found console statement in: ${filePath}`)
          foundIssues = true
        }

        // Check for debugger statements
        if (content.includes("debugger")) {
          console.error(`❌ Found debugger statement in: ${filePath}`)
          foundIssues = true
        }

        // Check for source maps in production (optional - comment out if you want source maps)
        if (file.endsWith(".js") && content.includes("sourceMappingURL")) {
          console.warn(`⚠️  Found source map reference in: ${filePath}`)
          // Uncomment the next line to fail on source maps
          // foundIssues = true
        }
      } catch (error) {
        console.warn(`⚠️  Could not read file ${filePath}: ${error.message}`)
      }
    }
  }
}

console.log("🔍 Verifying production build...")
checkFiles(distributionPath)

if (foundIssues) {
  console.error("\n❌ Production build verification failed!")
  console.error(
    "Please ensure esbuild.drop is configured correctly in vite.config.js"
  )
  process.exit(1)
} else {
  console.log("✅ Production build verified - no debug code found")
}
