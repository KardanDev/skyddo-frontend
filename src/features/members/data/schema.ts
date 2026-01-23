import { z } from 'zod'
import { USER_ROLES } from '@/types/user'

const memberStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type MemberStatus = z.infer<typeof memberStatusSchema>

const memberRoleSchema = z.union([
  z.literal(USER_ROLES.SUPER_USER),
  z.literal(USER_ROLES.ADMIN),
  z.literal(USER_ROLES.MEMBER),
])
export type MemberRole = z.infer<typeof memberRoleSchema>

const memberSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: memberRoleSchema,
  status: memberStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})
export type Member = z.infer<typeof memberSchema>

export const memberListSchema = z.array(memberSchema)
