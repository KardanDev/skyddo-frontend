// Invoices Dialogs Orchestration
import { toast } from 'sonner'
import {
  useDeleteInvoice,
  useMarkInvoiceAsPaid,
} from '@/hooks/api/use-invoices'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { InvoiceFormDialog } from './invoice-form-dialog'
import { InvoiceViewDialog } from './invoice-view-dialog'
import { useInvoices } from './invoices-provider'

export function InvoicesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useInvoices()
  const deleteMutation = useDeleteInvoice()
  const markPaidMutation = useMarkInvoiceAsPaid()

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

  const handleMarkPaid = () => {
    if (currentRow) {
      markPaidMutation.mutate(currentRow.id, {
        onSuccess: () => {
          setOpen(null)
          setTimeout(() => setCurrentRow(null), 300)
          toast.success('Invoice marked as paid')
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
      <InvoiceFormDialog />
      <InvoiceViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Invoice'
        description={`Are you sure you want to delete invoice "${currentRow?.invoice_number}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
      <ConfirmDialog
        open={open === 'mark_paid'}
        onOpenChange={handleCloseDelete}
        title='Mark as Paid'
        description={`Are you sure you want to mark invoice "${currentRow?.invoice_number}" as paid?`}
        onConfirm={handleMarkPaid}
        loading={markPaidMutation.isPending}
      />
    </>
  )
}
