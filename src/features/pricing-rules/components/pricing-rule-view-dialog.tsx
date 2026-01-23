// Pricing Rule View Dialog
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePricingRules } from './pricing-rules-provider'
import { CALCULATION_TYPE_LABELS } from '@/types/pricing-rule'

export function PricingRuleViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = usePricingRules()

  const isOpen = open === 'view'

  const handleClose = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 300)
  }

  if (!currentRow) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Pricing Rule Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex items-start justify-between'>
            <div>
              <h3 className='text-2xl font-semibold'>
                {currentRow.insuranceType?.name}
              </h3>
              <p className='text-sm text-muted-foreground'>
                {currentRow.vehicleType?.name || 'All Vehicles'}
              </p>
            </div>
            <Badge variant={currentRow.is_active ? 'default' : 'secondary'}>
              {currentRow.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className='grid gap-4'>
            <div className='flex items-start gap-3'>
              <div className='w-full'>
                <p className='text-sm font-medium'>Insurer</p>
                <p className='text-sm text-muted-foreground'>
                  {currentRow.insurer?.name || (
                    <Badge variant='outline'>Global Rule</Badge>
                  )}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='w-full'>
                <p className='text-sm font-medium'>Calculation Type</p>
                <p className='text-sm text-muted-foreground'>
                  {CALCULATION_TYPE_LABELS[currentRow.calculation_type]}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='w-full'>
                <p className='text-sm font-medium'>Rate</p>
                <p className='text-sm text-muted-foreground'>
                  {currentRow.calculation_type === 'percentage'
                    ? `${((currentRow.rate ?? 0) * 100).toFixed(2)}%`
                    : currentRow.calculation_type === 'fixed'
                      ? `${(currentRow.rate ?? 0).toLocaleString()} MZN`
                      : 'Tiered'}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='w-full'>
                <p className='text-sm font-medium'>Price Multiplier</p>
                <p className='text-sm text-muted-foreground'>
                  ×{(currentRow.price_multiplier ?? 1.0).toFixed(2)}
                </p>
              </div>
            </div>

            {(currentRow.minimum_amount || currentRow.maximum_amount) && (
              <div className='flex items-start gap-3'>
                <div className='w-full'>
                  <p className='text-sm font-medium'>Amount Limits</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.minimum_amount &&
                      `Min: ${Number(currentRow.minimum_amount).toLocaleString()} MZN`}
                    {currentRow.minimum_amount && currentRow.maximum_amount && ' | '}
                    {currentRow.maximum_amount &&
                      `Max: ${Number(currentRow.maximum_amount).toLocaleString()} MZN`}
                  </p>
                </div>
              </div>
            )}

            <div className='flex items-start gap-3'>
              <div className='w-full'>
                <p className='text-sm font-medium'>Priority</p>
                <p className='text-sm text-muted-foreground'>
                  {currentRow.priority}
                </p>
              </div>
            </div>

            {currentRow.calculation_type === 'tiered' && currentRow.tiered_rates && Array.isArray(currentRow.tiered_rates) && currentRow.tiered_rates.length > 0 && (
              <div className='flex items-start gap-3'>
                <div className='w-full'>
                  <p className='text-sm font-medium mb-2'>Tiered Rates</p>
                  <div className='space-y-2'>
                    {currentRow.tiered_rates.map((tier, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between rounded-md border p-2 text-sm'
                      >
                        <span className='text-muted-foreground'>
                          {Number(tier.min ?? 0).toLocaleString()} - {Number(tier.max ?? 0).toLocaleString()} MZN
                        </span>
                        <span className='font-medium'>{Number(tier.rate ?? 0).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground'>
            <span>
              Created: {new Date(currentRow.created_at).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>
              Updated: {new Date(currentRow.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={handleClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              setOpen('edit')
            }}
          >
            Edit Rule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
