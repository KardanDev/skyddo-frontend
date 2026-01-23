// Claim Form Dialog (Create/Edit)
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateClaim, useUpdateClaim } from '@/hooks/api/use-claims'
import { usePolicies } from '@/hooks/api/use-policies'
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CLAIM_STATUS_OPTIONS } from '../data/data'
import { claimFormSchema, type ClaimFormSchema } from '../data/schema'
import { useClaims } from './claims-provider'

export function ClaimFormDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useClaims()
  const createMutation = useCreateClaim()
  const updateMutation = useUpdateClaim()
  const { data: policies } = usePolicies()

  const isEdit = open === 'edit'
  const isOpen = open === 'create' || open === 'edit'

  const form = useForm<ClaimFormSchema>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      policy_id: 0,
      claim_number: '',
      description: '',
      claim_amount: 0,
      approved_amount: null,
      status: 'submitted',
      incident_date: '',
      submitted_date: new Date().toISOString().split('T')[0],
      processed_date: '',
    },
  })

  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        policy_id: currentRow.policy_id,
        claim_number: currentRow.claim_number,
        description: currentRow.description,
        claim_amount: currentRow.claim_amount,
        approved_amount: currentRow.approved_amount,
        status: currentRow.status,
        incident_date: currentRow.incident_date?.split('T')[0] || '',
        submitted_date: currentRow.submitted_date.split('T')[0],
        processed_date: currentRow.processed_date?.split('T')[0] || '',
      })
    } else if (!isEdit) {
      form.reset({
        policy_id: 0,
        claim_number: '',
        description: '',
        claim_amount: 0,
        approved_amount: null,
        status: 'submitted',
        incident_date: '',
        submitted_date: new Date().toISOString().split('T')[0],
        processed_date: '',
      })
    }
  }, [isEdit, currentRow, form])

  const onSubmit = (data: ClaimFormSchema) => {
    if (isEdit && currentRow) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          data: {
            ...data,
            incident_date: data.incident_date || null,
            processed_date: data.processed_date || null,
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
          incident_date: data.incident_date || null,
          processed_date: data.processed_date || null,
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
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Claim' : 'Create Claim'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update claim information.'
              : 'Add a new insurance claim to the system.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='policy_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a policy' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {policies?.map((policy) => (
                          <SelectItem
                            key={policy.id}
                            value={policy.id.toString()}
                          >
                            {policy.policy_number} - {policy.client?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='claim_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Claim Number</FormLabel>
                    <FormControl>
                      <Input placeholder='CLM-2024-001' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CLAIM_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='claim_amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Claim Amount *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='5000'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='approved_amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approved Amount</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='4500'
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='incident_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='submitted_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Submitted Date *</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='processed_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processed Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the claim details...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
