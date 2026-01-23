// Claims Dialogs Orchestration
import { useState } from 'react'
import { type ClaimStatus } from '@/types/claim'
import { useDeleteClaim, useUpdateClaimStatus } from '@/hooks/api/use-claims'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CLAIM_STATUS_OPTIONS } from '../data/data'
import { ClaimFormDialog } from './claim-form-dialog'
import { ClaimViewDialog } from './claim-view-dialog'
import { useClaims } from './claims-provider'

export function ClaimsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useClaims()
  const deleteMutation = useDeleteClaim()
  const updateStatusMutation = useUpdateClaimStatus()
  const [newStatus, setNewStatus] = useState<ClaimStatus>('submitted')

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

  const handleUpdateStatus = () => {
    if (currentRow) {
      updateStatusMutation.mutate(
        { id: currentRow.id, status: newStatus },
        {
          onSuccess: () => {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 300)
          },
        }
      )
    }
  }

  const handleCloseDelete = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  return (
    <>
      <ClaimFormDialog />
      <ClaimViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Claim'
        description={`Are you sure you want to delete claim "${currentRow?.claim_number}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
      <Dialog
        open={open === 'update_status'}
        onOpenChange={() => handleCloseDelete()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Claim Status</DialogTitle>
            <DialogDescription>
              Change the status of claim {currentRow?.claim_number}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as ClaimStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select new status' />
              </SelectTrigger>
              <SelectContent>
                {CLAIM_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleCloseDelete}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
