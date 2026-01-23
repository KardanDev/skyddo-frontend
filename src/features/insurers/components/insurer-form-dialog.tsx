// Insurer Form Dialog (Create/Edit)
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateInsurer, useUpdateInsurer } from '@/hooks/api/use-insurers'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { insurerFormSchema, type InsurerFormSchema } from '../data/schema'
import { useInsurers } from './insurers-provider'

export function InsurerFormDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useInsurers()
  const createMutation = useCreateInsurer()
  const updateMutation = useUpdateInsurer()

  const isEdit = open === 'edit'
  const isOpen = open === 'create' || open === 'edit'

  const form = useForm<InsurerFormSchema>({
    resolver: zodResolver(insurerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      contact_person: '',
      is_active: true,
    },
  })

  // Load current row data when editing
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        name: currentRow.name,
        email: currentRow.email || '',
        phone: currentRow.phone || '',
        address: currentRow.address || '',
        contact_person: currentRow.contact_person || '',
        is_active: currentRow.is_active,
      })
    } else if (!isEdit) {
      form.reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        contact_person: '',
        is_active: true,
      })
    }
  }, [isEdit, currentRow, form])

  const onSubmit = (data: InsurerFormSchema) => {
    if (isEdit && currentRow) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          data: {
            ...data,
            email: data.email || null,
            phone: data.phone || null,
            address: data.address || null,
            contact_person: data.contact_person || null,
          },
        },
        {
          onSuccess: () => {
            handleClose()
          },
        }
      )
    } else {
      createMutation.mutate(
        {
          ...data,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          contact_person: data.contact_person || null,
        },
        {
          onSuccess: () => {
            handleClose()
          },
        }
      )
    }
  }

  const handleClose = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
      form.reset()
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Insurer' : 'Create Insurer'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update insurer information.'
              : 'Add a new insurance company to the system.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='ABC Insurance Co.' {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='contact@insurer.com'
                        {...field}
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='+1234567890' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contact_person'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='123 Main St, City, Country'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='is_active'
                render={({ field }) => (
                  <FormItem className='col-span-2 flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this insurer
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
