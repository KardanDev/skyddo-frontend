// Documents Dialogs Orchestration
import { useDeleteDocument } from '@/hooks/api/use-documents'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DocumentFormDialog } from './document-form-dialog'
import { DocumentViewDialog } from './document-view-dialog'
import { useDocuments } from './documents-provider'

export function DocumentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDocuments()
  const deleteMutation = useDeleteDocument()

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
      <DocumentFormDialog />
      <DocumentViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Document'
        description={`Are you sure you want to delete "${currentRow?.file_name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
