// Documents Page
import { Upload } from 'lucide-react'
import { useDocuments as useDocumentsData } from '@/hooks/api/use-documents'
import { Button } from '@/components/ui/button'
import { DocumentsDialogs } from './components/documents-dialogs'
import {
  DocumentsProvider,
  useDocuments,
} from './components/documents-provider'
import { DocumentsTable } from './components/documents-table'

function DocumentsContent() {
  const { setOpen } = useDocuments()
  const { data: documents, isLoading } = useDocumentsData()

  if (isLoading) {
    return (
      <div className='flex h-[450px] items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]' />
          <p className='mt-2 text-sm text-muted-foreground'>
            Loading documents...
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
            Documents
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Manage uploaded documents and files
          </p>
        </div>
        <Button onClick={() => setOpen('create')} className='w-full sm:w-auto'>
          <Upload className='mr-2 h-4 w-4' />
          Upload Document
        </Button>
      </div>

      <DocumentsTable data={documents || []} />
      <DocumentsDialogs />
    </div>
  )
}

export default function DocumentsPage() {
  return (
    <DocumentsProvider>
      <DocumentsContent />
    </DocumentsProvider>
  )
}
