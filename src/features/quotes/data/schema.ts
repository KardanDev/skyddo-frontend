// Quote Schema
import { z } from 'zod'

export const quoteSchema = z.object({
  id: z.number(),
  client_id: z.number(),
  insurer_id: z.number().nullable(),
  insurance_type: z.string(),
  description: z.string().nullable(),
  sum_insured: z.number(),
  premium: z.number().nullable(),
  status: z.enum(['pending', 'sent', 'approved', 'rejected', 'expired']),
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
    .nullable()
    .optional(),
})

export type QuoteSchema = z.infer<typeof quoteSchema>

// Form schema for create/edit
export const quoteFormSchema = z.object({
  client_id: z.number().min(1, 'Client is required'),
  insurer_id: z.number().nullable().optional(),
  insurance_type_id: z.number().min(1, 'Insurance type is required'),
  vehicle_type_id: z.number().nullable().optional(),
  asset_value: z.number().min(0, 'Asset value must be positive'),
  calculated_cost: z.number().min(0).optional(),
  insurance_type: z.string().optional(), // Legacy
  description: z.string().optional(),
  sum_insured: z.number().min(0).optional(), // Legacy
  premium: z.number().min(0).nullable().optional(), // Legacy
  status: z
    .enum(['pending', 'sent', 'approved', 'rejected', 'expired'])
    .default('pending'),
})

export type QuoteFormSchema = z.infer<typeof quoteFormSchema>
