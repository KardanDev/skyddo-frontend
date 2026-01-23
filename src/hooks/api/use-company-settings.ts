import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

// Types
export interface CompanySettings {
  id: number
  company_name: string
  company_email: string | null
  company_phone: string | null
  company_address: string | null
  website: string | null
  tax_id: string | null
  description: string | null
  logo_path: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface UpdateCompanySettingsInput {
  company_name: string
  company_email?: string
  company_phone?: string
  company_address?: string
  website?: string
  tax_id?: string
  description?: string
}

// Query Keys
const companySettingsKeys = {
  all: ['company-settings'] as const,
  detail: () => [...companySettingsKeys.all, 'detail'] as const,
}

/**
 * Fetch company settings
 */
export function useCompanySettings() {
  return useQuery({
    queryKey: companySettingsKeys.detail(),
    queryFn: async () => {
      const response = await api.get<CompanySettings>('/company-settings')
      return response.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Update company settings
 */
export function useUpdateCompanySettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateCompanySettingsInput) => {
      const response = await api.put<{
        message: string
        data: CompanySettings
      }>('/company-settings', input)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(companySettingsKeys.detail(), data.data)
      toast.success(data.message || 'Company settings updated successfully')
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update company settings'
      )
    },
  })
}

/**
 * Upload company logo
 */
export function useUploadCompanyLogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await api.post<{
        message: string
        data: { logo_path: string; logo_url: string }
      }>('/company-settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: companySettingsKeys.detail() })
      toast.success(data.message || 'Company logo uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to upload company logo'
      )
    },
  })
}

/**
 * Delete company logo
 */
export function useDeleteCompanyLogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<{ message: string }>(
        '/company-settings/logo'
      )
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: companySettingsKeys.detail() })
      toast.success(data.message || 'Company logo deleted successfully')
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete company logo'
      )
    },
  })
}
