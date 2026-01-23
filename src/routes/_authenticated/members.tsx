import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '@/features/members'

export const Route = createFileRoute('/_authenticated/members')({
  component: UsersPage,
})
