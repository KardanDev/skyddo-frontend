// Claim View Dialog
import { CLAIM_STATUSES } from '@/types/claim'
import { FileText, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useClaims } from './claims-provider'

const statusColors: Record<string, string> = {
  submitted: 'default',
  under_review: 'secondary',
  approved: 'success',
  partially_approved: 'default',
  rejected: 'destructive',
  closed: 'outline',
}

export function ClaimViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useClaims()

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
          <DialogTitle>Claim Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-2xl font-semibold'>
                  {currentRow.claim_number}
                </h3>
                {currentRow.policy && (
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Policy: {currentRow.policy.policy_number}
                  </p>
                )}
              </div>
              <Badge variant={statusColors[currentRow.status] as any}>
                {CLAIM_STATUSES[currentRow.status]}
              </Badge>
            </div>
          </div>

          <div className='grid gap-4'>
            {currentRow.policy?.client && (
              <div className='flex items-start gap-3'>
                <FileText className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Client</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.policy.client.name}
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
                    <p className='text-xs text-muted-foreground'>
                      Claim Amount
                    </p>
                    <p className='text-sm font-semibold'>
                      ${currentRow.claim_amount.toLocaleString()}
                    </p>
                  </div>
                  {currentRow.approved_amount && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Approved</p>
                      <p className='text-sm font-semibold'>
                        ${currentRow.approved_amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Calendar className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Important Dates</p>
                <div className='mt-1 grid grid-cols-2 gap-2'>
                  {currentRow.incident_date && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Incident</p>
                      <p className='text-sm'>
                        {new Date(
                          currentRow.incident_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className='text-xs text-muted-foreground'>Submitted</p>
                    <p className='text-sm'>
                      {new Date(currentRow.submitted_date).toLocaleDateString()}
                    </p>
                  </div>
                  {currentRow.processed_date && (
                    <div>
                      <p className='text-xs text-muted-foreground'>Processed</p>
                      <p className='text-sm'>
                        {new Date(
                          currentRow.processed_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <AlertCircle className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Description</p>
                <p className='text-sm text-muted-foreground'>
                  {currentRow.description}
                </p>
              </div>
            </div>
          </div>

          <div className='border-t pt-4'>
            <p className='mb-3 text-sm font-medium'>Documents</p>
            <div className='space-y-1'>
              <p className='text-2xl font-bold'>
                {currentRow.documents_count || 0}
              </p>
              <p className='text-xs text-muted-foreground'>
                Uploaded documents
              </p>
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
            Edit Claim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
