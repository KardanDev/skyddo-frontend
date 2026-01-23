// Clients Table Columns
import { type ColumnDef } from '@tanstack/react-table'
import { type Client } from '@/types/client'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const clientsColumns: ColumnDef<Client>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('name')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string | null
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[300px] truncate text-muted-foreground'>
            {email || 'N/A'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate text-muted-foreground'>
            {phone || 'N/A'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'company_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => {
      const company = row.getValue('company_name') as string | null
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate text-muted-foreground'>
            {company || '-'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'policies_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Policies' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.getValue('policies_count') || 0}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'claims_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Claims' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.getValue('claims_count') || 0}</span>
        </div>
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
