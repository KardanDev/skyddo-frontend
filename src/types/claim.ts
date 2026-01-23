// Claim Types

export interface Claim {
  id: number
  policy_id: number
  claim_number: string
  description: string
  claim_amount: number
  approved_amount: number | null
  status: ClaimStatus
  incident_date: string | null
  submitted_date: string
  processed_date: string | null
  created_at: string
  updated_at: string
  // Relationships
  policy?: {
    id: number
    policy_number: string
    insurance_type: string
    client?: {
      id: number
      name: string
    }
  }
  // Relationship counts
  documents_count?: number
}

export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'partially_approved'
  | 'rejected'
  | 'closed'

export interface CreateClaimInput {
  policy_id: number
  claim_number?: string
  description: string
  claim_amount: number
  approved_amount?: number | null
  status?: ClaimStatus
  incident_date?: string | null
  submitted_date: string
  processed_date?: string | null
}

export interface UpdateClaimInput {
  policy_id?: number
  claim_number?: string
  description?: string
  claim_amount?: number
  approved_amount?: number | null
  status?: ClaimStatus
  incident_date?: string | null
  submitted_date?: string
  processed_date?: string | null
}

export const CLAIM_STATUSES: Record<ClaimStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  partially_approved: 'Partially Approved',
  rejected: 'Rejected',
  closed: 'Closed',
}
