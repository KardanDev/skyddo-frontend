// Pricing Rules Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  PricingRule,
  CreatePricingRuleInput,
  UpdatePricingRuleInput,
} from '@/types/pricing-rule'
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

interface PricingRulesFilters {
  insurance_type_id?: number
  vehicle_type_id?: number | 'null'
  insurer_id?: number | 'null'
  calculation_type?: string
  is_active?: boolean
  per_page?: number
}

// Query key factory
const pricingRuleKeys = {
  all: ['pricing-rules'] as const,
  lists: () => [...pricingRuleKeys.all, 'list'] as const,
  list: (filters: PricingRulesFilters) =>
    [...pricingRuleKeys.lists(), filters] as const,
  details: () => [...pricingRuleKeys.all, 'detail'] as const,
  detail: (id: number) => [...pricingRuleKeys.details(), id] as const,
}

// Get all pricing rules with filters
export function usePricingRules(filters: PricingRulesFilters = {}) {
  return useQuery({
    queryKey: pricingRuleKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filters.insurance_type_id !== undefined) {
        params.append('insurance_type_id', filters.insurance_type_id.toString())
      }
      if (filters.vehicle_type_id !== undefined) {
        params.append('vehicle_type_id', filters.vehicle_type_id.toString())
      }
      if (filters.insurer_id !== undefined) {
        params.append('insurer_id', filters.insurer_id.toString())
      }
      if (filters.calculation_type) {
        params.append('calculation_type', filters.calculation_type)
      }
      if (filters.is_active !== undefined) {
        params.append('is_active', filters.is_active.toString())
      }
      if (filters.per_page) {
        params.append('per_page', filters.per_page.toString())
      }

      const url = `${API_ENDPOINTS.PRICING_RULES}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await api.get<PaginatedResponse<PricingRule>>(url)
      return response.data.data
    },
  })
}

// Get single pricing rule
export function usePricingRule(id: number) {
  return useQuery({
    queryKey: pricingRuleKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<PricingRule>(
        API_ENDPOINTS.PRICING_RULE(id)
      )
      return response.data
    },
    enabled: !!id,
  })
}

// Create pricing rule
export function useCreatePricingRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePricingRuleInput) => {
      const response = await api.post<PricingRule>(
        API_ENDPOINTS.PRICING_RULES,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.lists() })
      toast.success('Pricing rule created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to create pricing rule'
      toast.error(message)
    },
  })
}

// Update pricing rule
export function useUpdatePricingRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdatePricingRuleInput
    }) => {
      const response = await api.put<PricingRule>(
        API_ENDPOINTS.PRICING_RULE(id),
        data
      )
      return response.data
    },
    onSuccess: (updatedRule) => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.lists() })
      queryClient.setQueryData(
        pricingRuleKeys.detail(updatedRule.id),
        updatedRule
      )
      toast.success('Pricing rule updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update pricing rule'
      toast.error(message)
    },
  })
}

// Delete pricing rule
export function useDeletePricingRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.PRICING_RULE(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.lists() })
      queryClient.removeQueries({ queryKey: pricingRuleKeys.detail(deletedId) })
      toast.success('Pricing rule deleted successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to delete pricing rule'
      toast.error(message)
    },
  })
}

// Toggle pricing rule active status
export function useTogglePricingRuleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<PricingRule>(
        API_ENDPOINTS.PRICING_RULE_TOGGLE_ACTIVE(id)
      )
      return response.data
    },
    onSuccess: (updatedRule) => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.lists() })
      queryClient.setQueryData(
        pricingRuleKeys.detail(updatedRule.id),
        updatedRule
      )
      toast.success(
        `Pricing rule ${updatedRule.is_active ? 'activated' : 'deactivated'}`
      )
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'Failed to update pricing rule status'
      toast.error(message)
    },
  })
}

// Duplicate pricing rule
export function useDuplicatePricingRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<PricingRule>(
        API_ENDPOINTS.PRICING_RULE_DUPLICATE(id)
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.lists() })
      toast.success('Pricing rule duplicated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to duplicate pricing rule'
      toast.error(message)
    },
  })
}
