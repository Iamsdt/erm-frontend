/* eslint-disable react/no-danger, jsdoc/check-indentation */

/**
 * HTML Sanitization Utility
 *
 * Provides safe HTML sanitization using DOMPurify to prevent XSS attacks
 * when rendering user-generated content.
 *
 * Usage:
 *   import { sanitizeHtml } from '@/lib/utils/sanitize'
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
 *
 * Installation:
 *   npm install dompurify
 */

import PropTypes from "prop-types"
import { useState, useEffect } from "react"

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} dirty - The potentially unsafe HTML string
 * @param {object} options - DOMPurify configuration options
 * @returns {string} - Sanitized HTML string safe to render
 */
export const sanitizeHtml = async (dirty, options = {}) => {
  // Check if DOMPurify is available
  if (typeof window === "undefined") {
    // Server-side rendering - return empty string or original
    return dirty || ""
  }

  try {
    // Dynamic import for DOMPurify
    // Note: DOMPurify must be installed: npm install dompurify

    const { default: DOMPurify } = await import("dompurify")

    // Default configuration - strict by default
    const defaultOptions = {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "a",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "code",
        "pre",
      ],
      ALLOWED_ATTR: ["href", "title", "target", "rel"],
      ALLOW_DATA_ATTR: false,
      ...options,
    }

    return DOMPurify.sanitize(dirty, defaultOptions)
  } catch {
    console.error(
      "DOMPurify not available. Install it with: npm install dompurify"
    )
    // Fallback: strip all HTML tags if DOMPurify is not available
    return dirty?.replace(/<[^>]*>/g, "") || ""
  }
}

/**
 * Sanitizes a plain text string (strips all HTML)
 * Use this when you only need plain text, not HTML
 * @param {string} text - Text that might contain HTML
 * @returns {string} - Plain text with HTML stripped
 */
export const sanitizeText = (text) => {
  if (!text) return ""

  // Create a temporary element to decode HTML entities and strip tags
  if (typeof document !== "undefined") {
    const temporary = document.createElement("div")
    temporary.textContent = text
    return temporary.textContent || temporary.innerText || ""
  }

  // Fallback for server-side
  return text.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, "")
}

/**
 * React component wrapper for safe HTML rendering
 * Usage: <SanitizedHtml html={userContent} />
 */
export const SanitizedHtml = ({ html, className, ...properties }) => {
  const [sanitized, setSanitized] = useState("")

  useEffect(() => {
    const loadSanitized = async () => {
      const result = await sanitizeHtml(html)
      setSanitized(result)
    }
    loadSanitized()
  }, [html])

  // eslint-disable react/no-danger
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...properties}
    />
  )
}

SanitizedHtml.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string,
}

SanitizedHtml.defaultProps = {
  className: undefined,
}
