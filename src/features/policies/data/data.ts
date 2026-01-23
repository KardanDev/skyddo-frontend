// Policy Data Constants
import { POLICY_STATUSES, INSURANCE_TYPE_LABELS } from '@/types/policy'

export const POLICY_STATUS_OPTIONS = Object.entries(POLICY_STATUSES).map(
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
