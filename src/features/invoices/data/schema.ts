// Invoice Schema
import { z } from 'zod'

export const invoiceSchema = z.object({
  id: z.number(),
  policy_id: z.number().nullable(),
  claim_id: z.number().nullable(),
  invoice_number: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  tax_amount: z.number(),
  total_amount: z.number(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  due_date: z.string().nullable(),
  paid_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type InvoiceSchema = z.infer<typeof invoiceSchema>

// Form schema for create/edit
export const invoiceFormSchema = z.object({
  policy_id: z.number().nullable().optional(),
  claim_id: z.number().nullable().optional(),
  invoice_number: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  tax_amount: z.number().min(0, 'Tax amount must be positive').default(0),
  total_amount: z.number().min(0, 'Total amount must be positive'),
  status: z
    .enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
    .default('draft'),
  due_date: z.string().optional(),
  paid_date: z.string().optional(),
})

export type InvoiceFormSchema = z.infer<typeof invoiceFormSchema>
