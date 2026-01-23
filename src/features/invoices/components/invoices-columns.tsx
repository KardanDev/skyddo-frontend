// Invoices Table Columns
import { type ColumnDef } from '@tanstack/react-table'
import { type Invoice, INVOICE_STATUSES } from '@/types/invoice'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

const statusColors: Record<string, string> = {
  draft: 'secondary',
  sent: 'default',
  paid: 'success',
  overdue: 'destructive',
  cancelled: 'outline',
}

const isOverdue = (dueDate: string | null, status: string) => {
  if (!dueDate || status === 'paid' || status === 'cancelled') return false
  return new Date(dueDate) < new Date()
}

export const invoicesColumns: ColumnDef<Invoice>[] = [
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
    accessorKey: 'invoice_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Invoice Number' />
    ),
    cell: ({ row }) => {
      const overdue = isOverdue(row.original.due_date, row.original.status)
      return (
        <div className='flex items-center space-x-2'>
          <span className='max-w-[200px] truncate font-medium'>
            {row.getValue('invoice_number')}
          </span>
          {overdue && (
            <AlertCircle className='h-4 w-4 text-red-500' title='Overdue' />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Amount' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('total_amount') as number
      return (
        <div className='flex items-center'>
          <span className='font-semibold'>${amount.toLocaleString()}</span>
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
          {INVOICE_STATUSES[status as keyof typeof INVOICE_STATUSES]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Due Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('due_date') as string | null
      return (
        <div className='flex items-center'>
          <span>{date ? new Date(date).toLocaleDateString() : '-'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'paid_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Paid Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('paid_date') as string | null
      return (
        <div className='flex items-center'>
          <span>{date ? new Date(date).toLocaleDateString() : '-'}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
