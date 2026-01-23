// Document Types

export interface Document {
  id: number
  documentable_type: DocumentableType
  documentable_id: number
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  uploaded_by: number | null
  created_at: string
  updated_at: string
  // Relationships
  uploader?: {
    id: number
    name: string
  } | null
}

export type DocumentableType =
  | 'App\\Models\\Client'
  | 'App\\Models\\Quote'
  | 'App\\Models\\Policy'
  | 'App\\Models\\Claim'
  | 'App\\Models\\Invoice'

export interface CreateDocumentInput {
  documentable_type: DocumentableType
  documentable_id: number
  file: File
}

export interface UpdateDocumentInput {
  file_name?: string
}

export const DOCUMENTABLE_TYPE_LABELS: Record<DocumentableType, string> = {
  'App\\Models\\Client': 'Client',
  'App\\Models\\Quote': 'Quote',
  'App\\Models\\Policy': 'Policy',
  'App\\Models\\Claim': 'Claim',
  'App\\Models\\Invoice': 'Invoice',
}

export const DOCUMENT_CATEGORIES = [
  'client',
  'quote',
  'policy',
  'claim',
  'invoice',
] as const

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]
