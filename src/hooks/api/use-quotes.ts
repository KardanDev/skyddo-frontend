// Quotes Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Quote,
  type CreateQuoteInput,
  type UpdateQuoteInput,
  type QuoteStatus,
} from '@/types/quote'
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
const quoteKeys = {
  all: ['quotes'] as const,
  lists: () => [...quoteKeys.all, 'list'] as const,
  list: (filters: string) => [...quoteKeys.lists(), { filters }] as const,
  details: () => [...quoteKeys.all, 'detail'] as const,
  detail: (id: number) => [...quoteKeys.details(), id] as const,
}

// Get all quotes
export function useQuotes() {
  return useQuery({
    queryKey: quoteKeys.lists(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Quote>>(
        API_ENDPOINTS.QUOTES
      )
      return response.data.data
    },
  })
}

// Get single quote
export function useQuote(id: number) {
  return useQuery({
    queryKey: quoteKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Quote>(API_ENDPOINTS.QUOTE(id))
      return response.data
    },
    enabled: !!id,
  })
}

// Create quote
export function useCreateQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateQuoteInput) => {
      const response = await api.post<Quote>(API_ENDPOINTS.QUOTES, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      toast.success('Quote created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create quote'
      toast.error(message)
    },
  })
}

// Update quote
export function useUpdateQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateQuoteInput
    }) => {
      const response = await api.put<Quote>(API_ENDPOINTS.QUOTE(id), data)
      return response.data
    },
    onSuccess: (updatedQuote) => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.setQueryData(quoteKeys.detail(updatedQuote.id), updatedQuote)
      toast.success('Quote updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update quote'
      toast.error(message)
    },
  })
}

// Delete quote
export function useDeleteQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.QUOTE(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.removeQueries({ queryKey: quoteKeys.detail(deletedId) })
      toast.success('Quote deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete quote'
      toast.error(message)
    },
  })
}

// Update quote status (using update endpoint with status field)
export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: QuoteStatus }) => {
      const response = await api.put<Quote>(API_ENDPOINTS.QUOTE(id), { status })
      return response.data
    },
    onSuccess: (updatedQuote) => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.setQueryData(quoteKeys.detail(updatedQuote.id), updatedQuote)
      toast.success(`Quote status updated to ${updatedQuote.status}`)
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update quote status'
      toast.error(message)
    },
  })
}

// Send quote to insurer
export function useSendQuoteToInsurer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<Quote>(
        API_ENDPOINTS.QUOTE_SEND_TO_INSURER(id)
      )
      return response.data
    },
    onSuccess: (updatedQuote) => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.setQueryData(quoteKeys.detail(updatedQuote.id), updatedQuote)
      toast.success('Quote sent to insurer')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to send quote to insurer'
      toast.error(message)
    },
  })
}

// Approve quote
export function useApproveQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<Quote>(API_ENDPOINTS.QUOTE_APPROVE(id))
      return response.data
    },
    onSuccess: (updatedQuote) => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.setQueryData(quoteKeys.detail(updatedQuote.id), updatedQuote)
      toast.success('Quote approved')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to approve quote'
      toast.error(message)
    },
  })
}

// Convert quote to policy
export function useConvertQuoteToPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(API_ENDPOINTS.QUOTE_CONVERT_TO_POLICY(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast.success('Quote converted to policy successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to convert quote to policy'
      toast.error(message)
    },
  })
}
