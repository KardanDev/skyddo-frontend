// Quote Types

export interface Quote {
  id: number
  client_id: number
  insurer_id: number | null
  insurance_type_id: number
  vehicle_type_id: number | null
  insurance_type: string // Legacy field
  description: string | null
  asset_value: number
  calculated_cost: number
  sum_insured: number // Legacy field
  premium: number | null // Legacy field
  status: QuoteStatus
  zoho_id: string | null
  created_at: string
  updated_at: string
  // Relationships
  client?: {
    id: number
    name: string
    email: string | null
  }
  insurer?: {
    id: number
    name: string
  } | null
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
}

export type QuoteStatus =
  | 'pending'
  | 'sent'
  | 'approved'
  | 'rejected'
  | 'expired'

export interface CreateQuoteInput {
  client_id: number
  insurer_id?: number | null
  insurance_type_id: number
  vehicle_type_id?: number | null
  asset_value: number
  calculated_cost?: number
  insurance_type?: string // Legacy
  description?: string | null
  sum_insured?: number // Legacy
  premium?: number | null // Legacy
  status?: QuoteStatus
}

export interface UpdateQuoteInput {
  client_id?: number
  insurer_id?: number | null
  insurance_type_id?: number
  vehicle_type_id?: number | null
  asset_value?: number
  calculated_cost?: number
  insurance_type?: string // Legacy
  description?: string | null
  sum_insured?: number // Legacy
  premium?: number | null // Legacy
  status?: QuoteStatus
}

export const QUOTE_STATUSES: Record<QuoteStatus, string> = {
  pending: 'Pending',
  sent: 'Sent to Insurer',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
}

export const INSURANCE_TYPES = [
  'motor',
  'health',
  'life',
  'property',
  'travel',
  'liability',
  'marine',
  'other',
] as const

export type InsuranceType = (typeof INSURANCE_TYPES)[number]

export const INSURANCE_TYPE_LABELS: Record<InsuranceType, string> = {
  motor: 'Motor Insurance',
  health: 'Health Insurance',
  life: 'Life Insurance',
  property: 'Property Insurance',
  travel: 'Travel Insurance',
  liability: 'Liability Insurance',
  marine: 'Marine Insurance',
  other: 'Other',
}
