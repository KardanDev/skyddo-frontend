// Insurer Insurance Types Management Dialog
import { useState, useEffect } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import {
  useInsurerInsuranceTypes,
  useSyncInsurerInsuranceTypes,
} from '@/hooks/api/use-insurers'
import { useInsuranceTypes } from '@/hooks/api/use-quote-calculator'

interface InsurerInsuranceTypesDialogProps {
  insurerId: number | null
  insurerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface InsuranceTypeMapping {
  insurance_type_id: number
  insurance_type_name: string
  is_active: boolean
  turnaround_days: number
}

export function InsurerInsuranceTypesDialog({
  insurerId,
  insurerName,
  open,
  onOpenChange,
}: InsurerInsuranceTypesDialogProps) {
  const { data: availableTypes, isLoading: typesLoading, error: typesError } = useInsuranceTypes()
  const { data: insurerData, isLoading: insurerLoading } = useInsurerInsuranceTypes(insurerId || 0)
  const syncMutation = useSyncInsurerInsuranceTypes()

  const [mappings, setMappings] = useState<Record<number, InsuranceTypeMapping>>({})

  useEffect(() => {
    if (availableTypes && open) {
      const initialMappings: Record<number, InsuranceTypeMapping> = {}

      availableTypes.forEach((type) => {
        const existingMapping = insurerData?.insuranceTypes?.find(
          (it: any) => it.id === type.id
        ) || insurerData?.insurance_types?.find(
          (it: any) => it.id === type.id
        )

        initialMappings[type.id] = {
          insurance_type_id: type.id,
          insurance_type_name: type.name,
          is_active: existingMapping ? (existingMapping.pivot?.is_active ?? false) : false,
          turnaround_days: existingMapping ? (existingMapping.pivot?.turnaround_days ?? 3) : 3,
        }
      })

      setMappings(initialMappings)
    }
  }, [availableTypes, insurerData, open])

  const handleToggle = (typeId: number, checked: boolean) => {
    setMappings((prev) => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        is_active: checked,
      },
    }))
  }

  const handleTurnaroundChange = (typeId: number, days: number) => {
    setMappings((prev) => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        turnaround_days: days,
      },
    }))
  }

  const handleSave = () => {
    if (!insurerId) return

    const activeTypes = Object.values(mappings)
      .filter((m) => m.is_active)
      .map((m) => ({
        insurance_type_id: m.insurance_type_id,
        is_active: true,
        turnaround_days: m.turnaround_days,
      }))

    syncMutation.mutate(
      {
        insurerId,
        insuranceTypes: activeTypes,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Manage Insurance Types</DialogTitle>
          <DialogDescription>
            Select which insurance types {insurerName} offers and set turnaround days for each.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {typesLoading || insurerLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : typesError ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <p className='text-sm text-destructive mb-2'>Failed to load insurance types</p>
              <p className='text-xs text-muted-foreground'>Please try again or contact support</p>
            </div>
          ) : Object.keys(mappings).length === 0 ? (
            <div className='flex items-center justify-center py-8'>
              <p className='text-sm text-muted-foreground'>No insurance types available</p>
            </div>
          ) : (
            Object.values(mappings).map((mapping) => (
              <div
                key={mapping.insurance_type_id}
                className='flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors'
              >
                <div className='flex items-center space-x-4 flex-1'>
                  <Checkbox
                    checked={mapping.is_active}
                    onCheckedChange={(checked) =>
                      handleToggle(mapping.insurance_type_id, !!checked)
                    }
                  />
                  <div className='flex-1'>
                    <Label className='text-base font-medium cursor-pointer'>
                      {mapping.insurance_type_name}
                    </Label>
                  </div>
                </div>

                {mapping.is_active && (
                  <div className='flex items-center gap-2'>
                    <Label className='text-sm text-muted-foreground whitespace-nowrap'>
                      Turnaround:
                    </Label>
                    <Input
                      type='number'
                      min='1'
                      max='365'
                      value={mapping.turnaround_days}
                      onChange={(e) =>
                        handleTurnaroundChange(
                          mapping.insurance_type_id,
                          Number(e.target.value)
                        )
                      }
                      className='w-20'
                    />
                    <span className='text-sm text-muted-foreground'>days</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={syncMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={syncMutation.isPending || typesLoading || insurerLoading || !!typesError}
          >
            {syncMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
