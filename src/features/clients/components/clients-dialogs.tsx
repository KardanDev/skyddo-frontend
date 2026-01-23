// Clients Dialogs Orchestration
import { useDeleteClient } from '@/hooks/api/use-clients'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ClientFormDialog } from './client-form-dialog'
import { ClientViewDialog } from './client-view-dialog'
import { useClients } from './clients-provider'

export function ClientsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useClients()
  const deleteMutation = useDeleteClient()

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
      <ClientFormDialog />
      <ClientViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Client'
        description={`Are you sure you want to delete "${currentRow?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
