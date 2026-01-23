// Users API Hooks
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

export interface User {
  id: number
  name: string
  email: string
  role: 'super_user' | 'admin' | 'member'
  profile_photo_path: string | null
  profile_photo_url: string | null
  phone: string | null
  position: string | null
  bio: string | null
  initials: string
  created_at: string
  updated_at: string
}

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface UpdateUserInput {
  name?: string
  email?: string
  role?: 'admin' | 'member'
  phone?: string | null
  position?: string | null
  bio?: string | null
}

// Query keys
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: { search?: string; role?: string }) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

// Get all users
export function useUsers(filters: { search?: string; role?: string } = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filters.search) {
        params.append('search', filters.search)
      }

      if (filters.role && filters.role !== 'all') {
        params.append('role', filters.role)
      }

      const url = `/users${params.toString() ? `?${params.toString()}` : ''}`
      const response = await api.get<PaginatedResponse<User>>(url)
      return response.data.data
    },
  })
}

// Get single user
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<{ data: User }>(`/users/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserInput }) => {
      const response = await api.put<{ data: User }>(`/users/${id}`, data)
      return response.data.data
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      toast.success('User updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update user'
      toast.error(message)
    },
  })
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) })
      toast.success('User deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
    },
  })
}
