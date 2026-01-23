import { createFileRoute } from '@tanstack/react-router'
import PoliciesPage from '@/features/policies'

export const Route = createFileRoute('/_authenticated/policies')({
  component: PoliciesPage,
})
