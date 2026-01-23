// Invoice Types

export interface Invoice {
  id: number
  policy_id: number | null
  claim_id: number | null
  invoice_number: string
  description: string | null
  amount: number
  tax_amount: number
  total_amount: number
  status: InvoiceStatus
  due_date: string | null
  paid_date: string | null
  created_at: string
  updated_at: string
  // Relationships
  policy?: {
    id: number
    policy_number: string
    client?: {
      id: number
      name: string
    }
  } | null
  claim?: {
    id: number
    claim_number: string
  } | null
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface CreateInvoiceInput {
  policy_id?: number | null
  claim_id?: number | null
  invoice_number?: string
  description?: string | null
  amount: number
  tax_amount?: number
  total_amount: number
  status?: InvoiceStatus
  due_date?: string | null
  paid_date?: string | null
}

export interface UpdateInvoiceInput {
  policy_id?: number | null
  claim_id?: number | null
  invoice_number?: string
  description?: string | null
  amount?: number
  tax_amount?: number
  total_amount?: number
  status?: InvoiceStatus
  due_date?: string | null
  paid_date?: string | null
}

export const INVOICE_STATUSES: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}
