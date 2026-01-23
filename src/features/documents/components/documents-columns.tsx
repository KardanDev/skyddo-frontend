// Documents Table Columns
import { type ColumnDef } from '@tanstack/react-table'
import { type Document, DOCUMENTABLE_TYPE_LABELS } from '@/types/document'
import { File, FileText, FileImage, FileVideo } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <FileImage className='h-4 w-4' />
  if (fileType.startsWith('video/')) return <FileVideo className='h-4 w-4' />
  if (fileType.includes('pdf')) return <FileText className='h-4 w-4' />
  return <File className='h-4 w-4' />
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export const documentsColumns: ColumnDef<Document>[] = [
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
    accessorKey: 'file_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='File Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center space-x-2'>
          {getFileIcon(row.original.file_type)}
          <span className='max-w-[300px] truncate font-medium'>
            {row.getValue('file_name')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'file_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('file_type') as string
      return (
        <Badge variant='secondary'>
          {type.split('/')[1]?.toUpperCase() || 'FILE'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'file_size',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Size' />
    ),
    cell: ({ row }) => {
      const size = row.getValue('file_size') as number
      return (
        <div className='flex items-center'>
          <span className='text-muted-foreground'>{formatFileSize(size)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'documentable_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('documentable_type') as string
      return (
        <span className='text-sm'>
          {DOCUMENTABLE_TYPE_LABELS[
            type as keyof typeof DOCUMENTABLE_TYPE_LABELS
          ] || type}
        </span>
      )
    },
  },
  {
    accessorKey: 'uploader.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uploaded By' />
    ),
    cell: ({ row }) => {
      const uploader = row.original.uploader
      return (
        <span className='text-sm text-muted-foreground'>
          {uploader?.name || 'Unknown'}
        </span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uploaded' />
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
