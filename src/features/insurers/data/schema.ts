// Insurer Schema
import { z } from 'zod'

export const insurerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  contact_person: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  quotes_count: z.number().optional(),
  policies_count: z.number().optional(),
})

export type InsurerSchema = z.infer<typeof insurerSchema>

// Form schema for create/edit
export const insurerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contact_person: z.string().optional(),
  is_active: z.boolean().default(true),
})

export type InsurerFormSchema = z.infer<typeof insurerFormSchema>
