// CSV Import/Export Drawer Component
import { useState } from 'react'
import { type AxiosError } from 'axios'
import {
  Download,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

interface CsvImportExportDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceType: string
  resourceName: string
  onImportComplete?: () => void
}

interface ImportResult {
  message: string
  imported?: number
  total_rows?: number
  errors?: Array<{
    row: number
    errors: Record<string, string[]>
  }>
  summary?: {
    total_rows: number
    valid_rows: number
    error_rows: number
  }
}

export function CsvImportExportDrawer({
  open,
  onOpenChange,
  resourceType,
  resourceName,
  onImportComplete,
}: CsvImportExportDrawerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file')
        return
      }
      setSelectedFile(file)
      setImportResult(null)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get(`/api/${resourceType}-csv-template`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${resourceType}_template.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Template downloaded successfully')
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      toast.error(
        axiosError.response?.data?.message || 'Failed to download template'
      )
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import')
      return
    }

    setImporting(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await api.post<ImportResult>(
        `/api/${resourceType}-csv-import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setImportResult(response.data)

      if (response.data.imported && response.data.imported > 0) {
        toast.success(response.data.message)
        onImportComplete?.()
      }
    } catch (error) {
      const axiosError = error as AxiosError<ImportResult>
      const result = axiosError.response?.data
      if (result?.errors) {
        setImportResult(result)
        toast.error('Validation errors found in CSV')
      } else {
        toast.error(result?.message || 'Failed to import CSV')
      }
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)

    try {
      const response = await api.get<{ download_url: string; message: string }>(
        `/api/${resourceType}-csv-export`
      )

      // Extract filename from download_url
      const filename = response.data.download_url.split('/').pop()

      // Download the file
      const downloadResponse = await api.get(
        `/api/${resourceType}-csv-download/${filename}`,
        {
          responseType: 'blob',
        }
      )

      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename || `${resourceType}_export.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Export downloaded successfully')
      onOpenChange(false)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      toast.error(axiosError.response?.data?.message || 'Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setImportResult(null)
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className='mx-auto w-full max-w-2xl'>
          <DrawerHeader>
            <DrawerTitle>Import/Export {resourceName}</DrawerTitle>
            <DrawerDescription>
              Download a template, import data from CSV, or export existing data
            </DrawerDescription>
          </DrawerHeader>

          <div className='space-y-6 p-4'>
            {/* Download Template Section */}
            <div className='space-y-2'>
              <h3 className='flex items-center gap-2 font-semibold'>
                <FileText className='h-4 w-4' />
                Step 1: Download CSV Template
              </h3>
              <p className='text-sm text-muted-foreground'>
                Download the template to see the required format and example
                data
              </p>
              <Button
                variant='outline'
                onClick={handleDownloadTemplate}
                className='w-full'
              >
                <Download className='mr-2 h-4 w-4' />
                Download Template
              </Button>
            </div>

            {/* Import Section */}
            <div className='space-y-2'>
              <h3 className='flex items-center gap-2 font-semibold'>
                <Upload className='h-4 w-4' />
                Step 2: Import Data from CSV
              </h3>
              <p className='text-sm text-muted-foreground'>
                Select a CSV file to import. The file must match the template
                format.
              </p>

              <div className='flex gap-2'>
                <div className='flex-1'>
                  <input
                    type='file'
                    accept='.csv'
                    onChange={handleFileSelect}
                    className='hidden'
                    id='csv-file-input'
                  />
                  <label htmlFor='csv-file-input'>
                    <Button variant='outline' className='w-full' asChild>
                      <span>
                        {selectedFile ? selectedFile.name : 'Choose CSV File'}
                      </span>
                    </Button>
                  </label>
                </div>
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || importing}
                  className='min-w-[120px]'
                >
                  {importing ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className='mr-2 h-4 w-4' />
                      Import
                    </>
                  )}
                </Button>
              </div>

              {/* Import Results */}
              {importResult && (
                <div className='mt-4 space-y-2'>
                  {importResult.imported && importResult.imported > 0 && (
                    <Alert>
                      <CheckCircle2 className='h-4 w-4' />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>
                        {importResult.message}
                        {importResult.summary && (
                          <div className='mt-2 text-sm'>
                            <div>
                              Total rows: {importResult.summary.total_rows}
                            </div>
                            <div>
                              Valid rows: {importResult.summary.valid_rows}
                            </div>
                            <div>
                              Error rows: {importResult.summary.error_rows}
                            </div>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {importResult.errors && importResult.errors.length > 0 && (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Validation Errors</AlertTitle>
                      <AlertDescription>
                        <div className='mt-2 max-h-[200px] space-y-2 overflow-y-auto'>
                          {importResult.errors.slice(0, 5).map((error, idx) => (
                            <div key={idx} className='text-sm'>
                              <strong>Row {error.row}:</strong>
                              <ul className='ml-2 list-inside list-disc'>
                                {Object.entries(error.errors).map(
                                  ([field, messages]) => (
                                    <li key={field}>
                                      {field}: {messages.join(', ')}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ))}
                          {importResult.errors.length > 5 && (
                            <div className='text-sm italic'>
                              ... and {importResult.errors.length - 5} more
                              errors
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            {/* Export Section */}
            <div className='space-y-2'>
              <h3 className='flex items-center gap-2 font-semibold'>
                <Download className='h-4 w-4' />
                Export Data to CSV
              </h3>
              <p className='text-sm text-muted-foreground'>
                Export all existing {resourceName.toLowerCase()} to a CSV file
              </p>
              <Button
                variant='default'
                onClick={handleExport}
                disabled={exporting}
                className='w-full'
              >
                {exporting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className='mr-2 h-4 w-4' />
                    Export to CSV
                  </>
                )}
              </Button>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant='outline' onClick={handleClose}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
