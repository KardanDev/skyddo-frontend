// Document View Dialog
import { DOCUMENTABLE_TYPE_LABELS } from '@/types/document'
import { File, Download, User, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDocuments } from './documents-provider'

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function DocumentViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useDocuments()

  const isOpen = open === 'view'

  const handleClose = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 300)
  }

  const handleDownload = () => {
    if (currentRow) {
      window.open(currentRow.file_path, '_blank')
    }
  }

  if (!currentRow) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <h3 className='text-2xl font-semibold'>{currentRow.file_name}</h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              {
                DOCUMENTABLE_TYPE_LABELS[
                  currentRow.documentable_type as keyof typeof DOCUMENTABLE_TYPE_LABELS
                ]
              }
            </p>
          </div>

          <div className='grid gap-4'>
            <div className='flex items-start gap-3'>
              <File className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>File Information</p>
                <div className='mt-1 space-y-1'>
                  <p className='text-sm text-muted-foreground'>
                    Type: {currentRow.file_type}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Size: {formatFileSize(currentRow.file_size)}
                  </p>
                </div>
              </div>
            </div>

            {currentRow.uploader && (
              <div className='flex items-start gap-3'>
                <User className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Uploaded By</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.uploader.name}
                  </p>
                </div>
              </div>
            )}

            <div className='flex items-start gap-3'>
              <Calendar className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Upload Date</p>
                <p className='text-sm text-muted-foreground'>
                  {new Date(currentRow.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className='mr-2 h-4 w-4' />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
