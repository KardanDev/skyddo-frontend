// Document Form Dialog (Upload)
import { useState } from 'react'
import { Upload } from 'lucide-react'
import { useCreateDocument } from '@/hooks/api/use-documents'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DOCUMENTABLE_TYPE_OPTIONS } from '../data/data'
import { useDocuments } from './documents-provider'

export function DocumentFormDialog() {
  const { open, setOpen, setCurrentRow } = useDocuments()
  const createMutation = useCreateDocument()

  const [documentableType, setDocumentableType] = useState('')
  const [documentableId, setDocumentableId] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const isOpen = open === 'create'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file && documentableType && documentableId) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentable_type', documentableType)
      formData.append('documentable_id', documentableId)

      createMutation.mutate(
        {
          documentable_type: documentableType as any,
          documentable_id: Number(documentableId),
          file,
        },
        {
          onSuccess: () => {
            handleClose()
          },
        }
      )
    }
  }

  const handleClose = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
      setDocumentableType('')
      setDocumentableId('')
      setFile(null)
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label>Category *</Label>
            <Select
              value={documentableType}
              onValueChange={setDocumentableType}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENTABLE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Related Item ID *</Label>
            <Input
              type='number'
              placeholder='Enter ID'
              value={documentableId}
              onChange={(e) => setDocumentableId(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label>File *</Label>
            <div className='flex items-center gap-2'>
              <Input
                type='file'
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Upload className='h-4 w-4 text-muted-foreground' />
            </div>
            {file && (
              <p className='text-sm text-muted-foreground'>
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                createMutation.isPending ||
                !file ||
                !documentableType ||
                !documentableId
              }
            >
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
