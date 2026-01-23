// Pricing Rules Page
import { Plus } from 'lucide-react'
import { usePricingRules as usePricingRulesData } from '@/hooks/api/use-pricing-rules'
import { Button } from '@/components/ui/button'
import { PricingRulesDialogs } from './components/pricing-rules-dialogs'
import { PricingRulesProvider, usePricingRules } from './components/pricing-rules-provider'
import { PricingRulesTable } from './components/pricing-rules-table'

function PricingRulesContent() {
  const { setOpen } = usePricingRules()
  const { data: pricingRules, isLoading } = usePricingRulesData({})

  if (isLoading) {
    return (
      <div className='flex h-[450px] items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]' />
          <p className='mt-2 text-sm text-muted-foreground'>
            Loading pricing rules...
          </p>
        </div>
      </div>
    )
  }

  const hasRules = pricingRules && pricingRules.length > 0

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
            Pricing Rules
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Manage insurance pricing calculation rules
          </p>
        </div>
        <div className='flex w-full gap-2 sm:w-auto'>
          <Button
            onClick={() => setOpen('create')}
            className='flex-1 sm:flex-initial'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Pricing Rule
          </Button>
        </div>
      </div>

      {!hasRules && !isLoading && (
        <div className='flex h-[450px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
          <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
            <h3 className='mt-4 text-lg font-semibold'>No pricing rules found</h3>
            <p className='mb-4 mt-2 text-sm text-muted-foreground'>
              Get started by creating your first pricing rule or run the database seeders
              to populate with sample data.
            </p>
            <Button onClick={() => setOpen('create')}>
              <Plus className='mr-2 h-4 w-4' />
              Create Pricing Rule
            </Button>
          </div>
        </div>
      )}

      {hasRules && <PricingRulesTable data={pricingRules} />}

      <PricingRulesDialogs />
    </div>
  )
}

export default function PricingRulesPage() {
  return (
    <PricingRulesProvider>
      <PricingRulesContent />
    </PricingRulesProvider>
  )
}
