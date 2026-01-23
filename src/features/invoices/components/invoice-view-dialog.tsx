// Invoice View Dialog
import { INVOICE_STATUSES } from '@/types/invoice'
import { DollarSign, Calendar, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useInvoices } from './invoices-provider'

const statusColors: Record<string, string> = {
  draft: 'secondary',
  sent: 'default',
  paid: 'success',
  overdue: 'destructive',
  cancelled: 'outline',
}

export function InvoiceViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useInvoices()

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
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-2xl font-semibold'>
                  {currentRow.invoice_number}
                </h3>
              </div>
              <Badge variant={statusColors[currentRow.status] as any}>
                {INVOICE_STATUSES[currentRow.status]}
              </Badge>
            </div>
          </div>

          <div className='grid gap-4'>
            <div className='flex items-start gap-3'>
              <DollarSign className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Financial Details</p>
                <div className='mt-1 grid grid-cols-3 gap-2'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Amount</p>
                    <p className='text-sm font-semibold'>
                      ${currentRow.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Tax</p>
                    <p className='text-sm font-semibold'>
                      ${currentRow.tax_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Total</p>
                    <p className='text-lg font-bold'>
                      ${currentRow.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Calendar className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Important Dates</p>
                <div className='mt-1 grid grid-cols-2 gap-2'>
                  {currentRow.due_date && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Due Date</p>
                      <p className='text-sm'>
                        {new Date(currentRow.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {currentRow.paid_date && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Paid Date</p>
                      <p className='text-sm'>
                        {new Date(currentRow.paid_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
            Edit Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
