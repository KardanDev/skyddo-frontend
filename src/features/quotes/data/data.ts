// Quote Data Constants
import { QUOTE_STATUSES, INSURANCE_TYPE_LABELS } from '@/types/quote'

export const QUOTE_STATUS_OPTIONS = Object.entries(QUOTE_STATUSES).map(
  ([value, label]) => ({
    value,
    label,
  })
)

export const INSURANCE_TYPE_OPTIONS = Object.entries(INSURANCE_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
)
