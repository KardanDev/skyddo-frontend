// Axios Client with Auth Interceptors
import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { getCookie, removeCookie } from '../cookies'
import { toast } from 'sonner'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getCookie('skyydo_auth_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized errors (expired/invalid token)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname

      // Don't redirect if already on auth pages
      if (!currentPath.startsWith('/sign-in') && !currentPath.startsWith('/register')) {
        removeCookie('skyydo_auth_token')
        toast.error('Session expired. Please sign in again.')

        // Redirect to sign-in with return URL
        window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
