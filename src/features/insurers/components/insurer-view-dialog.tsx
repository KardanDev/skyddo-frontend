// Insurer View Dialog
import { useState } from 'react'
import { Mail, Phone, MapPin, User, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useInsurers } from './insurers-provider'
import { InsurerInsuranceTypesDialog } from './insurer-insurance-types-dialog'

export function InsurerViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useInsurers()
  const [insuranceTypesDialogOpen, setInsuranceTypesDialogOpen] = useState(false)

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
          <DialogTitle>Insurer Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div>
            <div className='flex items-start justify-between'>
              <h3 className='text-2xl font-semibold'>{currentRow.name}</h3>
              <Badge variant={currentRow.is_active ? 'default' : 'secondary'}>
                {currentRow.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
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

            {currentRow.contact_person && (
              <div className='flex items-start gap-3'>
                <User className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Contact Person</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentRow.contact_person}
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
          </div>

          <div className='border-t pt-4'>
            <p className='mb-3 text-sm font-medium'>Statistics</p>
            <div className='grid grid-cols-2 gap-4'>
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

        <div className='mt-4 flex justify-between gap-2'>
          <Button
            variant='outline'
            onClick={() => setInsuranceTypesDialogOpen(true)}
          >
            <Settings className='mr-2 h-4 w-4' />
            Manage Insurance Types
          </Button>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                setOpen('edit')
              }}
            >
              Edit Insurer
            </Button>
          </div>
        </div>
      </DialogContent>
      {currentRow && (
        <InsurerInsuranceTypesDialog
          insurerId={currentRow.id}
          insurerName={currentRow.name}
          open={insuranceTypesDialogOpen}
          onOpenChange={setInsuranceTypesDialogOpen}
        />
      )}
    </Dialog>
  )
}
