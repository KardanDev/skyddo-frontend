// Policy Schema
import { z } from 'zod'

export const policySchema = z.object({
  id: z.number(),
  client_id: z.number(),
  insurer_id: z.number(),
  quote_id: z.number().nullable(),
  policy_number: z.string(),
  insurance_type: z.string(),
  description: z.string().nullable(),
  sum_insured: z.number(),
  premium: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.enum(['active', 'expired', 'cancelled', 'pending_renewal']),
  zoho_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  client: z
    .object({
      id: z.number(),
      name: z.string(),
      email: z.string().nullable(),
    })
    .optional(),
  insurer: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
  claims_count: z.number().optional(),
  invoices_count: z.number().optional(),
})

export type PolicySchema = z.infer<typeof policySchema>

// Form schema for create/edit
export const policyFormSchema = z.object({
  client_id: z.number().min(1, 'Client is required'),
  insurer_id: z.number().min(1, 'Insurer is required'),
  quote_id: z.number().nullable().optional(),
  policy_number: z.string().min(1, 'Policy number is required'),
  insurance_type: z.string().min(1, 'Insurance type is required'),
  description: z.string().optional(),
  sum_insured: z.number().min(0, 'Sum insured must be positive'),
  premium: z.number().min(0, 'Premium must be positive'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  status: z
    .enum(['active', 'expired', 'cancelled', 'pending_renewal'])
    .default('active'),
})

export type PolicyFormSchema = z.infer<typeof policyFormSchema>
