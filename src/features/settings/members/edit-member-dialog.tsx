// Edit Member Dialog Component
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useUpdateUser, type User } from '@/hooks/api/use-users'
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

const editMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'member']),
  phone: z.string().optional(),
  position: z.string().optional(),
})

type EditMemberFormData = z.infer<typeof editMemberSchema>

interface EditMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function EditMemberDialog({ open, onOpenChange, user }: EditMemberDialogProps) {
  const { data: profile } = useProfile()
  const updateUser = useUpdateUser()

  const form = useForm<EditMemberFormData>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'member',
      phone: '',
      position: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role === 'super_user' ? 'admin' : user.role,
        phone: user.phone || '',
        position: user.position || '',
      })
    }
  }, [user, form])

  const onSubmit = (data: EditMemberFormData) => {
    if (!user) return

    updateUser.mutate(
      {
        id: user.id,
        data: {
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone || null,
          position: data.position || null,
        },
      },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  // Only super users can manage admin roles
  const canManageAdminRole = profile?.role === 'super_user'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update the member's information and role
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='John Doe'
                      {...field}
                      disabled={updateUser.isPending}
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='john@company.com'
                      type='email'
                      {...field}
                      disabled={updateUser.isPending}
                    />
                  </FormControl>
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
                    value={field.value}
                    disabled={updateUser.isPending || !canManageAdminRole}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='member'>
                        <div>
                          <p className='font-medium'>Member</p>
                          <p className='text-xs text-muted-foreground'>
                            Standard access to manage operations
                          </p>
                        </div>
                      </SelectItem>
                      {canManageAdminRole && (
                        <SelectItem value='admin'>
                          <div>
                            <p className='font-medium'>Admin</p>
                            <p className='text-xs text-muted-foreground'>
                              Full access including team management
                            </p>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {!canManageAdminRole && (
                    <FormDescription>
                      Only super users can change admin roles
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Insurance Consultant'
                      {...field}
                      disabled={updateUser.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='+258 XX XXX XXXX'
                      {...field}
                      disabled={updateUser.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={updateUser.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={updateUser.isPending}>
                {updateUser.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
