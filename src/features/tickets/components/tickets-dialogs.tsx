// Tickets Dialogs Orchestration
import { useState } from 'react'
import { toast } from 'sonner'
import {
  useDeleteTicket,
  useAssignTicket,
  useAddTicketResponse,
} from '@/hooks/api/use-tickets'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TicketFormDialog } from './ticket-form-dialog'
import { TicketViewDialog } from './ticket-view-dialog'
import { useTickets } from './tickets-provider'

export function TicketsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTickets()
  const deleteMutation = useDeleteTicket()
  const assignMutation = useAssignTicket()
  const addResponseMutation = useAddTicketResponse()

  const [assignedUserId, setAssignedUserId] = useState('')
  const [responseMessage, setResponseMessage] = useState('')

  const handleDelete = () => {
    if (currentRow) {
      deleteMutation.mutate(currentRow.id, {
        onSuccess: () => {
          setOpen(null)
          setTimeout(() => setCurrentRow(null), 300)
        },
      })
    }
  }

  const handleAssign = () => {
    if (currentRow && assignedUserId) {
      assignMutation.mutate(
        { id: currentRow.id, userId: Number(assignedUserId) },
        {
          onSuccess: () => {
            setOpen(null)
            setTimeout(() => {
              setCurrentRow(null)
              setAssignedUserId('')
            }, 300)
            toast.success('Ticket assigned successfully')
          },
        }
      )
    }
  }

  const handleAddResponse = () => {
    if (currentRow && responseMessage) {
      addResponseMutation.mutate(
        { ticketId: currentRow.id, message: responseMessage },
        {
          onSuccess: () => {
            setOpen(null)
            setTimeout(() => {
              setCurrentRow(null)
              setResponseMessage('')
            }, 300)
            toast.success('Response added successfully')
          },
        }
      )
    }
  }

  const handleClose = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
      setAssignedUserId('')
      setResponseMessage('')
    }, 300)
  }

  return (
    <>
      <TicketFormDialog />
      <TicketViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleClose}
        title='Delete Ticket'
        description={`Are you sure you want to delete ticket "${currentRow?.ticket_number}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
      <Dialog open={open === 'assign'} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign ticket {currentRow?.ticket_number} to a user
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>User ID</Label>
              <Input
                type='number'
                placeholder='Enter user ID'
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleClose}
              disabled={assignMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={assignMutation.isPending || !assignedUserId}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={open === 'add_response'} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Response</DialogTitle>
            <DialogDescription>
              Add a response to ticket {currentRow?.ticket_number}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Message</Label>
              <Textarea
                placeholder='Type your response...'
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className='min-h-[100px]'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleClose}
              disabled={addResponseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddResponse}
              disabled={addResponseMutation.isPending || !responseMessage}
            >
              Add Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
