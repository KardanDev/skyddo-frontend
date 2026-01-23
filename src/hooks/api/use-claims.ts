// Claims Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Claim,
  type CreateClaimInput,
  type UpdateClaimInput,
  type ClaimStatus,
} from '@/types/claim'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// Query key factory
const claimKeys = {
  all: ['claims'] as const,
  lists: () => [...claimKeys.all, 'list'] as const,
  list: (filters: string) => [...claimKeys.lists(), { filters }] as const,
  details: () => [...claimKeys.all, 'detail'] as const,
  detail: (id: number) => [...claimKeys.details(), id] as const,
}

// Get all claims
export function useClaims() {
  return useQuery({
    queryKey: claimKeys.lists(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Claim>>(
        API_ENDPOINTS.CLAIMS
      )
      return response.data.data
    },
  })
}

// Get single claim
export function useClaim(id: number) {
  return useQuery({
    queryKey: claimKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Claim>(API_ENDPOINTS.CLAIM(id))
      return response.data
    },
    enabled: !!id,
  })
}

// Create claim
export function useCreateClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateClaimInput) => {
      const response = await api.post<Claim>(API_ENDPOINTS.CLAIMS, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() })
      toast.success('Claim created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create claim'
      toast.error(message)
    },
  })
}

// Update claim
export function useUpdateClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateClaimInput
    }) => {
      const response = await api.put<Claim>(API_ENDPOINTS.CLAIM(id), data)
      return response.data
    },
    onSuccess: (updatedClaim) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() })
      queryClient.setQueryData(claimKeys.detail(updatedClaim.id), updatedClaim)
      toast.success('Claim updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update claim'
      toast.error(message)
    },
  })
}

// Delete claim
export function useDeleteClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.CLAIM(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() })
      queryClient.removeQueries({ queryKey: claimKeys.detail(deletedId) })
      toast.success('Claim deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete claim'
      toast.error(message)
    },
  })
}

// Update claim status
export function useUpdateClaimStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ClaimStatus }) => {
      const response = await api.post<Claim>(API_ENDPOINTS.CLAIM_STATUS(id), {
        status,
      })
      return response.data
    },
    onSuccess: (updatedClaim) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() })
      queryClient.setQueryData(claimKeys.detail(updatedClaim.id), updatedClaim)
      toast.success(`Claim status updated to ${updatedClaim.status}`)
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update claim status'
      toast.error(message)
    },
  })
}

// Forward claim to insurer
export function useForwardClaimToInsurer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(API_ENDPOINTS.CLAIM_FORWARD(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() })
      toast.success('Claim forwarded to insurer')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to forward claim to insurer'
      toast.error(message)
    },
  })
}
