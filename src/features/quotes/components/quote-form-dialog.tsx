// Quote Form Dialog (Create/Edit)
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calculator, Loader2 } from 'lucide-react'

import { useClients } from '@/hooks/api/use-clients'
import { useInsurers } from '@/hooks/api/use-insurers'
import { useCreateQuote, useUpdateQuote } from '@/hooks/api/use-quotes'
import {
  useInsuranceTypes,
  useVehicleTypes,
  useCalculateQuote,
} from '@/hooks/api/use-quote-calculator'
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
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { QUOTE_STATUS_OPTIONS } from '../data/data'
import { quoteFormSchema, type QuoteFormSchema } from '../data/schema'
import { useQuotes } from './quotes-provider'

export function QuoteFormDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useQuotes()
  const createMutation = useCreateQuote()
  const updateMutation = useUpdateQuote()
  const { data: clients } = useClients()
  const { data: insurers } = useInsurers()
  const { data: insuranceTypes } = useInsuranceTypes()
  const calculateMutation = useCalculateQuote()

  const [selectedInsuranceTypeId, setSelectedInsuranceTypeId] = useState<
    number | null
  >(null)
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null)
  const [showCalculation, setShowCalculation] = useState(false)

  const selectedInsuranceType = insuranceTypes?.find(
    (type) => type.id === selectedInsuranceTypeId
  )

  const { data: vehicleTypes } = useVehicleTypes(selectedInsuranceTypeId || undefined)

  const isEdit = open === 'edit'
  const isOpen = open === 'create' || open === 'edit'

  const form = useForm<QuoteFormSchema>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      client_id: 0,
      insurer_id: null,
      insurance_type_id: 0,
      vehicle_type_id: null,
      asset_value: 0,
      calculated_cost: 0,
      description: '',
      status: 'pending',
    },
  })

  // Load current row data when editing
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        client_id: currentRow.client_id,
        insurer_id: currentRow.insurer_id,
        insurance_type_id: currentRow.insurance_type_id,
        vehicle_type_id: currentRow.vehicle_type_id,
        asset_value: currentRow.asset_value,
        calculated_cost: currentRow.calculated_cost,
        description: currentRow.description || '',
        status: currentRow.status,
      })
      setSelectedInsuranceTypeId(currentRow.insurance_type_id)
      setCalculatedCost(currentRow.calculated_cost)
    } else if (!isEdit) {
      form.reset({
        client_id: 0,
        insurer_id: null,
        insurance_type_id: 0,
        vehicle_type_id: null,
        asset_value: 0,
        calculated_cost: 0,
        description: '',
        status: 'pending',
      })
      setSelectedInsuranceTypeId(null)
      setCalculatedCost(null)
      setShowCalculation(false)
    }
  }, [isEdit, currentRow, form])

  // Auto-calculate when insurance type, vehicle type, or asset value changes
  const handleCalculate = async () => {
    const insuranceTypeId = form.getValues('insurance_type_id')
    const assetValue = form.getValues('asset_value')
    const vehicleTypeId = form.getValues('vehicle_type_id')

    if (!insuranceTypeId || !assetValue || assetValue <= 0) {
      return
    }

    // If insurance requires vehicle but no vehicle selected, don't calculate
    if (selectedInsuranceType?.requires_vehicle && !vehicleTypeId) {
      return
    }

    setShowCalculation(true)

    try {
      const result = await calculateMutation.mutateAsync({
        insurance_type_id: insuranceTypeId,
        asset_value: assetValue,
        vehicle_type_id: vehicleTypeId || undefined,
      })

      setCalculatedCost(result.calculated_cost)
      form.setValue('calculated_cost', result.calculated_cost)
    } catch (error) {
      setCalculatedCost(null)
    }
  }

  const onSubmit = (data: QuoteFormSchema) => {
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
      setSelectedInsuranceTypeId(null)
      setCalculatedCost(null)
      setShowCalculation(false)
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Quote' : 'Create Quote'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update quote information.'
              : 'Calculate and create a new insurance quote.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Client and Insurer */}
            <div className='grid grid-cols-2 gap-4'>
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
                          <SelectItem key={client.id} value={client.id.toString()}>
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
                    <FormLabel>Insurer</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : null)
                      }
                      value={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select an insurer' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=''>None</SelectItem>
                        {insurers?.map((insurer) => (
                          <SelectItem key={insurer.id} value={insurer.id.toString()}>
                            {insurer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Insurance Type and Vehicle Type */}
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='insurance_type_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Type *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const numValue = Number(value)
                        field.onChange(numValue)
                        setSelectedInsuranceTypeId(numValue)
                        form.setValue('vehicle_type_id', null)
                        setCalculatedCost(null)
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select insurance type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {insuranceTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            <div className='flex items-center gap-2'>
                              {type.name}
                              {type.requires_vehicle && (
                                <Badge variant='secondary' className='text-xs'>
                                  Vehicle
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedInsuranceType?.requires_vehicle && (
                <FormField
                  control={form.control}
                  name='vehicle_type_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value ? Number(value) : null)
                          setCalculatedCost(null)
                        }}
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select vehicle type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!selectedInsuranceType?.requires_vehicle &&
                selectedInsuranceTypeId && (
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
                            {QUOTE_STATUS_OPTIONS.map((option) => (
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
                )}
            </div>

            {/* Asset Value and Calculate Button */}
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='asset_value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedInsuranceType?.requires_vehicle
                        ? 'Vehicle Value (MZN)'
                        : 'Asset Value (MZN)'}{' '}
                      *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='50000'
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                          setCalculatedCost(null)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      The value of the asset to be insured
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex flex-col justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCalculate}
                  disabled={
                    !form.getValues('insurance_type_id') ||
                    !form.getValues('asset_value') ||
                    calculateMutation.isPending ||
                    (selectedInsuranceType?.requires_vehicle &&
                      !form.getValues('vehicle_type_id'))
                  }
                  className='w-full'
                >
                  {calculateMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className='mr-2 h-4 w-4' />
                      Calculate Cost
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Calculated Cost Display */}
            {showCalculation && calculatedCost !== null && (
              <Alert className='border-green-500 bg-green-50 dark:bg-green-950'>
                <Calculator className='h-4 w-4 text-green-600 dark:text-green-400' />
                <AlertDescription className='flex items-center justify-between'>
                  <span className='font-medium'>Calculated Insurance Cost:</span>
                  <span className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    {calculatedCost.toLocaleString()} MZN
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {/* Status (if vehicle required, show after vehicle selection) */}
            {selectedInsuranceType?.requires_vehicle && (
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
                        {QUOTE_STATUS_OPTIONS.map((option) => (
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
            )}

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Additional details about the quote...'
                      className='min-h-[80px]'
                      {...field}
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
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  !calculatedCost
                }
              >
                {isEdit ? 'Update Quote' : 'Create Quote'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
