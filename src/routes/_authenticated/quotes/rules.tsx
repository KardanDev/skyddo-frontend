import { createFileRoute } from '@tanstack/react-router'
import PricingRulesPage from '@/features/pricing-rules'

export const Route = createFileRoute('/_authenticated/quotes/rules')({
  component: PricingRulesPage,
})
