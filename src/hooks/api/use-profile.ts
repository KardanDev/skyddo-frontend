import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

// Types
export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string | null
  position: string | null
  bio: string | null
  role: string
  profile_photo_path: string | null
  profile_photo_url: string | null
  initials: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileInput {
  name: string
  email: string
  phone?: string
  position?: string
  bio?: string
}

export interface UpdatePasswordInput {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

// Query Keys
const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
}

/**
 * Fetch current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: async () => {
      const response = await api.get<UserProfile>('/profile')
      console.log(response)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const response = await api.put<{ message: string; data: UserProfile }>(
        '/profile',
        input
      )
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.detail(), data.data)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      toast.success(data.message || 'Profile updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })
}

/**
 * Upload profile photo
 */
export function useUploadProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('photo', file)

      const response = await api.post<{
        message: string
        data: { profile_photo_path: string; profile_photo_url: string }
      }>('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      toast.success(data.message || 'Profile photo uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to upload profile photo'
      )
    },
  })
}

/**
 * Delete profile photo
 */
export function useDeleteProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<{ message: string }>('/profile/photo')
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      toast.success(data.message || 'Profile photo deleted successfully')
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete profile photo'
      )
    },
  })
}

/**
 * Update password
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (input: UpdatePasswordInput) => {
      const response = await api.put<{ message: string }>(
        '/profile/password',
        input
      )
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update password')
    },
  })
}
