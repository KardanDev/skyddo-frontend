// Invoices Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Invoice,
  type CreateInvoiceInput,
  type UpdateInvoiceInput,
  type InvoiceStatus,
} from '@/types/invoice'
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
const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: string) => [...invoiceKeys.lists(), { filters }] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: number) => [...invoiceKeys.details(), id] as const,
  overdue: () => [...invoiceKeys.all, 'overdue'] as const,
}

// Get all invoices
export function useInvoices() {
  return useQuery({
    queryKey: invoiceKeys.lists(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Invoice>>(
        API_ENDPOINTS.INVOICES
      )
      return response.data.data
    },
  })
}

// Get overdue invoices
export function useOverdueInvoices() {
  return useQuery({
    queryKey: invoiceKeys.overdue(),
    queryFn: async () => {
      const response = await api.get<Invoice[]>(API_ENDPOINTS.INVOICES_OVERDUE)
      return response.data
    },
  })
}

// Get single invoice
export function useInvoice(id: number) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Invoice>(API_ENDPOINTS.INVOICE(id))
      return response.data
    },
    enabled: !!id,
  })
}

// Create invoice
export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateInvoiceInput) => {
      const response = await api.post<Invoice>(API_ENDPOINTS.INVOICES, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
      toast.success('Invoice created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to create invoice'
      toast.error(message)
    },
  })
}

// Update invoice
export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateInvoiceInput
    }) => {
      const response = await api.put<Invoice>(API_ENDPOINTS.INVOICE(id), data)
      return response.data
    },
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
      queryClient.setQueryData(
        invoiceKeys.detail(updatedInvoice.id),
        updatedInvoice
      )
      toast.success('Invoice updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update invoice'
      toast.error(message)
    },
  })
}

// Delete invoice
export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.INVOICE(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
      queryClient.removeQueries({ queryKey: invoiceKeys.detail(deletedId) })
      toast.success('Invoice deleted successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to delete invoice'
      toast.error(message)
    },
  })
}

// Send invoice
export function useSendInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<Invoice>(API_ENDPOINTS.INVOICE_SEND(id))
      return response.data
    },
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
      queryClient.setQueryData(
        invoiceKeys.detail(updatedInvoice.id),
        updatedInvoice
      )
      toast.success('Invoice sent successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send invoice'
      toast.error(message)
    },
  })
}

// Record payment
export function useRecordPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, paidDate }: { id: number; paidDate?: string }) => {
      const response = await api.post<Invoice>(
        API_ENDPOINTS.INVOICE_PAYMENT(id),
        { paid_date: paidDate }
      )
      return response.data
    },
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
      queryClient.setQueryData(
        invoiceKeys.detail(updatedInvoice.id),
        updatedInvoice
      )
      toast.success('Payment recorded successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to record payment'
      toast.error(message)
    },
  })
}

// Update invoice status (using update endpoint with status field)
export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number
      status: InvoiceStatus
    }) => {
      const response = await api.put<Invoice>(API_ENDPOINTS.INVOICE(id), {
        status,
      })
      return response.data
    },
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
      queryClient.setQueryData(
        invoiceKeys.detail(updatedInvoice.id),
        updatedInvoice
      )
      toast.success(`Invoice status updated to ${updatedInvoice.status}`)
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update invoice status'
      toast.error(message)
    },
  })
}
