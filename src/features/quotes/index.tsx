// Quotes Page
import { useState } from 'react'
import { Plus, FileDown, Settings } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useQuotes as useQuotesData } from '@/hooks/api/use-quotes'
import { Button } from '@/components/ui/button'
import { CsvImportExportDrawer } from '@/components/csv-import-export-drawer'
import { QuotesDialogs } from './components/quotes-dialogs'
import { QuotesProvider, useQuotes } from './components/quotes-provider'
import { QuotesTable } from './components/quotes-table'

function QuotesContent() {
  const { setOpen } = useQuotes()
  const { data: quotes, isLoading, refetch } = useQuotesData()
  const [csvDrawerOpen, setCsvDrawerOpen] = useState(false)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='flex h-[450px] items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]' />
          <p className='mt-2 text-sm text-muted-foreground'>
            Loading quotes...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
            Quotes
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Manage insurance quotes
          </p>
        </div>
        <div className='flex w-full gap-2 sm:w-auto'>
          <Button
            variant='outline'
            onClick={() => setCsvDrawerOpen(true)}
            className='flex-1 sm:flex-initial'
          >
            <FileDown className='mr-2 h-4 w-4' />
            Import/Export
          </Button>
          <Button
            variant='outline'
            onClick={() => navigate({ to: '/quotes/rules' })}
            className='flex-1 sm:flex-initial'
          >
            <Settings className='mr-2 h-4 w-4' />
            Pricing Rules
          </Button>
          <Button
            onClick={() => setOpen('create')}
            className='flex-1 sm:flex-initial'
          >
            <Plus className='mr-2 h-4 w-4' />
            New Quote
          </Button>
        </div>
      </div>

      <QuotesTable data={quotes || []} />
      <QuotesDialogs />
      <CsvImportExportDrawer
        open={csvDrawerOpen}
        onOpenChange={setCsvDrawerOpen}
        resourceType='quotes'
        resourceName='Quotes'
        onImportComplete={() => refetch()}
      />
    </div>
  )
}

export default function QuotesPage() {
  return (
    <QuotesProvider>
      <QuotesContent />
    </QuotesProvider>
  )
}
