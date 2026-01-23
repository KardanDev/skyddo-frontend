// Invoices Page
import { useState } from 'react'
import { Plus, FileDown } from 'lucide-react'
import { useInvoices as useInvoicesData } from '@/hooks/api/use-invoices'
import { Button } from '@/components/ui/button'
import { CsvImportExportDrawer } from '@/components/csv-import-export-drawer'
import { InvoicesDialogs } from './components/invoices-dialogs'
import { InvoicesProvider, useInvoices } from './components/invoices-provider'
import { InvoicesTable } from './components/invoices-table'

function InvoicesContent() {
  const { setOpen } = useInvoices()
  const { data: invoices, isLoading, refetch } = useInvoicesData()
  const [csvDrawerOpen, setCsvDrawerOpen] = useState(false)

  if (isLoading) {
    return (
      <div className='flex h-[450px] items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]' />
          <p className='mt-2 text-sm text-muted-foreground'>
            Loading invoices...
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
            Invoices
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Manage invoices and payments
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
            onClick={() => setOpen('create')}
            className='flex-1 sm:flex-initial'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Invoice
          </Button>
        </div>
      </div>

      <InvoicesTable data={invoices || []} />
      <InvoicesDialogs />
      <CsvImportExportDrawer
        open={csvDrawerOpen}
        onOpenChange={setCsvDrawerOpen}
        resourceType='invoices'
        resourceName='Invoices'
        onImportComplete={() => refetch()}
      />
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <InvoicesProvider>
      <InvoicesContent />
    </InvoicesProvider>
  )
}
