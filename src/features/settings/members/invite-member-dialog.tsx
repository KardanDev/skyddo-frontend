// Invite Member Dialog Component
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useCreateInvitation } from '@/hooks/api/use-invitations'
import { useProfile } from '@/hooks/api/use-profile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

const inviteFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'member'], {
    required_error: 'Please select a role',
  }),
})

type InviteFormData = z.infer<typeof inviteFormSchema>

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const { data: profile } = useProfile()
  const createInvitation = useCreateInvitation()

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  })

  const onSubmit = (data: InviteFormData) => {
    createInvitation.mutate(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  // Only super users can invite admins
  const canInviteAdmins = profile?.role === 'super_user'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new member to your team. The invitation will
            expire in 7 days.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='member@company.com'
                      type='email'
                      {...field}
                      disabled={createInvitation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the email address of the person you want to invite
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={createInvitation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='member'>
                        <div>
                          <p className='font-medium'>Member</p>
                          <p className='text-xs text-muted-foreground'>
                            Can manage clients, quotes, policies and claims
                          </p>
                        </div>
                      </SelectItem>
                      {canInviteAdmins && (
                        <SelectItem value='admin'>
                          <div>
                            <p className='font-medium'>Admin</p>
                            <p className='text-xs text-muted-foreground'>
                              Full access including team management and settings
                            </p>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <InfoIcon className='h-4 w-4' />
              <AlertDescription className='text-sm'>
                <strong>Role Permissions:</strong>
                <ul className='mt-2 space-y-1 text-xs'>
                  <li>
                    <strong>Member:</strong> Can view and edit their own profile
                  </li>
                  {canInviteAdmins && (
                    <li>
                      <strong>Admin:</strong> Can manage team members and company settings
                    </li>
                  )}
                  <li>
                    <strong>Super User:</strong> Full system access (cannot be assigned via
                    invitation)
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={createInvitation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createInvitation.isPending}>
                {createInvitation.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
