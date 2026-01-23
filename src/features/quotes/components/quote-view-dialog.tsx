// Quote View Dialog
import { QUOTE_STATUSES } from '@/types/quote'
import { Mail, Building2, DollarSign, FileText, Car, Calculator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQuotes } from './quotes-provider'

const statusColors: Record<string, string> = {
  pending: 'secondary',
  sent: 'default',
  approved: 'success',
  rejected: 'destructive',
  expired: 'outline',
}

export function QuoteViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useQuotes()

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
          <DialogTitle>Quote Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-2xl font-semibold'>
                  {currentRow.insuranceType?.name || currentRow.insurance_type}
                </h3>
                {currentRow.vehicleType && (
                  <p className='mt-1 text-sm font-medium text-muted-foreground'>
                    {currentRow.vehicleType.name}
                  </p>
                )}
                <p className='mt-1 text-sm text-muted-foreground'>
                  Quote #{currentRow.id}
                </p>
              </div>
              <Badge variant={statusColors[currentRow.status] as any}>
                {QUOTE_STATUSES[currentRow.status]}
              </Badge>
            </div>
          </div>

          <div className='grid gap-4'>
            {currentRow.client && (
              <div className='flex items-start gap-3'>
                <Mail className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Client</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.client.name}
                  </p>
                  {currentRow.client.email && (
                    <p className='text-xs text-muted-foreground'>
                      {currentRow.client.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentRow.insurer && (
              <div className='flex items-start gap-3'>
                <Building2 className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Insurer</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.insurer.name}
                  </p>
                </div>
              </div>
            )}

            {(currentRow.asset_value || currentRow.calculated_cost || currentRow.sum_insured || currentRow.premium) && (
              <div className='flex items-start gap-3'>
                <DollarSign className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>Financial Details</p>
                  <div className='mt-2 grid grid-cols-2 gap-4'>
                    {currentRow.asset_value ? (
                      <div>
                        <p className='text-xs text-muted-foreground'>Asset Value</p>
                        <p className='text-sm font-semibold'>
                          {currentRow.asset_value.toLocaleString()} MZN
                        </p>
                      </div>
                    ) : currentRow.sum_insured ? (
                      <div>
                        <p className='text-xs text-muted-foreground'>Sum Insured</p>
                        <p className='text-sm font-semibold'>
                          {currentRow.sum_insured.toLocaleString()} MZN
                        </p>
                      </div>
                    ) : null}

                    {currentRow.calculated_cost ? (
                      <div>
                        <p className='text-xs text-muted-foreground'>Insurance Cost</p>
                        <p className='text-sm font-bold text-green-600 dark:text-green-400'>
                          {currentRow.calculated_cost.toLocaleString()} MZN
                        </p>
                      </div>
                    ) : currentRow.premium ? (
                      <div>
                        <p className='text-xs text-muted-foreground'>Premium</p>
                        <p className='text-sm font-bold text-green-600 dark:text-green-400'>
                          {currentRow.premium.toLocaleString()} MZN
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {currentRow.description && (
              <div className='flex items-start gap-3'>
                <FileText className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Description</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.description}
                  </p>
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
            Edit Quote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
