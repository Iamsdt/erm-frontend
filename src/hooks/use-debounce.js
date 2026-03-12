import { useEffect, useState } from "react"

/**
 * Debounces a value by the given delay.
 * Useful for search inputs to avoid filtering on every keystroke.
 * @param {unknown} value - The value to debounce.
 * @param {number} [delay] - Delay in milliseconds.
 * @returns {unknown} The debounced value.
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
