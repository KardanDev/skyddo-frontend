// Insurers Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Insurer,
  type CreateInsurerInput,
  type UpdateInsurerInput,
} from '@/types/insurer'
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
const insurerKeys = {
  all: ['insurers'] as const,
  lists: () => [...insurerKeys.all, 'list'] as const,
  list: (filters: string) => [...insurerKeys.lists(), { filters }] as const,
  details: () => [...insurerKeys.all, 'detail'] as const,
  detail: (id: number) => [...insurerKeys.details(), id] as const,
  active: () => [...insurerKeys.all, 'active'] as const,
}

// Get all insurers
export function useInsurers() {
  return useQuery({
    queryKey: insurerKeys.lists(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Insurer>>(
        API_ENDPOINTS.INSURERS
      )
      return response.data.data
    },
  })
}

// Get active insurers only
export function useActiveInsurers() {
  return useQuery({
    queryKey: insurerKeys.active(),
    queryFn: async () => {
      const response = await api.get<Insurer[]>(API_ENDPOINTS.INSURERS_ACTIVE)
      return response.data
    },
  })
}

// Get single insurer
export function useInsurer(id: number) {
  return useQuery({
    queryKey: insurerKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Insurer>(API_ENDPOINTS.INSURER(id))
      return response.data
    },
    enabled: !!id,
  })
}

// Create insurer
export function useCreateInsurer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateInsurerInput) => {
      const response = await api.post<Insurer>(API_ENDPOINTS.INSURERS, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: insurerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: insurerKeys.active() })
      toast.success('Insurer created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to create insurer'
      toast.error(message)
    },
  })
}

// Update insurer
export function useUpdateInsurer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateInsurerInput
    }) => {
      const response = await api.put<Insurer>(API_ENDPOINTS.INSURER(id), data)
      return response.data
    },
    onSuccess: (updatedInsurer) => {
      queryClient.invalidateQueries({ queryKey: insurerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: insurerKeys.active() })
      queryClient.setQueryData(
        insurerKeys.detail(updatedInsurer.id),
        updatedInsurer
      )
      toast.success('Insurer updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update insurer'
      toast.error(message)
    },
  })
}

// Delete insurer
export function useDeleteInsurer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.INSURER(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: insurerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: insurerKeys.active() })
      queryClient.removeQueries({ queryKey: insurerKeys.detail(deletedId) })
      toast.success('Insurer deleted successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to delete insurer'
      toast.error(message)
    },
  })
}

// Toggle insurer active status
export function useToggleInsurerStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: number
      is_active: boolean
    }) => {
      const response = await api.put<Insurer>(API_ENDPOINTS.INSURER(id), {
        is_active,
      })
      return response.data
    },
    onSuccess: (updatedInsurer) => {
      queryClient.invalidateQueries({ queryKey: insurerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: insurerKeys.active() })
      queryClient.setQueryData(
        insurerKeys.detail(updatedInsurer.id),
        updatedInsurer
      )
      toast.success(
        `Insurer ${updatedInsurer.is_active ? 'activated' : 'deactivated'}`
      )
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update insurer status'
      toast.error(message)
    },
  })
}

// Get insurer's insurance types
export function useInsurerInsuranceTypes(insurerId: number) {
  return useQuery({
    queryKey: [...insurerKeys.detail(insurerId), 'insurance-types'],
    queryFn: async () => {
      const response = await api.get(
        API_ENDPOINTS.INSURER_INSURANCE_TYPES(insurerId)
      )
      return response.data
    },
    enabled: !!insurerId,
  })
}

// Sync insurer insurance types
export function useSyncInsurerInsuranceTypes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      insurerId,
      insuranceTypes,
    }: {
      insurerId: number
      insuranceTypes: Array<{
        insurance_type_id: number
        is_active?: boolean
        turnaround_days: number
      }>
    }) => {
      const response = await api.post(
        API_ENDPOINTS.INSURER_INSURANCE_TYPES(insurerId),
        { insurance_types: insuranceTypes }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: insurerKeys.detail(variables.insurerId),
      })
      queryClient.invalidateQueries({
        queryKey: [...insurerKeys.detail(variables.insurerId), 'insurance-types'],
      })
      toast.success('Insurance types updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update insurance types'
      toast.error(message)
    },
  })
}
