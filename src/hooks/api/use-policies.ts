// Policies Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Policy,
  type CreatePolicyInput,
  type UpdatePolicyInput,
  type PolicyStatus,
} from '@/types/policy'
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
const policyKeys = {
  all: ['policies'] as const,
  lists: () => [...policyKeys.all, 'list'] as const,
  list: (filters: string) => [...policyKeys.lists(), { filters }] as const,
  details: () => [...policyKeys.all, 'detail'] as const,
  detail: (id: number) => [...policyKeys.details(), id] as const,
  expiring: () => [...policyKeys.all, 'expiring'] as const,
}

// Get all policies
export function usePolicies() {
  return useQuery({
    queryKey: policyKeys.lists(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Policy>>(
        API_ENDPOINTS.POLICIES
      )
      return response.data.data
    },
  })
}

// Get expiring policies (next 30 days)
export function useExpiringPolicies() {
  return useQuery({
    queryKey: policyKeys.expiring(),
    queryFn: async () => {
      const response = await api.get<Policy[]>(API_ENDPOINTS.POLICIES_EXPIRING)
      return response.data
    },
  })
}

// Get single policy
export function usePolicy(id: number) {
  return useQuery({
    queryKey: policyKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Policy>(API_ENDPOINTS.POLICY(id))
      return response.data
    },
    enabled: !!id,
  })
}

// Create policy
export function useCreatePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePolicyInput) => {
      const response = await api.post<Policy>(API_ENDPOINTS.POLICIES, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: policyKeys.expiring() })
      toast.success('Policy created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create policy'
      toast.error(message)
    },
  })
}

// Update policy
export function useUpdatePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdatePolicyInput
    }) => {
      const response = await api.put<Policy>(API_ENDPOINTS.POLICY(id), data)
      return response.data
    },
    onSuccess: (updatedPolicy) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: policyKeys.expiring() })
      queryClient.setQueryData(
        policyKeys.detail(updatedPolicy.id),
        updatedPolicy
      )
      toast.success('Policy updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update policy'
      toast.error(message)
    },
  })
}

// Delete policy
export function useDeletePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.POLICY(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: policyKeys.expiring() })
      queryClient.removeQueries({ queryKey: policyKeys.detail(deletedId) })
      toast.success('Policy deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete policy'
      toast.error(message)
    },
  })
}

// Renew policy
export function useRenewPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<Policy>(API_ENDPOINTS.POLICY_RENEW(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: policyKeys.expiring() })
      toast.success('Policy renewed successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to renew policy'
      toast.error(message)
    },
  })
}

// Update policy status (using update endpoint with status field)
export function useUpdatePolicyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number
      status: PolicyStatus
    }) => {
      const response = await api.put<Policy>(API_ENDPOINTS.POLICY(id), {
        status,
      })
      return response.data
    },
    onSuccess: (updatedPolicy) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: policyKeys.expiring() })
      queryClient.setQueryData(
        policyKeys.detail(updatedPolicy.id),
        updatedPolicy
      )
      toast.success(`Policy status updated to ${updatedPolicy.status}`)
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update policy status'
      toast.error(message)
    },
  })
}
