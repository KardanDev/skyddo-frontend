// Authentication Types

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserRole = 'super_user' | 'admin' | 'member'

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}
