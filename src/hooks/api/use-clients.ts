// Clients Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Client,
  type CreateClientInput,
  type UpdateClientInput,
} from '@/types/client'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// Query key factory
const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: number) => [...clientKeys.details(), id] as const,
}

// Get all clients
export function useClients() {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Client>>(
        API_ENDPOINTS.CLIENTS
      )
      return response.data.data
    },
  })
}

// Get single client
export function useClient(id: number) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Client>(API_ENDPOINTS.CLIENT(id))
      return response.data
    },
    enabled: !!id,
  })
}

// Create client
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const response = await api.post<Client>(API_ENDPOINTS.CLIENTS, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      toast.success('Client created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create client'
      toast.error(message)
    },
  })
}

// Update client
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateClientInput
    }) => {
      const response = await api.put<Client>(API_ENDPOINTS.CLIENT(id), data)
      return response.data
    },
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      queryClient.setQueryData(
        clientKeys.detail(updatedClient.id),
        updatedClient
      )
      toast.success('Client updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update client'
      toast.error(message)
    },
  })
}

// Delete client
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.CLIENT(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      queryClient.removeQueries({ queryKey: clientKeys.detail(deletedId) })
      toast.success('Client deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete client'
      toast.error(message)
    },
  })
}
