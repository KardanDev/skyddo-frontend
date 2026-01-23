// Document Data Constants
import { DOCUMENTABLE_TYPE_LABELS } from '@/types/document'

export const DOCUMENTABLE_TYPE_OPTIONS = Object.entries(
  DOCUMENTABLE_TYPE_LABELS
).map(([value, label]) => ({
  value,
  label,
}))
