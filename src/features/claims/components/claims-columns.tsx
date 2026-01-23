// Claims Table Columns
import { type ColumnDef } from '@tanstack/react-table'
import { type Claim, CLAIM_STATUSES } from '@/types/claim'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

const statusColors: Record<string, string> = {
  submitted: 'default',
  under_review: 'secondary',
  approved: 'success',
  partially_approved: 'default',
  rejected: 'destructive',
  closed: 'outline',
}

export const claimsColumns: ColumnDef<Claim>[] = [
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
    accessorKey: 'claim_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Claim Number' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate font-medium'>
            {row.getValue('claim_number')}
          </span>
        </div>
      )
    },
  },
  {
    id: 'client',
    accessorFn: (row) => row.policy?.client?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Client' />
    ),
    cell: ({ row }) => {
      const client = row.original.policy?.client
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
    id: 'policy',
    accessorFn: (row) => row.policy?.policy_number,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Policy' />
    ),
    cell: ({ row }) => {
      const policy = row.original.policy
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate text-muted-foreground'>
            {policy?.policy_number || '-'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'claim_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Claim Amount' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('claim_amount') as number
      return (
        <div className='flex items-center'>
          <span>${amount.toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'approved_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Approved' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('approved_amount') as number | null
      return (
        <div className='flex items-center'>
          <span>{amount ? `$${amount.toLocaleString()}` : '-'}</span>
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
          {CLAIM_STATUSES[status as keyof typeof CLAIM_STATUSES]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'submitted_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Submitted' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('submitted_date'))
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
