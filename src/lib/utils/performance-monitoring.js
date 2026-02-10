/**
 * Performance Monitoring Utilities
 *
 * Tracks Web Vitals and custom performance metrics:
 * - LCP (Largest Contentful Paint)
 * - INP (Interaction to Next Paint) - replaces FID
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 *
 * Note: FID (First Input Delay) is deprecated in web-vitals v4+
 * Use INP (Interaction to Next Paint) instead
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals"

import { config } from "../config"

// Store metrics for later analysis
const metrics = []

const PERFORMANCE_MONITORING_DISABLED = "Performance monitoring is disabled"

/**
 * Report metric to console and/or analytics service
 * @param {object} metric - Web Vital metric object
 */
const reportMetric = (metric) => {
  const { name, value, rating, delta } = metric

  // Log in development
  if (config.isDevelopment) {
    console.warn(`[Performance] ${name}:`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
    })
  }

  // Store metric
  metrics.push({
    name,
    value,
    rating,
    delta,
    timestamp: Date.now(),
  })

  // Send to analytics service
  sendToAnalytics(metric)

  // Send to error monitoring service (Sentry)
  if (config.sentry.dsn && config.isProduction) {
    try {
      // If using Sentry
      // import * as Sentry from '@sentry/react'
      // Sentry.addBreadcrumb({
      //   category: 'web-vitals',
      //   message: `${name}: ${value}`,
      //   level: rating === 'good' ? 'info' : rating === 'needs-improvement' ? 'warning' : 'error',
      //   data: metric
      // })
    } catch (error) {
      console.error("Failed to send metric to Sentry:", error)
    }
  }
}

/**
 * Send metric to analytics service
 * @param {object} metric - Web Vital metric object
 */
const sendToAnalytics = (metric) => {
  const { name, value, rating, id } = metric

  // Google Analytics 4
  if (config.analytics.gaMeasurementId && typeof window.gtag === "function") {
    window.gtag("event", name, {
      value: Math.round(value),
      metric_id: id,
      metric_value: value,
      metric_rating: rating,
      metric_delta: metric.delta,
    })
  }

  // Custom analytics endpoint
  if (config.features.enablePerformanceMonitoring && config.isProduction) {
    try {
      // Send to your backend
      // navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify({
      //   name,
      //   value,
      //   rating,
      //   id,
      //   url: window.location.href,
      //   timestamp: Date.now()
      // }))
    } catch (error) {
      console.error("Failed to send metric to analytics:", error)
    }
  }
}

/**
 * Initialize Web Vitals tracking
 */
export const initWebVitals = () => {
  if (!config.features.enablePerformanceMonitoring) {
    console.warn(PERFORMANCE_MONITORING_DISABLED)
    return
  }

  try {
    // Track Core Web Vitals
    onLCP(reportMetric) // Largest Contentful Paint
    onINP(reportMetric) // Interaction to Next Paint (replaces FID)
    onCLS(reportMetric) // Cumulative Layout Shift
    onFCP(reportMetric) // First Contentful Paint
    onTTFB(reportMetric) // Time to First Byte

    console.warn("Web Vitals tracking initialized")
  } catch (error) {
    console.error("Failed to initialize Web Vitals:", error)
  }
}

/**
 * Get all recorded metrics
 * @returns {Array} Array of metric objects
 */
export const getMetrics = () => [...metrics]

/**
 * Get metrics summary
 * @returns {object} Summary of metrics by name
 */
export const getMetricsSummary = () => {
  const summary = {}

  metrics.forEach((metric) => {
    if (!summary[metric.name]) {
      summary[metric.name] = {
        count: 0,
        total: 0,
        min: Infinity,
        max: -Infinity,
        ratings: { good: 0, "needs-improvement": 0, poor: 0 },
      }
    }

    const s = summary[metric.name]
    s.count++
    s.total += metric.value
    s.min = Math.min(s.min, metric.value)
    s.max = Math.max(s.max, metric.value)
    s.ratings[metric.rating]++
  })

  // Calculate averages
  Object.keys(summary).forEach((name) => {
    summary[name].average = summary[name].total / summary[name].count
  })

  return summary
}

/**
 * Clear stored metrics
 */
export const clearMetrics = () => {
  metrics.length = 0
}

/**
 * Track custom performance metric
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {object} data - Additional data
 */
export const trackCustomMetric = (name, value, data = {}) => {
  const metric = {
    name,
    value,
    data,
    timestamp: Date.now(),
  }

  if (config.isDevelopment) {
    console.warn(`[Custom Metric] ${name}:`, value, data)
  }

  metrics.push(metric)
  sendToAnalytics(metric)
}

/**
 * Track page load time
 */
export const trackPageLoadTime = () => {
  if (typeof window.performance === "undefined") {
    return
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const connectTime = perfData.responseEnd - perfData.requestStart
      const renderTime = perfData.domComplete - perfData.domLoading

      trackCustomMetric("page_load_time", pageLoadTime, {
        connectTime,
        renderTime,
      })

      if (config.isDevelopment) {
        console.warn("Page Load Metrics:", {
          pageLoadTime: `${pageLoadTime}ms`,
          connectTime: `${connectTime}ms`,
          renderTime: `${renderTime}ms`,
        })
      }
    }, 0)
  })
}

/**
 * Track resource loading performance
 */
export const trackResourcePerformance = () => {
  if (typeof window.performance === "undefined") {
    return
  }

  window.addEventListener("load", () => {
    const resources = window.performance.getEntriesByType("resource")

    const summary = {
      total: resources.length,
      totalSize: 0,
      totalDuration: 0,
      byType: {},
    }

    resources.forEach((resource) => {
      const type = resource.initiatorType || "other"
      const { duration } = resource
      const size = resource.transferSize || 0

      if (!summary.byType[type]) {
        summary.byType[type] = {
          count: 0,
          totalDuration: 0,
          totalSize: 0,
        }
      }

      summary.byType[type].count++
      summary.byType[type].totalDuration += duration
      summary.byType[type].totalSize += size
      summary.totalSize += size
      summary.totalDuration += duration
    })

    if (config.isDevelopment) {
      console.warn("Resource Performance:", summary)
    }

    trackCustomMetric("resource_performance", summary.totalDuration, summary)
  })
}

/**
 * Track navigation timing
 */
export const trackNavigationTiming = () => {
  if (typeof window.performance === "undefined") {
    return
  }

  window.addEventListener("load", () => {
    const [nav] = window.performance.getEntriesByType("navigation")

    if (nav) {
      const timing = {
        dns: nav.domainLookupEnd - nav.domainLookupStart,
        tcp: nav.connectEnd - nav.connectStart,
        request: nav.responseStart - nav.requestStart,
        response: nav.responseEnd - nav.responseStart,
        domProcessing: nav.domComplete - nav.domInteractive,
        domContentLoaded:
          nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        load: nav.loadEventEnd - nav.loadEventStart,
      }

      if (config.isDevelopment) {
        console.warn("Navigation Timing:", timing)
      }

      trackCustomMetric("navigation_timing", nav.duration, timing)
    }
  })
}

/**
 * Create performance observer for long tasks
 */
/* eslint-disable consistent-return */
/**
 *
 */
export const observeLongTasks = () => {
  if (!window.PerformanceObserver) {
    return
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          // Long task threshold
          if (config.isDevelopment) {
            console.warn("Long Task detected:", {
              duration: `${entry.duration.toFixed(2)}ms`,
              startTime: `${entry.startTime.toFixed(2)}ms`,
              name: entry.name,
            })
          }

          trackCustomMetric("long_task", entry.duration, {
            name: entry.name,
            startTime: entry.startTime,
          })
        }
      }
    })

    observer.observe({ entryTypes: ["longtask"] })

    return observer
  } catch (error) {
    console.error("Failed to observe long tasks:", error)
    return null
  }
}
/* eslint-enable consistent-return */

/**
 * Create performance observer for layout shifts
 */
/* eslint-disable consistent-return */
/**
 *
 */
export const observeLayoutShifts = () => {
  if (!window.PerformanceObserver) {
    return
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) {
          // Ignore shifts after user input
          continue
        }

        if (config.isDevelopment && entry.value > 0.1) {
          console.warn("Layout Shift detected:", {
            value: entry.value,
            sources: entry.sources,
          })
        }
      }
    })

    observer.observe({ type: "layout-shift", buffered: true })

    return observer
  } catch (error) {
    console.error("Failed to observe layout shifts:", error)
    return null
  }
}
/* eslint-enable consistent-return */

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @param {() => Promise<unknown>} callback - Function to measure
 * @returns {unknown} Result of callback
 */
export const measureRenderTime = async (componentName, callback) => {
  const startTime = performance.now()

  try {
    const result = await callback()
    const endTime = performance.now()
    const duration = endTime - startTime

    trackCustomMetric(`component_render:${componentName}`, duration)

    if (config.isDevelopment) {
      console.warn(`[Render Time] ${componentName}: ${duration.toFixed(2)}ms`)
    }

    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime

    trackCustomMetric(`component_render_error:${componentName}`, duration)

    throw error
  }
}

/**
 * Initialize all performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (!config.features.enablePerformanceMonitoring) {
    console.warn(PERFORMANCE_MONITORING_DISABLED)
    return
  }

  console.warn("Initializing performance monitoring...")

  // Initialize Web Vitals
  initWebVitals()

  // Track page load
  trackPageLoadTime()

  // Track resources
  trackResourcePerformance()

  // Track navigation
  trackNavigationTiming()

  // Observe long tasks
  observeLongTasks()

  // Observe layout shifts
  observeLayoutShifts()

  console.warn("Performance monitoring initialized")
}

/**
 * Get performance budget status
 * @returns {object} Budget status for each metric
 */
export const getPerformanceBudgetStatus = () => {
  const budgets = {
    LCP: { threshold: 2500, good: 2500, poor: 4000 },
    INP: { threshold: 200, good: 200, poor: 500 },
    CLS: { threshold: 0.1, good: 0.1, poor: 0.25 },
    FCP: { threshold: 1800, good: 1800, poor: 3000 },
    TTFB: { threshold: 800, good: 800, poor: 1800 },
  }

  const summary = getMetricsSummary()
  const status = {}

  Object.keys(budgets).forEach((metric) => {
    const metricSummary = summary[metric]
    const budget = budgets[metric]

    if (metricSummary) {
      status[metric] = {
        value: metricSummary.average,
        budget: budget.threshold,
        status:
          metricSummary.average <= budget.threshold ? "passing" : "failing",
        rating:
          metricSummary.average <= budget.good
            ? "good"
            : metricSummary.average <= budget.poor
              ? "needs-improvement"
              : "poor",
      }
    }
  })

  return status
}
