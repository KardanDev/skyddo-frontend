// Tickets Table Columns
import { type ColumnDef } from '@tanstack/react-table'
import { type Ticket, TICKET_PRIORITIES, TICKET_STATUSES } from '@/types/ticket'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

const priorityColors: Record<string, string> = {
  low: 'secondary',
  medium: 'default',
  high: 'default',
  urgent: 'destructive',
}

const statusColors: Record<string, string> = {
  open: 'default',
  in_progress: 'default',
  resolved: 'success',
  closed: 'outline',
}

export const ticketsColumns: ColumnDef<Ticket>[] = [
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
    accessorKey: 'ticket_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ticket #' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[150px] truncate font-medium'>
            {row.getValue('ticket_number')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subject' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[300px] truncate'>
            {row.getValue('subject')}
          </span>
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
          <span className='max-w-[200px] truncate text-muted-foreground'>
            {client?.name || '-'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string
      return (
        <Badge variant={priorityColors[priority] as any}>
          {TICKET_PRIORITIES[priority as keyof typeof TICKET_PRIORITIES]}
        </Badge>
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
          {TICKET_STATUSES[status as keyof typeof TICKET_STATUSES]}
        </Badge>
      )
    },
  },
  {
    id: 'assignee',
    accessorFn: (row) => row.assignee?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Assigned To' />
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignee
      return (
        <span className='text-sm text-muted-foreground'>
          {assignee?.name || 'Unassigned'}
        </span>
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
          <span className='text-sm'>{date.toLocaleDateString()}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
