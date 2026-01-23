import { createFileRoute } from '@tanstack/react-router'
import { CompanySettings } from '@/features/settings/company/company-settings'

export const Route = createFileRoute('/_authenticated/settings/company')({
  component: CompanySettings,
})
