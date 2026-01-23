// User/Member Types
import { type UserRole } from './auth'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: UserRole
}

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  role?: UserRole
}

export const USER_ROLES = {
  SUPER_USER: 'super_user' as const,
  ADMIN: 'admin' as const,
  MEMBER: 'member' as const,
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_user: 'Super User',
  admin: 'Admin',
  member: 'Member',
}
