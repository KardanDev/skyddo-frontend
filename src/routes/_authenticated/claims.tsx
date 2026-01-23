import { createFileRoute } from '@tanstack/react-router'
import ClaimsPage from '@/features/claims'

export const Route = createFileRoute('/_authenticated/claims')({
  component: ClaimsPage,
})
