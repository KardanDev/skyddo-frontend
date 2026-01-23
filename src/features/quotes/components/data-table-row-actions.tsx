// Quote Row Actions
import { type Row } from '@tanstack/react-table'
import { type Quote } from '@/types/quote'
import { MoreHorizontal, Pen, Trash, Eye, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQuotes } from './quotes-provider'

interface DataTableRowActionsProps {
  row: Row<Quote>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useQuotes()

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  const handleEdit = () => {
    setCurrentRow(row.original)
    setOpen('edit')
  }

  const handleDelete = () => {
    setCurrentRow(row.original)
    setOpen('delete')
  }

  const handleConvert = () => {
    setCurrentRow(row.original)
    setOpen('convert')
  }

  const canConvert = row.original.status === 'approved'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuItem onClick={handleView}>
          <Eye className='mr-2 h-4 w-4' />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pen className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        {canConvert && (
          <DropdownMenuItem onClick={handleConvert}>
            <FileCheck className='mr-2 h-4 w-4' />
            Convert to Policy
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
