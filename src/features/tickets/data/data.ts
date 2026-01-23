// Ticket Data Constants
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@/types/ticket'

export const TICKET_PRIORITY_OPTIONS = Object.entries(TICKET_PRIORITIES).map(
  ([value, label]) => ({
    value,
    label,
  })
)

export const TICKET_STATUS_OPTIONS = Object.entries(TICKET_STATUSES).map(
  ([value, label]) => ({
    value,
    label,
  })
)
