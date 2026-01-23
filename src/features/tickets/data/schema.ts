// Ticket Schema
import { z } from 'zod'

export const ticketSchema = z.object({
  id: z.number(),
  ticket_number: z.string(),
  client_id: z.number().nullable(),
  subject: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  assigned_to: z.number().nullable(),
  created_by: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type TicketSchema = z.infer<typeof ticketSchema>

// Form schema for create/edit
export const ticketFormSchema = z.object({
  client_id: z.number().nullable().optional(),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigned_to: z.number().nullable().optional(),
})

export type TicketFormSchema = z.infer<typeof ticketFormSchema>
