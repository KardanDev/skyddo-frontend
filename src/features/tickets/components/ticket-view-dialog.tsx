// Ticket View Dialog
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@/types/ticket'
import { User, AlertCircle, Calendar, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTickets } from './tickets-provider'

const priorityColors: Record<string, string> = {
  low: 'secondary',
  medium: 'default',
  high: 'default',
  urgent: 'destructive',
}

const statusColors: Record<string, string> = {
  open: 'default',
  in_progress: 'default',
  resolved: 'success',
  closed: 'outline',
}

export function TicketViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useTickets()

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
          <DialogTitle>Ticket Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-2xl font-semibold'>{currentRow.subject}</h3>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {currentRow.ticket_number}
                </p>
              </div>
              <div className='flex gap-2'>
                <Badge variant={priorityColors[currentRow.priority] as any}>
                  {TICKET_PRIORITIES[currentRow.priority]}
                </Badge>
                <Badge variant={statusColors[currentRow.status] as any}>
                  {TICKET_STATUSES[currentRow.status]}
                </Badge>
              </div>
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

            {currentRow.assignee && (
              <div className='flex items-start gap-3'>
                <User className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Assigned To</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.assignee.name}
                  </p>
                </div>
              </div>
            )}

            <div className='flex items-start gap-3'>
              <AlertCircle className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Description</p>
                <p className='text-sm text-muted-foreground'>
                  {currentRow.description}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Calendar className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Created</p>
                <p className='text-sm text-muted-foreground'>
                  {new Date(currentRow.created_at).toLocaleString()}
                </p>
                {currentRow.creator && (
                  <p className='text-xs text-muted-foreground'>
                    by {currentRow.creator.name}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <MessageSquare className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Responses</p>
                <p className='text-2xl font-bold'>
                  {currentRow.responses_count || 0}
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground'>
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
            Edit Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
