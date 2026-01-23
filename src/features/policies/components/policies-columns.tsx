// Policies Table Columns
import { type ColumnDef } from '@tanstack/react-table'
import { type Policy, POLICY_STATUSES } from '@/types/policy'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

const statusColors: Record<string, string> = {
  active: 'success',
  expired: 'destructive',
  cancelled: 'secondary',
  pending_renewal: 'default',
}

// Helper to check if policy is expiring soon (within 30 days)
const isExpiringSoon = (endDate: string) => {
  const end = new Date(endDate)
  const now = new Date()
  const daysUntilExpiry = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30
}

export const policiesColumns: ColumnDef<Policy>[] = [
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
    accessorKey: 'policy_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Policy Number' />
    ),
    cell: ({ row }) => {
      const expiring = isExpiringSoon(row.original.end_date)
      return (
        <div className='flex items-center space-x-2'>
          <span className='max-w-[200px] truncate font-medium'>
            {row.getValue('policy_number')}
          </span>
          {expiring && (
            <AlertCircle
              className='h-4 w-4 text-orange-500'
              title='Expiring soon'
            />
          )}
        </div>
      )
    },
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
          <span className='max-w-[200px] truncate'>
            {client?.name || 'N/A'}
          </span>
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
    accessorKey: 'premium',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Premium' />
    ),
    cell: ({ row }) => {
      const premium = row.getValue('premium') as number
      return (
        <div className='flex items-center'>
          <span>${premium.toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('start_date'))
      return (
        <div className='flex items-center'>
          <span>{date.toLocaleDateString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('end_date'))
      return (
        <div className='flex items-center'>
          <span>{date.toLocaleDateString()}</span>
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
          {POLICY_STATUSES[status as keyof typeof POLICY_STATUSES]}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
