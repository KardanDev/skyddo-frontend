// Pricing Rule Types

export type CalculationType = 'percentage' | 'fixed' | 'tiered'

export interface TieredRate {
  min: number
  max: number
  rate: number
}

export interface PricingRule {
  id: number
  insurance_type_id: number
  vehicle_type_id: number | null
  insurer_id: number | null
  calculation_type: CalculationType
  rate: number
  price_multiplier: number
  minimum_amount: number | null
  maximum_amount: number | null
  tiered_rates: TieredRate[] | null
  is_active: boolean
  priority: number
  created_at: string
  updated_at: string
  // Relationships
  insuranceType?: {
    id: number
    name: string
    slug: string
    requires_vehicle: boolean
  }
  vehicleType?: {
    id: number
    name: string
    slug: string
  } | null
  insurer?: {
    id: number
    name: string
  } | null
}

export interface CreatePricingRuleInput {
  insurance_type_id: number
  vehicle_type_id?: number | null
  insurer_id?: number | null
  calculation_type: CalculationType
  rate: number
  price_multiplier?: number
  minimum_amount?: number | null
  maximum_amount?: number | null
  tiered_rates?: TieredRate[] | null
  is_active?: boolean
  priority?: number
}

export interface UpdatePricingRuleInput {
  insurance_type_id?: number
  vehicle_type_id?: number | null
  insurer_id?: number | null
  calculation_type?: CalculationType
  rate?: number
  price_multiplier?: number
  minimum_amount?: number | null
  maximum_amount?: number | null
  tiered_rates?: TieredRate[] | null
  is_active?: boolean
  priority?: number
}

export const CALCULATION_TYPE_LABELS: Record<CalculationType, string> = {
  percentage: 'Percentage',
  fixed: 'Fixed Amount',
  tiered: 'Tiered Rates',
}

export type PricingRuleFormData = Omit<CreatePricingRuleInput, 'id'>
