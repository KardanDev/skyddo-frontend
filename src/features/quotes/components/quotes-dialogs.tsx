// Quotes Dialogs Orchestration
import { toast } from 'sonner'
import { useDeleteQuote, useConvertQuoteToPolicy } from '@/hooks/api/use-quotes'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { QuoteFormDialog } from './quote-form-dialog'
import { QuoteViewDialog } from './quote-view-dialog'
import { useQuotes } from './quotes-provider'

export function QuotesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useQuotes()
  const deleteMutation = useDeleteQuote()
  const convertMutation = useConvertQuoteToPolicy()

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

  const handleConvert = () => {
    if (currentRow) {
      convertMutation.mutate(currentRow.id, {
        onSuccess: () => {
          setOpen(null)
          setTimeout(() => setCurrentRow(null), 300)
          toast.success('Quote converted to policy successfully')
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
      <QuoteFormDialog />
      <QuoteViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Quote'
        description={`Are you sure you want to delete this quote? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
      <ConfirmDialog
        open={open === 'convert'}
        onOpenChange={handleCloseDelete}
        title='Convert to Policy'
        description={`Are you sure you want to convert this quote to a policy?`}
        onConfirm={handleConvert}
        loading={convertMutation.isPending}
      />
    </>
  )
}
