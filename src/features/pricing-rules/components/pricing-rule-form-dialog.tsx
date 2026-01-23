// Pricing Rule Form Dialog (Create/Edit)
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreatePricingRule, useUpdatePricingRule } from '@/hooks/api/use-pricing-rules'
import { useInsuranceTypes, useVehicleTypes } from '@/hooks/api/use-quote-calculator'
import { useActiveInsurers } from '@/hooks/api/use-insurers'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { pricingRuleFormSchema, type PricingRuleFormSchema } from '../data/schema'
import { usePricingRules } from './pricing-rules-provider'
import { CALCULATION_TYPE_LABELS } from '@/types/pricing-rule'

export function PricingRuleFormDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = usePricingRules()
  const createMutation = useCreatePricingRule()
  const updateMutation = useUpdatePricingRule()

  const { data: insuranceTypes, isLoading: insuranceTypesLoading } = useInsuranceTypes()
  const { data: vehicleTypes, isLoading: vehicleTypesLoading } = useVehicleTypes()
  const { data: insurers, isLoading: insurersLoading } = useActiveInsurers()

  const isEdit = open === 'edit'
  const isOpen = open === 'create' || open === 'edit'

  const form = useForm<PricingRuleFormSchema>({
    resolver: zodResolver(pricingRuleFormSchema),
    defaultValues: {
      insurance_type_id: undefined,
      vehicle_type_id: null,
      insurer_id: null,
      calculation_type: 'percentage',
      rate: 0,
      price_multiplier: 1.0,
      minimum_amount: null,
      maximum_amount: null,
      tiered_rates: null,
      is_active: true,
      priority: 0,
    },
  })

  const calculationType = form.watch('calculation_type')

  // Load current row data when editing
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        insurance_type_id: currentRow.insurance_type_id,
        vehicle_type_id: currentRow.vehicle_type_id,
        insurer_id: currentRow.insurer_id,
        calculation_type: currentRow.calculation_type,
        // Keep rate as is - it's already in decimal format (0.025 for 2.5%)
        // The input field will display it as percentage (2.5)
        rate: currentRow.rate,
        price_multiplier: currentRow.price_multiplier,
        minimum_amount: currentRow.minimum_amount,
        maximum_amount: currentRow.maximum_amount,
        tiered_rates: currentRow.tiered_rates,
        is_active: currentRow.is_active,
        priority: currentRow.priority,
      })
    } else if (!isEdit) {
      form.reset({
        insurance_type_id: undefined,
        vehicle_type_id: null,
        insurer_id: null,
        calculation_type: 'percentage',
        rate: 0,
        price_multiplier: 1.0,
        minimum_amount: null,
        maximum_amount: null,
        tiered_rates: null,
        is_active: true,
        priority: 0,
      })
    }
  }, [isEdit, currentRow, form])

  const onSubmit = (data: PricingRuleFormSchema) => {
    const payload = {
      ...data,
      vehicle_type_id: data.vehicle_type_id || null,
      insurer_id: data.insurer_id || null,
      minimum_amount: data.minimum_amount || null,
      maximum_amount: data.maximum_amount || null,
      tiered_rates: data.calculation_type === 'tiered' ? data.tiered_rates : null,
    }

    if (isEdit && currentRow) {
      updateMutation.mutate(
        { id: currentRow.id, data: payload },
        { onSuccess: handleClose }
      )
    } else {
      createMutation.mutate(payload, { onSuccess: handleClose })
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
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Pricing Rule' : 'Create Pricing Rule'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update pricing rule configuration.'
              : 'Add a new pricing rule for insurance calculations.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='insurance_type_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Type *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      disabled={insuranceTypesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={insuranceTypesLoading ? 'Loading...' : 'Select insurance type'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {insuranceTypes && insuranceTypes.length > 0 ? (
                          insuranceTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className='px-2 py-1.5 text-sm text-muted-foreground'>
                            No insurance types available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='vehicle_type_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'null' ? null : Number(value))
                      }
                      value={field.value?.toString() || 'null'}
                      disabled={vehicleTypesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={vehicleTypesLoading ? 'Loading...' : 'All vehicles'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='null'>All Vehicles</SelectItem>
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

              <FormField
                control={form.control}
                name='insurer_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurer</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'null' ? null : Number(value))
                      }
                      value={field.value?.toString() || 'null'}
                      disabled={insurersLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={insurersLoading ? 'Loading...' : 'Global rule'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='null'>Global Rule</SelectItem>
                        {insurers?.map((insurer) => (
                          <SelectItem key={insurer.id} value={insurer.id.toString()}>
                            {insurer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave as "Global Rule" for base pricing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='calculation_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calculation Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(CALCULATION_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {calculationType !== 'tiered' && (
                <FormField
                  control={form.control}
                  name='rate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate *</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step={calculationType === 'percentage' ? '0.01' : '1'}
                          placeholder={calculationType === 'percentage' ? '2.5' : '1000'}
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value)
                            // For percentage, convert to decimal (2.5% = 0.025)
                            field.onChange(calculationType === 'percentage' ? value / 100 : value)
                          }}
                          value={calculationType === 'percentage' && field.value ? (field.value * 100).toFixed(2) : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {calculationType === 'percentage' ? 'Percentage (e.g., 2.5 for 2.5%)' : 'Fixed amount in MZN'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='price_multiplier'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Multiplier</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        min='0'
                        max='10'
                        placeholder='1.00'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Adjust final price (1.0 = no change)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='minimum_amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Amount (MZN)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Optional'
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='maximum_amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Amount (MZN)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Optional'
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='0'
                        placeholder='0'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Higher priority rules are applied first
                    </FormDescription>
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
                        Enable or disable this pricing rule
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
