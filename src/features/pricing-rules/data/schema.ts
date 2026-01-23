// Pricing Rule Form Schema
import { z } from 'zod'

const tieredRateSchema = z.object({
  min: z.number().min(0, 'Minimum must be 0 or greater'),
  max: z.number().min(0, 'Maximum must be 0 or greater'),
  rate: z.number().min(0, 'Rate must be 0 or greater'),
})

export const pricingRuleFormSchema = z.object({
  insurance_type_id: z.number({
    required_error: 'Insurance type is required',
  }),
  vehicle_type_id: z.number().nullable().optional(),
  insurer_id: z.number().nullable().optional(),
  calculation_type: z.enum(['percentage', 'fixed', 'tiered'], {
    required_error: 'Calculation type is required',
  }),
  rate: z.number().min(0, 'Rate must be 0 or greater'),
  price_multiplier: z.number().min(0).max(10).optional(),
  minimum_amount: z.number().min(0).nullable().optional(),
  maximum_amount: z.number().min(0).nullable().optional(),
  tiered_rates: z.array(tieredRateSchema).nullable().optional(),
  is_active: z.boolean().optional(),
  priority: z.number().min(0).optional(),
})

export type PricingRuleFormSchema = z.infer<typeof pricingRuleFormSchema>
