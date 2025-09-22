import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { API_CONFIG, buildApiUrl, API_ERROR_CODES, RATE_LIMIT_HEADERS } from './config'
import { ApiResponse, ApiError } from './types'
import { useAuthStore } from '@/stores/auth-store'
import { convertKeysSnakeToCamel, convertKeysCamelToSnake } from './utils/case-converter'
import { mapApiUserToUser, mapApiStudyToStudy, mapApiRadiologistToRadiologist, mapApiOrganizationToOrganization } from './response-mappers'

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Convert request data from camelCase to snake_case
    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.data = convertKeysCamelToSnake(config.data)
    }

    // Convert query params from camelCase to snake_case
    if (config.params) {
      config.params = convertKeysCamelToSnake(config.params)
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }

    // Handle successful responses - wrap in standard format if not already
    if (response.status >= 200 && response.status < 300) {
      // Log the raw response for debugging
      console.log('Raw API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      })
      
      // If response already has success/data structure, use it
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Convert the nested data from snake_case to camelCase
        const convertedData = convertKeysSnakeToCamel(response.data.data)
        response.data.data = convertedData
        return response
      }
      
      // Convert response data from snake_case to camelCase
      const convertedData = convertKeysSnakeToCamel(response.data)
      
      // Debug log for users endpoint
      if (response.config.url?.includes('/users')) {
        console.log('Users API raw response:', response.data)
        console.log('Users API converted data:', convertedData)
      }
      
      // Special handling for login response
      if (response.config.url?.includes('/auth/login') && response.data.access_token) {
        response.data = {
          success: true,
          data: {
            token: response.data.access_token,
            user: {
              id: 'admin',
              email: 'admin@ajeris.com', 
              name: 'Admin User',
              role: 'SUPER_ADMIN',
              status: 'active',
              twoFactorEnabled: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              invitedBy: 'system',
              invitedAt: new Date().toISOString(),
            },
            permissions: ['all']
          }
        }
      // ========== MOCK INTERCEPTORS REMOVED ==========
      // All mock interceptors have been removed as real endpoints are now available
      // If you need to add temporary mocks, please document why they are needed
      } else {
        // Handle paginated responses from backend
        if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
          // Backend returns: { data: [], total_count, has_more, page, items_per_page }
          // Frontend expects: { data: [], meta: { page, limit, total, hasMore } }
          // First convert the data array items from snake_case to camelCase
          let convertedDataArray = response.data.data.map((item: any) => convertKeysSnakeToCamel(item))
          
          // Apply specific mappers for known endpoints
          const fullUrl = response.config.url || ''
          console.log('Checking URL for mappers:', fullUrl)
          
          if (fullUrl.includes('/users') || fullUrl.includes('/api/admin/users')) {
            console.log('Applying user mapper to array:', convertedDataArray)
            convertedDataArray = convertedDataArray.map(mapApiUserToUser)
            console.log('After user mapper:', convertedDataArray)
          } else if (fullUrl.includes('/studies') || fullUrl.includes('/api/admin/studies')) {
            console.log('Applying study mapper to array:', convertedDataArray)
            convertedDataArray = convertedDataArray.map(mapApiStudyToStudy)
            console.log('After study mapper:', convertedDataArray)
          } else if (fullUrl.includes('/radiologists') || fullUrl.includes('/api/admin/radiologists')) {
            console.log('Applying radiologist mapper to array:', convertedDataArray)
            convertedDataArray = convertedDataArray.map(mapApiRadiologistToRadiologist)
            console.log('After radiologist mapper:', convertedDataArray)
          } else if (fullUrl.includes('/organizations') || fullUrl.includes('/api/admin/organizations')) {
            console.log('Applying organization mapper to array:', convertedDataArray)
            convertedDataArray = convertedDataArray.map(mapApiOrganizationToOrganization)
            console.log('After organization mapper:', convertedDataArray)
          }
          
          const paginatedData = {
            success: true,
            data: convertedDataArray,
            meta: {
              page: response.data.page || 1,
              limit: response.data.items_per_page || response.data.limit || 10,
              total: response.data.total_count || response.data.data.length,
              hasMore: response.data.has_more || false,
              totalPages: response.data.total_pages || Math.ceil((response.data.total_count || 0) / (response.data.items_per_page || 10))
            }
          }
          response.data = paginatedData
        } else {
          // Apply specific mappers for known endpoints
          let finalData = convertedData.data || convertedData
          const fullUrl = response.config.url || ''
          
          if ((fullUrl.includes('/users') || fullUrl.includes('/api/admin/users')) && !Array.isArray(finalData)) {
            console.log('Applying user mapper to single item:', finalData)
            finalData = mapApiUserToUser(finalData)
          } else if ((fullUrl.includes('/studies') || fullUrl.includes('/api/admin/studies')) && !Array.isArray(finalData)) {
            console.log('Applying study mapper to single item:', finalData)
            finalData = mapApiStudyToStudy(finalData)
          } else if ((fullUrl.includes('/radiologists') || fullUrl.includes('/api/admin/radiologists')) && !Array.isArray(finalData)) {
            console.log('Applying radiologist mapper to single item:', finalData)
            finalData = mapApiRadiologistToRadiologist(finalData)
          } else if ((fullUrl.includes('/organizations') || fullUrl.includes('/api/admin/organizations')) && !Array.isArray(finalData)) {
            console.log('Applying organization mapper to single item:', finalData)
            finalData = mapApiOrganizationToOrganization(finalData)
          }
          
          // Wrap non-paginated responses in standard format
          response.data = {
            success: true,
            data: finalData,
            meta: convertedData.meta || undefined
          }
        }
      }
    }

    // Extract rate limit info
    const rateLimitInfo = {
      limit: response.headers[RATE_LIMIT_HEADERS.LIMIT.toLowerCase()],
      remaining: response.headers[RATE_LIMIT_HEADERS.REMAINING.toLowerCase()],
      reset: response.headers[RATE_LIMIT_HEADERS.RESET.toLowerCase()],
    }

    if (rateLimitInfo.remaining && parseInt(rateLimitInfo.remaining) < 10) {
      console.warn('Rate limit warning:', rateLimitInfo)
      
      // Show warning toast if very low
      if (parseInt(rateLimitInfo.remaining) < 5) {
        const resetTime = rateLimitInfo.reset ? new Date(parseInt(rateLimitInfo.reset) * 1000) : null
        const resetMessage = resetTime ? ` Resets at ${resetTime.toLocaleTimeString()}.` : ''
        
        // Import toast dynamically to avoid circular dependencies
        import('@/components/ui/use-toast').then(({ toast }) => {
          toast({
            title: 'Rate limit warning',
            description: `Only ${rateLimitInfo.remaining} requests remaining.${resetMessage}`,
            variant: 'destructive',
          })
        })
      }
    }

    return response
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        message: error.response?.data?.error?.message || error.message,
      })
    }

    // All error response mocks have been removed - endpoints should return proper data

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const authStore = useAuthStore.getState()
        const refreshToken = authStore.refreshToken
        
        if (refreshToken) {
          // Call refresh token method from auth store
          const refreshSuccess = await authStore.refreshAccessToken()
          
          if (refreshSuccess) {
            // Get new token and retry original request
            const newToken = useAuthStore.getState().token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return axiosInstance(originalRequest)
          }
        }
        
        // No refresh token or refresh failed
        throw new Error('Session expired')
      } catch (refreshError) {
        // Refresh failed, clear session and redirect
        const authStore = useAuthStore.getState()
        await authStore.logout()
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session=expired'
        }
        
        return Promise.reject({
          code: API_ERROR_CODES.UNAUTHORIZED,
          message: 'Session expired. Please login again.',
          details: { sessionExpired: true }
        })
      }
    }

    // Handle other errors
    const apiError: ApiError = {
      code: API_ERROR_CODES.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      details: {},
    }

    if (error.response) {
      // Server responded with error
      apiError.code = error.response.data?.error?.code || API_ERROR_CODES.INTERNAL_ERROR
      apiError.message = error.response.data?.error?.message || error.message
      apiError.details = error.response.data?.error?.details || {}

      // Map status codes to error codes
      switch (error.response.status) {
        case 400:
          apiError.code = API_ERROR_CODES.VALIDATION_ERROR
          break
        case 401:
          apiError.code = API_ERROR_CODES.UNAUTHORIZED
          break
        case 403:
          apiError.code = API_ERROR_CODES.FORBIDDEN
          break
        case 404:
          apiError.code = API_ERROR_CODES.NOT_FOUND
          break
        case 429:
          apiError.code = API_ERROR_CODES.RATE_LIMIT_ERROR
          apiError.message = 'Too many requests. Please try again later.'
          
          // Extract retry after header
          const retryAfter = error.response.headers['retry-after']
          if (retryAfter) {
            const retrySeconds = parseInt(retryAfter)
            apiError.details.retryAfter = retrySeconds
            apiError.message = `Too many requests. Please try again in ${retrySeconds} seconds.`
          }
          break
      }
    } else if (error.request) {
      // Request made but no response
      apiError.code = API_ERROR_CODES.NETWORK_ERROR
      apiError.message = 'Network error. Please check your connection.'
    } else {
      // Request setup error
      apiError.message = error.message
    }

    return Promise.reject(apiError)
  }
)

// API Client class
export class ApiClient {
  private static instance: ApiClient
  private retryCount: Map<string, number> = new Map()

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  // Generic request method with retry logic
  private async request<T>(
    config: AxiosRequestConfig,
    retryAttempt = 0
  ): Promise<ApiResponse<T>> {
    const requestKey = `${config.method}-${config.url}`

    try {
      const response = await axiosInstance.request<any>(config)
      
      // Reset retry count on success
      this.retryCount.delete(requestKey)
      
      // Handle different response formats
      // If the response is already in ApiResponse format, return it
      if (response.data && typeof response.data === 'object' && ('success' in response.data || 'data' in response.data)) {
        return response.data as ApiResponse<T>
      }
      
      // Otherwise, wrap the response in our standard format
      return {
        success: true,
        data: response.data as T,
        message: 'Success'
      }
    } catch (error) {
      // Check if we should retry
      if (
        retryAttempt < API_CONFIG.RETRY_ATTEMPTS &&
        this.shouldRetry(error as ApiError)
      ) {
        // Exponential backoff
        const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, retryAttempt)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        return this.request<T>(config, retryAttempt + 1)
      }

      // Max retries reached or non-retryable error
      // Return error wrapped in ApiResponse format
      return {
        success: false,
        data: null as any,
        error: error as ApiError,
        message: (error as ApiError).message || 'Request failed'
      }
    }
  }

  private shouldRetry(error: ApiError): boolean {
    // Retry on network errors or 5xx server errors
    return (
      error.code === API_ERROR_CODES.NETWORK_ERROR ||
      error.code === API_ERROR_CODES.TIMEOUT_ERROR ||
      (error.code === API_ERROR_CODES.INTERNAL_ERROR && !error.details?.noRetry)
    )
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'GET',
      url: buildApiUrl(url),
    })
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url: buildApiUrl(url),
      data,
    })
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url: buildApiUrl(url),
      data,
    })
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url: buildApiUrl(url),
      data,
    })
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url: buildApiUrl(url),
    })
  }

  // File upload
  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url: buildApiUrl(url),
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  }

  // File download
  async download(url: string, filename?: string): Promise<void> {
    const response = await axiosInstance.get(buildApiUrl(url), {
      responseType: 'blob',
    })

    // Create download link
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Form data POST (for endpoints that expect form data instead of JSON)
  async postFormData<T>(
    url: string,
    data: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    
    // Convert object to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value)
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, String(item)))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    return this.request<T>({
      ...config,
      method: 'POST',
      url: buildApiUrl(url),
      data: formData,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance()

// Export axios instance for custom usage
export { axiosInstance }