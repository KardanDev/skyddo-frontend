// Client Schema
import { z } from 'zod'

export const clientSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  id_number: z.string().nullable(),
  company_name: z.string().nullable(),
  zoho_contact_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  quotes_count: z.number().optional(),
  policies_count: z.number().optional(),
  claims_count: z.number().optional(),
  invoices_count: z.number().optional(),
})

export type ClientSchema = z.infer<typeof clientSchema>

// Form schema for create/edit
export const clientFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  id_number: z.string().optional(),
  company_name: z.string().optional(),
})

export type ClientFormSchema = z.infer<typeof clientFormSchema>
