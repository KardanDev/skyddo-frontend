// Ticket Row Actions
import { type Row } from '@tanstack/react-table'
import { type Ticket } from '@/types/ticket'
import {
  MoreHorizontal,
  Pen,
  Trash,
  Eye,
  UserPlus,
  MessageSquarePlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTickets } from './tickets-provider'

interface DataTableRowActionsProps {
  row: Row<Ticket>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useTickets()

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

  const handleAssign = () => {
    setCurrentRow(row.original)
    setOpen('assign')
  }

  const handleAddResponse = () => {
    setCurrentRow(row.original)
    setOpen('add_response')
  }

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
        <DropdownMenuItem onClick={handleAssign}>
          <UserPlus className='mr-2 h-4 w-4' />
          Assign
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddResponse}>
          <MessageSquarePlus className='mr-2 h-4 w-4' />
          Add Response
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
