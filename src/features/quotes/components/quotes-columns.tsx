// Quotes Table Columns
import { type ColumnDef } from '@tanstack/react-table'
import {
  type Quote,
  QUOTE_STATUSES,
  INSURANCE_TYPE_LABELS,
} from '@/types/quote'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

const statusColors: Record<string, string> = {
  pending: 'secondary',
  sent: 'default',
  approved: 'success',
  rejected: 'destructive',
  expired: 'outline',
}

export const quotesColumns: ColumnDef<Quote>[] = [
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
    id: 'client',
    accessorFn: (row) => row.client?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Client' />
    ),
    cell: ({ row }) => {
      const client = row.original.client
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate font-medium'>
            {client?.name || 'N/A'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'insuranceType',
    accessorFn: (row) => row.insuranceType?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Insurance Type' />
    ),
    cell: ({ row }) => {
      const insuranceType = row.original.insuranceType
      const vehicleType = row.original.vehicleType
      return (
        <div className='flex flex-col space-y-1'>
          <span className='max-w-[200px] truncate font-medium'>
            {insuranceType?.name || row.original.insurance_type || 'N/A'}
          </span>
          {vehicleType && (
            <span className='text-xs text-muted-foreground'>{vehicleType.name}</span>
          )}
        </div>
      )
    },
  },
  {
    id: 'insurer',
    accessorFn: (row) => row.insurer?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Insurer' />
    ),
    cell: ({ row }) => {
      const insurer = row.original.insurer
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate text-muted-foreground'>
            {insurer?.name || '-'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'asset_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Asset Value' />
    ),
    cell: ({ row }) => {
      const assetValue = row.getValue('asset_value') as number | null
      const sumInsured = row.original.sum_insured
      const amount = assetValue || sumInsured

      if (!amount) return <span className='text-muted-foreground'>N/A</span>

      return (
        <div className='flex items-center'>
          <span className='font-medium'>{amount.toLocaleString()} MZN</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'calculated_cost',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Insurance Cost' />
    ),
    cell: ({ row }) => {
      const calculatedCost = row.getValue('calculated_cost') as number | null
      const premium = row.original.premium
      const cost = calculatedCost || premium

      if (!cost) return <span className='text-muted-foreground'>N/A</span>

      return (
        <div className='flex items-center'>
          <span className='font-semibold text-green-600 dark:text-green-400'>
            {cost.toLocaleString()} MZN
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={statusColors[status] as any}>
          {QUOTE_STATUSES[status as keyof typeof QUOTE_STATUSES]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className='flex items-center'>
          <span>{date.toLocaleDateString()}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
