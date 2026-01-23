// Documents Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Document,
  type CreateDocumentInput,
  type UpdateDocumentInput,
} from '@/types/document'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

// Query key factory
const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: string) => [...documentKeys.lists(), { filters }] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: number) => [...documentKeys.details(), id] as const,
}

// Get all documents (Note: API may not have a general list endpoint, typically filtered by documentable)
export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: async () => {
      // Note: The API might not support listing all documents
      // This may need to be replaced with filtered queries by documentable_type/id
      const response = await api.get<Document[]>(API_ENDPOINTS.DOCUMENTS)
      return response.data
    },
  })
}

// Get single document
export function useDocument(id: number) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Document>(API_ENDPOINTS.DOCUMENT(id))
      return response.data
    },
    enabled: !!id,
  })
}

// Upload document
export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDocumentInput) => {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('name', data.name)
      formData.append('type', data.type)
      formData.append('documentable_type', data.documentable_type)
      formData.append('documentable_id', data.documentable_id.toString())

      const response = await api.post<Document>(
        API_ENDPOINTS.DOCUMENTS,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })
      toast.success('Document uploaded successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to upload document'
      toast.error(message)
    },
  })
}

// Update document (Note: API may not support updating documents)
export function useUpdateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateDocumentInput
    }) => {
      const response = await api.put<Document>(API_ENDPOINTS.DOCUMENT(id), data)
      return response.data
    },
    onSuccess: (updatedDocument) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })
      queryClient.setQueryData(
        documentKeys.detail(updatedDocument.id),
        updatedDocument
      )
      toast.success('Document updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update document'
      toast.error(message)
    },
  })
}

// Delete document
export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.DOCUMENT(id))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })
      queryClient.removeQueries({ queryKey: documentKeys.detail(deletedId) })
      toast.success('Document deleted successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to delete document'
      toast.error(message)
    },
  })
}

// Download document
export function useDownloadDocument() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.get(API_ENDPOINTS.DOCUMENT_DOWNLOAD(id), {
        responseType: 'blob',
      })

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition']
      let fileName = `document-${id}`
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1]
        }
      }

      // Create blob URL and trigger download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { fileName }
    },
    onSuccess: (data) => {
      toast.success(`Downloading ${data.fileName}...`)
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to download document'
      toast.error(message)
    },
  })
}
