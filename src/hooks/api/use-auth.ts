// Authentication API Hooks
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { setCookie, removeCookie } from '@/lib/cookies'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  password_confirmation: string
  invitation_token: string
  phone?: string | null
  position?: string | null
}

export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
    role: string
    profile_photo_url: string | null
  }
  token: string
}

// Login
export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await api.post<AuthResponse>('/auth/login', input)
      return response.data
    },
    onSuccess: (data) => {
      // Store auth token in cookie (7 days = 7 * 24 * 60 * 60 seconds)
      setCookie('skyydo_auth_token', data.token, 60 * 60 * 24 * 7)
      toast.success('Welcome back!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    },
  })
}

// Register (Accept Invitation)
export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const response = await api.post<AuthResponse>('/auth/register', input)
      return response.data
    },
    onSuccess: (data) => {
      // Store auth token in cookie (7 days = 7 * 24 * 60 * 60 seconds)
      setCookie('skyydo_auth_token', data.token, 60 * 60 * 24 * 7)
      toast.success('Welcome to Skyydo! Your account has been created.')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
    },
  })
}

// Logout
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout')
    },
    onSuccess: () => {
      removeCookie('skyydo_auth_token')
      toast.success('Logged out successfully')
      window.location.href = '/sign-in'
    },
    onError: () => {
      // Even if API call fails, clear local token
      removeCookie('skyydo_auth_token')
      window.location.href = '/sign-in'
    },
  })
}
