// Claim Schema
import { z } from 'zod'

export const claimSchema = z.object({
  id: z.number(),
  policy_id: z.number(),
  claim_number: z.string(),
  description: z.string(),
  claim_amount: z.number(),
  approved_amount: z.number().nullable(),
  status: z.enum([
    'submitted',
    'under_review',
    'approved',
    'partially_approved',
    'rejected',
    'closed',
  ]),
  incident_date: z.string().nullable(),
  submitted_date: z.string(),
  processed_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  policy: z
    .object({
      id: z.number(),
      policy_number: z.string(),
      insurance_type: z.string(),
      client: z
        .object({
          id: z.number(),
          name: z.string(),
        })
        .optional(),
    })
    .optional(),
  documents_count: z.number().optional(),
})

export type ClaimSchema = z.infer<typeof claimSchema>

// Form schema for create/edit
export const claimFormSchema = z.object({
  policy_id: z.number().min(1, 'Policy is required'),
  claim_number: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  claim_amount: z.number().min(0, 'Claim amount must be positive'),
  approved_amount: z
    .number()
    .min(0, 'Approved amount must be positive')
    .nullable()
    .optional(),
  status: z
    .enum([
      'submitted',
      'under_review',
      'approved',
      'partially_approved',
      'rejected',
      'closed',
    ])
    .default('submitted'),
  incident_date: z.string().optional(),
  submitted_date: z.string().min(1, 'Submitted date is required'),
  processed_date: z.string().optional(),
})

export type ClaimFormSchema = z.infer<typeof claimFormSchema>
