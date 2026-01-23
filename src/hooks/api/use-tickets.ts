// Tickets Hooks (STATIC DATA - Frontend Only)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockTickets } from '@/data/tickets'
import {
  type Ticket,
  type CreateTicketInput,
  type UpdateTicketInput,
  type TicketStatus,
  type TicketResponse,
  type CreateTicketResponseInput,
} from '@/types/ticket'
import { toast } from 'sonner'
import { delay } from '@/lib/api/types'

// Query key factory
const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: string) => [...ticketKeys.lists(), { filters }] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: number) => [...ticketKeys.details(), id] as const,
  responses: (id: number) => [...ticketKeys.detail(id), 'responses'] as const,
}

// Get all tickets
export function useTickets() {
  return useQuery({
    queryKey: ticketKeys.lists(),
    queryFn: async () => {
      await delay(500)
      return mockTickets
    },
  })
}

// Get single ticket
export function useTicket(id: number) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: async () => {
      await delay(300)
      const ticket = mockTickets.find((t) => t.id === id)
      if (!ticket) throw new Error('Ticket not found')
      return ticket
    },
    enabled: !!id,
  })
}

// Get ticket responses
export function useTicketResponses(ticketId: number) {
  return useQuery({
    queryKey: ticketKeys.responses(ticketId),
    queryFn: async () => {
      await delay(400)
      // Mock responses - in real app, this would fetch from backend
      const mockResponses: TicketResponse[] = []
      return mockResponses
    },
    enabled: !!ticketId,
  })
}

// Create ticket
export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTicketInput) => {
      await delay(800)

      const ticketNumber = `TKT-${new Date().getFullYear()}-${String(Math.max(...mockTickets.map((t) => t.id)) + 1).padStart(5, '0')}`

      const newTicket: Ticket = {
        id: Math.max(...mockTickets.map((t) => t.id)) + 1,
        ticket_number: ticketNumber,
        client_id: data.client_id || null,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        status: 'open',
        assigned_to: data.assigned_to || null,
        created_by: 1, // Current user ID (would come from auth store)
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: {
          id: 1,
          name: 'Current User',
        },
        responses_count: 0,
      }
      return newTicket
    },
    onSuccess: (newTicket) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.lists(), (old) => {
        return old ? [newTicket, ...old] : [newTicket]
      })
      toast.success('Ticket created successfully')
    },
  })
}

// Update ticket
export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateTicketInput
    }) => {
      await delay(800)
      const existingTicket = mockTickets.find((t) => t.id === id)
      if (!existingTicket) throw new Error('Ticket not found')

      const updatedTicket: Ticket = {
        ...existingTicket,
        ...data,
        updated_at: new Date().toISOString(),
      }
      return updatedTicket
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.lists(), (old) => {
        return old
          ? old.map((ticket) =>
              ticket.id === updatedTicket.id ? updatedTicket : ticket
            )
          : [updatedTicket]
      })
      queryClient.setQueryData(
        ticketKeys.detail(updatedTicket.id),
        updatedTicket
      )
      toast.success('Ticket updated successfully')
    },
  })
}

// Delete ticket
export function useDeleteTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await delay(500)
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.lists(), (old) => {
        return old ? old.filter((ticket) => ticket.id !== deletedId) : []
      })
      queryClient.removeQueries({ queryKey: ticketKeys.detail(deletedId) })
      toast.success('Ticket deleted successfully')
    },
  })
}

// Update ticket status
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number
      status: TicketStatus
    }) => {
      await delay(600)
      const existingTicket = mockTickets.find((t) => t.id === id)
      if (!existingTicket) throw new Error('Ticket not found')

      const updatedTicket: Ticket = {
        ...existingTicket,
        status,
        updated_at: new Date().toISOString(),
      }
      return updatedTicket
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.lists(), (old) => {
        return old
          ? old.map((ticket) =>
              ticket.id === updatedTicket.id ? updatedTicket : ticket
            )
          : [updatedTicket]
      })
      queryClient.setQueryData(
        ticketKeys.detail(updatedTicket.id),
        updatedTicket
      )
      toast.success(`Ticket status updated to ${updatedTicket.status}`)
    },
  })
}

// Assign ticket
export function useAssignTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      assigned_to,
    }: {
      id: number
      assigned_to: number | null
    }) => {
      await delay(600)
      const existingTicket = mockTickets.find((t) => t.id === id)
      if (!existingTicket) throw new Error('Ticket not found')

      const updatedTicket: Ticket = {
        ...existingTicket,
        assigned_to,
        updated_at: new Date().toISOString(),
      }
      return updatedTicket
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData<Ticket[]>(ticketKeys.lists(), (old) => {
        return old
          ? old.map((ticket) =>
              ticket.id === updatedTicket.id ? updatedTicket : ticket
            )
          : [updatedTicket]
      })
      queryClient.setQueryData(
        ticketKeys.detail(updatedTicket.id),
        updatedTicket
      )
      toast.success('Ticket assigned successfully')
    },
  })
}

// Create ticket response
export function useCreateTicketResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTicketResponseInput) => {
      await delay(700)

      const newResponse: TicketResponse = {
        id: Math.floor(Math.random() * 10000),
        ticket_id: data.ticket_id,
        user_id: 1, // Current user
        message: data.message,
        is_internal: data.is_internal || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 1,
          name: 'Current User',
        },
      }
      return newResponse
    },
    onSuccess: (newResponse) => {
      queryClient.setQueryData<TicketResponse[]>(
        ticketKeys.responses(newResponse.ticket_id),
        (old) => {
          return old ? [...old, newResponse] : [newResponse]
        }
      )

      // Update ticket response count
      queryClient.setQueryData<Ticket>(
        ticketKeys.detail(newResponse.ticket_id),
        (old) => {
          if (!old) return old
          return {
            ...old,
            responses_count: (old.responses_count || 0) + 1,
          }
        }
      )

      toast.success('Response added successfully')
    },
  })
}
