/**
 * Image Optimization Utilities
 *
 * Helper functions for optimizing images:
 * - Generate responsive srcsets
 * - Create blur placeholders
 * - Convert to modern formats
 * - CDN URL generation
 */

/**
 * Generate responsive image srcset
 * @param {string} baseUrl - Base image URL
 * @param {number[]} widths - Array of widths for srcset
 * @param {object} options - Additional options
 * @returns {string} srcset string
 * @example
 * generateSrcSet('/images/hero.jpg', [320, 640, 1024])
 * // Returns: '/images/hero.jpg?w=320 320w, /images/hero.jpg?w=640 640w, ...'
 */
export const generateSrcSet = (
  baseUrl,
  widths = [320, 640, 768, 1024, 1280, 1920],
  options = {}
) => {
  const { quality = 80, format } = options

  return widths
    .map((width) => {
      // If using a CDN or image service (e.g., Cloudinary, Imgix, Vercel)
      // Replace this with your CDN URL generation logic
      const parameters = new URLSearchParams({
        w: width,
        q: quality,
        ...(format && { fm: format }),
      })

      // Example for different CDN services:
      // Cloudinary: `https://res.cloudinary.com/your-cloud/image/upload/w_${width},q_${quality}/${baseUrl}`
      // Imgix: `${baseUrl}?${params.toString()}`
      // Custom: `${baseUrl}?${params.toString()}`

      // For now, return standard format (update based on your setup)
      return `${baseUrl}?${parameters.toString()} ${width}w`
    })
    .join(", ")
}

/**
 * Generate sizes attribute for responsive images
 * @param {object} breakpoints - Breakpoint configurations
 * @returns {string} sizes string
 * @example
 * generateSizes({ sm: '100vw', md: '50vw', lg: '33vw' })
 */
export const generateSizes = (breakpoints = {}) => {
  const defaultBreakpoints = {
    sm: "100vw",
    md: "50vw",
    lg: "33vw",
  }

  const merged = { ...defaultBreakpoints, ...breakpoints }

  const sizes = []
  if (merged.sm) sizes.push(`(max-width: 640px) ${merged.sm}`)
  if (merged.md) sizes.push(`(max-width: 1024px) ${merged.md}`)
  if (merged.lg) sizes.push(merged.lg)

  return sizes.join(", ")
}

/**
 * Create a blur placeholder data URL
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Placeholder width (smaller = more blur)
 * @param {number} quality - JPEG quality (lower = more blur)
 * @returns {Promise<string>} Base64 data URL
 *
 * Note: This is a client-side implementation. For production, generate
 * placeholders at build time or use a CDN service.
 */
export const createBlurPlaceholder = async (
  imageUrl,
  width = 10,
  quality = 20
) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      // Calculate proportional height
      const aspectRatio = img.height / img.width
      const height = Math.round(width * aspectRatio)

      canvas.width = width
      canvas.height = height

      // Draw tiny version
      context.drawImage(img, 0, 0, width, height)

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/jpeg", quality / 100)
      resolve(dataUrl)
    }

    img.onerror = () => {
      reject(new Error("Failed to load image for placeholder"))
    }

    img.src = imageUrl
  })

/**
 * Check if browser supports modern image formats
 * @returns {object} Support flags for different formats
 */
export const checkImageFormatSupport = () => {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1

  return {
    webp: canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0,
    avif: canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0,
  }
}

/**
 * Get optimal image format based on browser support
 * @param {string} originalUrl - Original image URL
 * @param {object} formatSupport - Format support flags
 * @returns {string} Optimal image URL
 */
export const getOptimalImageUrl = (
  originalUrl,
  formatSupport = checkImageFormatSupport()
) => {
  // Priority: AVIF > WebP > Original
  if (formatSupport.avif) {
    return originalUrl.replace(/\.(jpg|jpeg|png)$/i, ".avif")
  }
  if (formatSupport.webp) {
    return originalUrl.replace(/\.(jpg|jpeg|png)$/i, ".webp")
  }
  return originalUrl
}

/**
 * Preload critical images for better LCP
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @param {object} options - Preload options
 */
export const preloadImages = (imageUrls, options = {}) => {
  const { as = "image", fetchpriority = "high" } = options

  imageUrls.forEach((url) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = as
    link.href = url
    link.fetchpriority = fetchpriority
    document.head.appendChild(link)
  })
}

/**
 * Lazy load images using Intersection Observer
 * @param {string} selector - CSS selector for images to lazy load
 * @param {object} options - Intersection Observer options
 */
export const lazyLoadImages = (selector = "img[data-src]", options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: "50px",
    threshold: 0.01,
  }

  const observerOptions = { ...defaultOptions, ...options }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        const { src } = img.dataset

        if (src) {
          img.src = src
          img.removeAttribute("data-src")
          imageObserver.unobserve(img)
        }
      }
    })
  }, observerOptions)

  const images = document.querySelectorAll(selector)
  images.forEach((img) => imageObserver.observe(img))

  return imageObserver
}

/**
 * Calculate image dimensions while maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {object} Calculated dimensions
 */
export const calculateImageDimensions = (
  originalWidth,
  originalHeight,
  targetWidth,
  targetHeight
) => {
  const aspectRatio = originalWidth / originalHeight

  let width = targetWidth
  let height = targetHeight

  if (targetWidth && !targetHeight) {
    height = targetWidth / aspectRatio
  } else if (targetHeight && !targetWidth) {
    width = targetHeight * aspectRatio
  } else if (targetWidth && targetHeight) {
    // Maintain aspect ratio, fit within bounds
    const targetAspectRatio = targetWidth / targetHeight

    if (aspectRatio > targetAspectRatio) {
      // Image is wider
      height = targetWidth / aspectRatio
    } else {
      // Image is taller
      width = targetHeight * aspectRatio
    }
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio,
  }
}

/**
 * Generate CDN URL with transformations
 * @param {string} baseUrl - Base image URL
 * @param {object} transformations - Transformation options
 * @returns {string} CDN URL with transformations
 * @example
 * generateCDNUrl('/image.jpg', { width: 800, quality: 80, format: 'webp' })
 */
export const generateCDNUrl = (baseUrl, transformations = {}) => {
  const {
    width,
    height,
    quality = 80,
    format,
    fit = "cover",
    blur,
    sharpen,
  } = transformations

  // Example for different CDN services:

  // Cloudinary
  // const transformStr = [
  //   width && `w_${width}`,
  //   height && `h_${height}`,
  //   quality && `q_${quality}`,
  //   format && `f_${format}`,
  //   fit && `c_${fit}`,
  // ].filter(Boolean).join(',')
  // return `https://res.cloudinary.com/your-cloud/image/upload/${transformStr}/${baseUrl}`

  // Imgix
  const parameters = new URLSearchParams()
  if (width) parameters.append("w", width)
  if (height) parameters.append("h", height)
  if (quality) parameters.append("q", quality)
  if (format) parameters.append("fm", format)
  if (fit) parameters.append("fit", fit)
  if (blur) parameters.append("blur", blur)
  if (sharpen) parameters.append("sharp", sharpen)

  // Return URL with params (update with your CDN logic)
  return `${baseUrl}?${parameters.toString()}`
}

/**
 * Image optimization configuration
 */
export const imageConfig = {
  // Default widths for srcset generation
  defaultWidths: [320, 640, 768, 1024, 1280, 1920],

  // Default quality settings
  quality: {
    low: 50,
    medium: 75,
    high: 90,
  },

  // Supported formats (in order of preference)
  formats: ["avif", "webp", "jpg"],

  // Lazy loading config
  lazyLoad: {
    rootMargin: "50px",
    threshold: 0.01,
  },

  // Preload config
  preload: {
    fetchpriority: "high",
  },
}
