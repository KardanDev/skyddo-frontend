// Policy View Dialog
import { POLICY_STATUSES } from '@/types/policy'
import { User, Building2, DollarSign, Calendar, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePolicies } from './policies-provider'

const statusColors: Record<string, string> = {
  active: 'success',
  expired: 'destructive',
  cancelled: 'secondary',
  pending_renewal: 'default',
}

export function PolicyViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = usePolicies()

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
          <DialogTitle>Policy Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-2xl font-semibold'>
                  {currentRow.policy_number}
                </h3>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {currentRow.insurance_type}
                </p>
              </div>
              <Badge variant={statusColors[currentRow.status] as any}>
                {POLICY_STATUSES[currentRow.status]}
              </Badge>
            </div>
          </div>

          <div className='grid gap-4'>
            {currentRow.client && (
              <div className='flex items-start gap-3'>
                <User className='mt-0.5 h-4 w-4 text-muted-foreground' />
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

            <div className='flex items-start gap-3'>
              <DollarSign className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Financial Details</p>
                <div className='mt-1 grid grid-cols-2 gap-2'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Sum Insured</p>
                    <p className='text-sm font-semibold'>
                      ${currentRow.sum_insured.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Premium</p>
                    <p className='text-sm font-semibold'>
                      ${currentRow.premium.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Calendar className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Policy Period</p>
                <div className='mt-1 grid grid-cols-2 gap-2'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Start Date</p>
                    <p className='text-sm'>
                      {new Date(currentRow.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>End Date</p>
                    <p className='text-sm'>
                      {new Date(currentRow.end_date).toLocaleDateString()}
                    </p>
                  </div>
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

          <div className='border-t pt-4'>
            <p className='mb-3 text-sm font-medium'>Statistics</p>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>
                  {currentRow.claims_count || 0}
                </p>
                <p className='text-xs text-muted-foreground'>Claims</p>
              </div>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>
                  {currentRow.invoices_count || 0}
                </p>
                <p className='text-xs text-muted-foreground'>Invoices</p>
              </div>
            </div>
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
            Edit Policy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
