// Policy Form Dialog (Create/Edit)
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClients } from '@/hooks/api/use-clients'
import { useInsurers } from '@/hooks/api/use-insurers'
import { useCreatePolicy, useUpdatePolicy } from '@/hooks/api/use-policies'
import { useQuotes } from '@/hooks/api/use-quotes'
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
import { POLICY_STATUS_OPTIONS, INSURANCE_TYPE_OPTIONS } from '../data/data'
import { policyFormSchema, type PolicyFormSchema } from '../data/schema'
import { usePolicies } from './policies-provider'

export function PolicyFormDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = usePolicies()
  const createMutation = useCreatePolicy()
  const updateMutation = useUpdatePolicy()
  const { data: clients } = useClients()
  const { data: insurers } = useInsurers()
  const { data: quotes } = useQuotes()

  const isEdit = open === 'edit'
  const isOpen = open === 'create' || open === 'edit'

  const form = useForm<PolicyFormSchema>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      client_id: 0,
      insurer_id: 0,
      quote_id: null,
      policy_number: '',
      insurance_type: '',
      description: '',
      sum_insured: 0,
      premium: 0,
      start_date: '',
      end_date: '',
      status: 'active',
    },
  })

  // Load current row data when editing
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        client_id: currentRow.client_id,
        insurer_id: currentRow.insurer_id,
        quote_id: currentRow.quote_id,
        policy_number: currentRow.policy_number,
        insurance_type: currentRow.insurance_type,
        description: currentRow.description || '',
        sum_insured: currentRow.sum_insured,
        premium: currentRow.premium,
        start_date: currentRow.start_date.split('T')[0],
        end_date: currentRow.end_date.split('T')[0],
        status: currentRow.status,
      })
    } else if (!isEdit) {
      form.reset({
        client_id: 0,
        insurer_id: 0,
        quote_id: null,
        policy_number: '',
        insurance_type: '',
        description: '',
        sum_insured: 0,
        premium: 0,
        start_date: '',
        end_date: '',
        status: 'active',
      })
    }
  }, [isEdit, currentRow, form])

  const onSubmit = (data: PolicyFormSchema) => {
    if (isEdit && currentRow) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          data: {
            ...data,
            description: data.description || null,
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
          description: data.description || null,
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
          <DialogTitle>{isEdit ? 'Edit Policy' : 'Create Policy'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update policy information.'
              : 'Add a new insurance policy to the system.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='policy_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Number *</FormLabel>
                    <FormControl>
                      <Input placeholder='POL-2024-001' {...field} />
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
                        {POLICY_STATUS_OPTIONS.map((option) => (
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
                name='client_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a client' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id.toString()}
                          >
                            {client.name}
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
                name='insurer_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurer *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select an insurer' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {insurers?.map((insurer) => (
                          <SelectItem
                            key={insurer.id}
                            value={insurer.id.toString()}
                          >
                            {insurer.name}
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
                name='insurance_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INSURANCE_TYPE_OPTIONS.map((option) => (
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
                name='quote_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Quote</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : null)
                      }
                      value={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a quote' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=''>None</SelectItem>
                        {quotes?.map((quote) => (
                          <SelectItem
                            key={quote.id}
                            value={quote.id.toString()}
                          >
                            Quote #{quote.id} - {quote.client?.name}
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
                name='sum_insured'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sum Insured *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='10000'
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
                name='premium'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Premium *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='500'
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
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Additional details about the policy...'
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
