// Policy Types
import { type InsuranceType } from './quote'

export interface Policy {
  id: number
  client_id: number
  insurer_id: number
  quote_id: number | null
  policy_number: string
  insurance_type: InsuranceType
  description: string | null
  sum_insured: number
  premium: number
  start_date: string
  end_date: string
  status: PolicyStatus
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
  }
  quote?: {
    id: number
    insurance_type: string
  } | null
  // Relationship counts
  claims_count?: number
  invoices_count?: number
}

export type PolicyStatus =
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'pending_renewal'

export interface CreatePolicyInput {
  client_id: number
  insurer_id: number
  quote_id?: number | null
  policy_number?: string
  insurance_type: InsuranceType
  description?: string | null
  sum_insured: number
  premium: number
  start_date: string
  end_date: string
  status?: PolicyStatus
}

export interface UpdatePolicyInput {
  client_id?: number
  insurer_id?: number
  quote_id?: number | null
  policy_number?: string
  insurance_type?: InsuranceType
  description?: string | null
  sum_insured?: number
  premium?: number
  start_date?: string
  end_date?: string
  status?: PolicyStatus
}

export const POLICY_STATUSES: Record<PolicyStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  cancelled: 'Cancelled',
  pending_renewal: 'Pending Renewal',
}
