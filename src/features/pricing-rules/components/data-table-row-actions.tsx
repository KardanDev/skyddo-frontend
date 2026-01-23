// Pricing Rule Row Actions
import type { Row } from '@tanstack/react-table'
import type { PricingRule } from '@/types/pricing-rule'
import { MoreHorizontal, Pen, Trash, Eye, Copy, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePricingRules } from './pricing-rules-provider'
import { useTogglePricingRuleStatus, useDuplicatePricingRule } from '@/hooks/api/use-pricing-rules'

interface DataTableRowActionsProps {
  row: Row<PricingRule>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = usePricingRules()
  const toggleStatus = useTogglePricingRuleStatus()
  const duplicate = useDuplicatePricingRule()

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

  const handleToggleStatus = () => {
    toggleStatus.mutate(row.original.id)
  }

  const handleDuplicate = () => {
    duplicate.mutate(row.original.id)
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
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>
          <Eye className='mr-2 h-4 w-4' />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pen className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className='mr-2 h-4 w-4' />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggleStatus}>
          {row.original.is_active ? (
            <ToggleLeft className='mr-2 h-4 w-4' />
          ) : (
            <ToggleRight className='mr-2 h-4 w-4' />
          )}
          {row.original.is_active ? 'Deactivate' : 'Activate'}
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
