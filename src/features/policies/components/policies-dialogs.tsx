// Policies Dialogs Orchestration
import { toast } from 'sonner'
import { useDeletePolicy, useRenewPolicy } from '@/hooks/api/use-policies'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { usePolicies } from './policies-provider'
import { PolicyFormDialog } from './policy-form-dialog'
import { PolicyViewDialog } from './policy-view-dialog'

export function PoliciesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePolicies()
  const deleteMutation = useDeletePolicy()
  const renewMutation = useRenewPolicy()

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

  const handleRenew = () => {
    if (currentRow) {
      renewMutation.mutate(currentRow.id, {
        onSuccess: () => {
          setOpen(null)
          setTimeout(() => setCurrentRow(null), 300)
          toast.success('Policy renewed successfully')
        },
      })
    }
  }

  const handleCloseDelete = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  return (
    <>
      <PolicyFormDialog />
      <PolicyViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Policy'
        description={`Are you sure you want to delete policy "${currentRow?.policy_number}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
      <ConfirmDialog
        open={open === 'renew'}
        onOpenChange={handleCloseDelete}
        title='Renew Policy'
        description={`Are you sure you want to renew policy "${currentRow?.policy_number}"?`}
        onConfirm={handleRenew}
        loading={renewMutation.isPending}
      />
    </>
  )
}
