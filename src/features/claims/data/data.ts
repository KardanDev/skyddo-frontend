// Claim Data Constants
import { CLAIM_STATUSES } from '@/types/claim'

export const CLAIM_STATUS_OPTIONS = Object.entries(CLAIM_STATUSES).map(
  ([value, label]) => ({
    value,
    label,
  })
)
