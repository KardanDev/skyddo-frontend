import { createFileRoute } from '@tanstack/react-router'
import QuotesPage from '@/features/quotes'

export const Route = createFileRoute('/_authenticated/quotes/')({
  component: QuotesPage,
})
