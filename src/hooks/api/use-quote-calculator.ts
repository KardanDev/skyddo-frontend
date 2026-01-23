import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import api from '@/lib/api/client'

// Types
export interface InsuranceType {
  id: number
  name: string
  slug: string
  description: string
  requires_vehicle: boolean
}

export interface VehicleType {
  id: number
  name: string
  slug: string
  description: string
}

export interface QuoteCalculation {
  calculated_cost: number
  asset_value: number
  insurance_type: {
    id: number
    name: string
  }
  vehicle_type: {
    id: number
    name: string
  } | null
  breakdown: {
    calculation_type: 'percentage' | 'fixed' | 'tiered'
    rate: string
    minimum_amount: string
    maximum_amount: string
  }
}

export interface QuickCalculation {
  insurance_cost: number
  asset_value: number
  insurance_type: string
  vehicle_type: string | null
  currency: string
}

export interface CalculateQuoteInput {
  insurance_type_id: number
  asset_value: number
  vehicle_type_id?: number
}

// Query Keys
const quoteCalculatorKeys = {
  all: ['quote-calculator'] as const,
  insuranceTypes: () => [...quoteCalculatorKeys.all, 'insurance-types'] as const,
  vehicleTypes: () => [...quoteCalculatorKeys.all, 'vehicle-types'] as const,
  vehicleTypesForInsurance: (insuranceTypeId: number) =>
    [...quoteCalculatorKeys.vehicleTypes(), insuranceTypeId] as const,
}

/**
 * Fetch all insurance types
 */
export function useInsuranceTypes() {
  return useQuery({
    queryKey: quoteCalculatorKeys.insuranceTypes(),
    queryFn: async () => {
      const response = await api.get<{ data: InsuranceType[] }>(
        '/quote-calculator/insurance-types'
      )
      return response.data.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour - insurance types rarely change
  })
}

/**
 * Fetch vehicle types, optionally filtered by insurance type
 */
export function useVehicleTypes(insuranceTypeId?: number) {
  return useQuery({
    queryKey: insuranceTypeId
      ? quoteCalculatorKeys.vehicleTypesForInsurance(insuranceTypeId)
      : quoteCalculatorKeys.vehicleTypes(),
    queryFn: async () => {
      const params = insuranceTypeId
        ? { insurance_type_id: insuranceTypeId }
        : undefined
      const response = await api.get<{ data: VehicleType[] }>(
        '/quote-calculator/vehicle-types',
        { params }
      )
      return response.data.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour - vehicle types rarely change
  })
}

/**
 * Calculate quote with detailed breakdown
 */
export function useCalculateQuote() {
  return useMutation({
    mutationFn: async (input: CalculateQuoteInput) => {
      const response = await api.post<{ success: boolean; data: QuoteCalculation }>(
        '/quote-calculator/calculate',
        input
      )
      return response.data.data
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to calculate quote')
    },
  })
}

/**
 * Quick calculate quote with simplified response
 */
export function useQuickCalculateQuote() {
  return useMutation({
    mutationFn: async (input: CalculateQuoteInput) => {
      const response = await api.post<QuickCalculation>(
        '/quote-calculator/quick-calculate',
        input
      )
      return response.data
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to calculate quote')
    },
  })
}
