// Client View Dialog
import { Mail, Phone, MapPin, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useClients } from './clients-provider'

export function ClientViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useClients()

  const isOpen = open === 'view'

  const handleClose = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 300)
  }

  if (!currentRow) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <h3 className='text-2xl font-semibold'>{currentRow.name}</h3>
            {currentRow.company_name && (
              <p className='mt-1 text-sm text-muted-foreground'>
                {currentRow.company_name}
              </p>
            )}
          </div>

          <div className='grid gap-4'>
            {currentRow.email && (
              <div className='flex items-start gap-3'>
                <Mail className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Email</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.email}
                  </p>
                </div>
              </div>
            )}

            {currentRow.phone && (
              <div className='flex items-start gap-3'>
                <Phone className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Phone</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.phone}
                  </p>
                </div>
              </div>
            )}

            {currentRow.address && (
              <div className='flex items-start gap-3'>
                <MapPin className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Address</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.address}
                  </p>
                </div>
              </div>
            )}

            {currentRow.id_number && (
              <div className='flex items-start gap-3'>
                <FileText className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>ID Number</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.id_number}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className='border-t pt-4'>
            <p className='mb-3 text-sm font-medium'>Statistics</p>
            <div className='grid grid-cols-4 gap-4'>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>
                  {currentRow.quotes_count || 0}
                </p>
                <p className='text-xs text-muted-foreground'>Quotes</p>
              </div>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>
                  {currentRow.policies_count || 0}
                </p>
                <p className='text-xs text-muted-foreground'>Policies</p>
              </div>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>
                  {currentRow.claims_count || 0}
                </p>
                <p className='text-xs text-muted-foreground'>Claims</p>
              </div>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>
                  {currentRow.invoices_count || 0}
                </p>
                <p className='text-xs text-muted-foreground'>Invoices</p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground'>
            <span>
              Created: {new Date(currentRow.created_at).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>
              Updated: {new Date(currentRow.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={handleClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              setOpen('edit')
            }}
          >
            Edit Client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
