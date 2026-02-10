import { useEffect, useRef } from "react"
import { cancelAllRequests } from "@/services/api"

/**
 * Custom hook to handle request cancellation on component unmount
 * Automatically cancels all pending API requests when component unmounts
 *
 * @example
 * function MyComponent() {
 *   useRequestCancellation()
 *
 *   const { data } = useQuery({
 *     queryKey: ['users'],
 *     queryFn: () => api.get('/users')
 *   })
 *
 *   return <div>{data?.name}</div>
 * }
 */
export function useRequestCancellation() {
  const cancelledRef = useRef(false)

  useEffect(() => {
    return () => {
      if (!cancelledRef.current) {
        cancelAllRequests()
        cancelledRef.current = true
      }
    }
  }, [])
}

/**
 * Custom hook to create an AbortController for manual request cancellation
 * Useful for cancelling requests on user actions (e.g., navigation, button clicks)
 *
 * @returns {{ signal: AbortSignal, cancel: Function }}
 *
 * @example
 * function SearchComponent() {
 *   const { signal, cancel } = useAbortController()
 *
 *   const searchUsers = async (query) => {
 *     try {
 *       const response = await api.get('/users/search', {
 *         params: { q: query },
 *         signal
 *       })
 *       return response.data
 *     } catch (error) {
 *       if (axios.isCancel(error)) {
 *         console.log('Request cancelled')
 *       }
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={cancel}>Cancel Search</button>
 *     </div>
 *   )
 * }
 */
export function useAbortController() {
  const controllerRef = useRef(null)

  useEffect(() => {
    controllerRef.current = new AbortController()

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort()
      }
    }
  }, [])

  const cancel = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
      // Create new controller for subsequent requests
      controllerRef.current = new AbortController()
    }
  }

  return {
    signal: controllerRef.current?.signal,
    cancel,
  }
}

/**
 * Custom hook to automatically cancel requests when a dependency changes
 * Useful for search inputs, filters, etc.
 *
 * @param {Function} requestFn - Function that makes the API request
 * @param {Array} deps - Dependencies to watch for changes
 * @param {Object} options - Configuration options
 * @returns {{ isLoading: boolean, error: Error|null, cancel: Function }}
 *
 * @example
 * function SearchComponent({ searchTerm }) {
 *   const { isLoading, error, cancel } = useCancellableRequest(
 *     async (signal) => {
 *       const response = await api.get('/users/search', {
 *         params: { q: searchTerm },
 *         signal
 *       })
 *       return response.data
 *     },
 *     [searchTerm], // Cancel and retry when searchTerm changes
 *     { debounce: 300 }
 *   )
 *
 *   return <div>Loading: {isLoading}</div>
 * }
 */
export function useCancellableRequest(requestFn, deps = [], options = {}) {
  const { debounce = 0, onSuccess, onError } = options
  const controllerRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Cancel previous request
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Create new controller
    controllerRef.current = new AbortController()
    const controller = controllerRef.current

    // Execute request with optional debounce
    const executeRequest = async () => {
      try {
        const result = await requestFn(controller.signal)
        if (onSuccess && !controller.signal.aborted) {
          onSuccess(result)
        }
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          // Request was cancelled, don't call onError
          return
        }
        if (onError && !controller.signal.aborted) {
          onError(error)
        }
      }
    }

    if (debounce > 0) {
      timeoutRef.current = setTimeout(executeRequest, debounce)
    } else {
      executeRequest()
    }

    return () => {
      if (controller) {
        controller.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, deps)

  const cancel = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return { cancel }
}
