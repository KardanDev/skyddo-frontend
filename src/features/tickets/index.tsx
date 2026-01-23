// Tickets Page
import { Plus } from 'lucide-react'
import { useTickets as useTicketsData } from '@/hooks/api/use-tickets'
import { Button } from '@/components/ui/button'
import { TicketsDialogs } from './components/tickets-dialogs'
import { TicketsProvider, useTickets } from './components/tickets-provider'
import { TicketsTable } from './components/tickets-table'

function TicketsContent() {
  const { setOpen } = useTickets()
  const { data: tickets, isLoading } = useTicketsData()

  if (isLoading) {
    return (
      <div className='flex h-[450px] items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]' />
          <p className='mt-2 text-sm text-muted-foreground'>
            Loading tickets...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
            Tickets
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Manage support tickets
          </p>
        </div>
        <Button onClick={() => setOpen('create')} className='w-full sm:w-auto'>
          <Plus className='mr-2 h-4 w-4' />
          Create Ticket
        </Button>
      </div>

      <TicketsTable data={tickets || []} />
      <TicketsDialogs />
    </div>
  )
}

export default function TicketsPage() {
  return (
    <TicketsProvider>
      <TicketsContent />
    </TicketsProvider>
  )
}
