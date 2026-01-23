import { createFileRoute } from '@tanstack/react-router'
import InsurersPage from '@/features/insurers'

export const Route = createFileRoute('/_authenticated/insurers')({
  component: InsurersPage,
})
