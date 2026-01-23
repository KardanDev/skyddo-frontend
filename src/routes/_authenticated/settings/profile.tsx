import { createFileRoute } from '@tanstack/react-router'
import { ProfileSettings } from '@/features/settings/profile/profile-settings'

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: ProfileSettings,
})
