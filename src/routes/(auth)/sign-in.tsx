import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'
import { getCookie } from '@/lib/cookies'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
  beforeLoad: async ({ search }) => {
    // Check if user is already authenticated
    const token = getCookie('skyydo_auth_token')

    if (token) {
      // Redirect to the intended page or dashboard
      throw redirect({
        to: search.redirect || '/',
      })
    }
  },
})
