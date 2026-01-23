// Pricing Rules Table Toolbar
import type { Table } from '@tanstack/react-table'
import type { PricingRule } from '@/types/pricing-rule'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'

interface DataTableToolbarProps {
  table: Table<PricingRule>
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Get unique values for filters
  const calculationTypes = Array.from(
    table.getColumn('calculation_type')?.getFacetedUniqueValues()?.keys() ?? []
  ).map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value: value,
  }))

  const statuses = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ]

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Search by insurance type...'
          value={
            (table.getColumn('insuranceType')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('insuranceType')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {table.getColumn('calculation_type') && calculationTypes.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn('calculation_type')}
            title='Type'
            options={calculationTypes}
          />
        )}

        {table.getColumn('is_active') && (
          <DataTableFacetedFilter
            column={table.getColumn('is_active')}
            title='Status'
            options={statuses}
          />
        )}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
