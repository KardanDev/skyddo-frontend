// Invitations API Hooks
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

export interface Invitation {
  id: number
  email: string
  role: 'admin' | 'member'
  token: string
  short_code: string
  invited_by: number
  inviter: {
    id: number
    name: string
    email: string
  }
  accepted_at: string | null
  expires_at: string
  created_at: string
  updated_at: string
}

interface CreateInvitationInput {
  email: string
  role: 'admin' | 'member'
}

// Query keys
const invitationKeys = {
  all: ['invitations'] as const,
  lists: () => [...invitationKeys.all, 'list'] as const,
}

// Get all pending invitations
export function useInvitations() {
  return useQuery({
    queryKey: invitationKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Invitation[]>('/invitations')
      return response.data
    },
  })
}

// Create invitation
export function useCreateInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateInvitationInput) => {
      const response = await api.post<Invitation>('/invitations', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() })
      toast.success('Invitation sent successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to send invitation'
      toast.error(message)
    },
  })
}

// Revoke invitation
export function useRevokeInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/invitations/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() })
      toast.success('Invitation revoked successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to revoke invitation'
      toast.error(message)
    },
  })
}

// Verify invitation token (public)
export function useVerifyInvitation(token: string) {
  return useQuery({
    queryKey: ['invitation-verify', token],
    queryFn: async () => {
      const response = await api.get<{
        email: string
        role: string
        expires_at: string
      }>(`/invitations/verify/${token}`)
      return response.data
    },
    enabled: !!token,
    retry: false,
  })
}
