// Pricing Rules Dialogs Orchestration
import { useDeletePricingRule } from '@/hooks/api/use-pricing-rules'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PricingRuleFormDialog } from './pricing-rule-form-dialog'
import { PricingRuleViewDialog } from './pricing-rule-view-dialog'
import { usePricingRules } from './pricing-rules-provider'

export function PricingRulesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePricingRules()
  const deleteMutation = useDeletePricingRule()

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
      <PricingRuleFormDialog />
      <PricingRuleViewDialog />
      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={handleCloseDelete}
        title='Delete Pricing Rule'
        description={`Are you sure you want to delete this pricing rule? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
