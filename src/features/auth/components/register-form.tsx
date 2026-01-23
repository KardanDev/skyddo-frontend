// Registration Form for Invitation Acceptance
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useVerifyInvitation } from '@/hooks/api/use-invitations'
import { useRegister } from '@/hooks/api/use-auth'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    password_confirmation: z.string(),
    phone: z.string().optional(),
    position: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  invitationToken: string
}

export function RegisterForm({ invitationToken }: RegisterFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    data: invitation,
    isLoading: verifyingInvitation,
    error: invitationError,
  } = useVerifyInvitation(invitationToken)

  const registerMutation = useRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      position: '',
    },
  })

  useEffect(() => {
    if (invitation) {
      form.setValue('email', invitation.email)
    }
  }, [invitation, form])

  const onSubmit = async (data: RegisterFormData) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        invitation_token: invitationToken,
        phone: data.phone || null,
        position: data.position || null,
      },
      {
        onSuccess: () => {
          navigate({ to: '/' })
        },
      }
    )
  }

  if (!invitationToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid Invitation</CardTitle>
          <CardDescription>
            No invitation token provided. Please check your invitation email.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (verifyingInvitation) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <Loader2 className='mx-auto h-12 w-12 animate-spin text-primary' />
            <p className='mt-4 text-sm text-muted-foreground'>
              Verifying your invitation...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (invitationError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-destructive'>
            <AlertCircle className='h-5 w-5' />
            Invalid or Expired Invitation
          </CardTitle>
          <CardDescription>
            This invitation link is no longer valid. It may have expired or already been
            used. Please contact your administrator for a new invitation.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          You've been invited to join as{' '}
          <span className='font-medium capitalize'>{invitation?.role.replace('_', ' ')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='John Doe'
                      {...field}
                      disabled={registerMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='john@company.com'
                      {...field}
                      disabled
                      className='bg-muted'
                    />
                  </FormControl>
                  <FormDescription>This email is linked to your invitation</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        {...field}
                        disabled={registerMutation.isPending}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className='text-xs'>
                    At least 8 characters with uppercase, lowercase, and number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password_confirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        {...field}
                        disabled={registerMutation.isPending}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Insurance Consultant'
                      {...field}
                      disabled={registerMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='+258 XX XXX XXXX'
                      {...field}
                      disabled={registerMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {registerMutation.isError && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  {(registerMutation.error as any)?.response?.data?.message ||
                    'Registration failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type='submit'
              className='w-full'
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  Complete Registration
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
