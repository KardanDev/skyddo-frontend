// Insurers Dialogs Orchestration
import { useDeleteInsurer } from '@/hooks/api/use-insurers'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { InsurerFormDialog } from './insurer-form-dialog'
import { InsurerViewDialog } from './insurer-view-dialog'
import { useInsurers } from './insurers-provider'

export function InsurersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useInsurers()
  const deleteMutation = useDeleteInsurer()

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

  const handleCloseDelete = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  return (
    <>
      <InsurerFormDialog />
      <InsurerViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Insurer'
        description={`Are you sure you want to delete "${currentRow?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
