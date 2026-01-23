// Invoice Data Constants
import { INVOICE_STATUSES } from '@/types/invoice'

export const INVOICE_STATUS_OPTIONS = Object.entries(INVOICE_STATUSES).map(
  ([value, label]) => ({
    value,
    label,
  })
)
