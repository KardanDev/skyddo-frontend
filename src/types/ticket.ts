// Ticket Types (Frontend Only - No Backend Model Yet)

export interface Ticket {
  id: number
  ticket_number: string
  client_id: number | null
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  assigned_to: number | null
  created_by: number
  created_at: string
  updated_at: string
  // Relationships
  client?: {
    id: number
    name: string
    email: string | null
  } | null
  assignee?: {
    id: number
    name: string
  } | null
  creator?: {
    id: number
    name: string
  }
  // Relationship counts
  responses_count?: number
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface TicketResponse {
  id: number
  ticket_id: number
  user_id: number
  message: string
  is_internal: boolean
  created_at: string
  updated_at: string
  // Relationships
  user?: {
    id: number
    name: string
  }
}

export interface CreateTicketInput {
  client_id?: number | null
  subject: string
  description: string
  priority: TicketPriority
  assigned_to?: number | null
}

export interface UpdateTicketInput {
  client_id?: number | null
  subject?: string
  description?: string
  priority?: TicketPriority
  status?: TicketStatus
  assigned_to?: number | null
}

export interface CreateTicketResponseInput {
  ticket_id: number
  message: string
  is_internal?: boolean
}

export const TICKET_PRIORITIES: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const TICKET_STATUSES: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}
