import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { RegisterForm } from '@/features/auth/components/register-form'

export const Route = createFileRoute('/(auth)/register')({
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    }
  },
})

function RegisterPage() {
  const { token } = useSearch({ from: '/(auth)/register' })
  const navigate = useNavigate()

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Welcome to Skyddo
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Complete your registration to join the team
          </p>
        </div>
        <RegisterForm invitationToken={token} />
      </div>
    </div>
  )
}
