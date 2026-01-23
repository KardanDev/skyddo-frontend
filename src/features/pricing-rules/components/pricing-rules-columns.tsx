// Pricing Rules Table Columns
import type { ColumnDef } from '@tanstack/react-table'
import type { PricingRule } from '@/types/pricing-rule'
import { CALCULATION_TYPE_LABELS } from '@/types/pricing-rule'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const pricingRulesColumns: ColumnDef<PricingRule>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'insuranceType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Insurance Type' />
    ),
    cell: ({ row }) => {
      const insuranceType = row.original.insuranceType
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate font-medium'>
            {insuranceType?.name || 'N/A'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'vehicleType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vehicle Type' />
    ),
    cell: ({ row }) => {
      const vehicleType = row.original.vehicleType
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[150px] truncate text-muted-foreground'>
            {vehicleType?.name || 'All Vehicles'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'insurer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Insurer' />
    ),
    cell: ({ row }) => {
      const insurer = row.original.insurer
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[150px] truncate text-muted-foreground'>
            {insurer?.name || <Badge variant='outline'>Global Rule</Badge>}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'calculation_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('calculation_type') as string
      return (
        <Badge variant='secondary'>
          {CALCULATION_TYPE_LABELS[
            type as keyof typeof CALCULATION_TYPE_LABELS
          ] || type}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'rate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rate' />
    ),
    cell: ({ row }) => {
      const rate = row.getValue('rate') as number
      const type = row.original.calculation_type

      if (!rate && type !== 'tiered') {
        return <span className='text-muted-foreground'>N/A</span>
      }

      if (type === 'percentage') {
        return <span>{(rate * 100).toFixed(2)}%</span>
      } else if (type === 'fixed') {
        return <span>{rate.toLocaleString()} MZN</span>
      } else {
        return <span>Tiered</span>
      }
    },
  },
  {
    accessorKey: 'price_multiplier',
    id: 'price_multiplier',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Multiplier' />
    ),
    cell: ({ row }) => {
      const multiplier = row.getValue('price_multiplier') as number
      const multiplierValue = multiplier ?? 1.0

      return (
        <span
          className={
            multiplierValue !== 1 ? 'font-medium' : 'text-muted-foreground'
          }
        >
          ×{multiplierValue}
        </span>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = row.getValue('priority') as number
      return (
        <div className='flex items-center'>
          <span>{priority}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
