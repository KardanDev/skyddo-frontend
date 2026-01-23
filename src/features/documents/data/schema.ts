// Document Schema
import { z } from 'zod'

export const documentSchema = z.object({
  id: z.number(),
  documentable_type: z.string(),
  documentable_id: z.number(),
  file_name: z.string(),
  file_path: z.string(),
  file_type: z.string(),
  file_size: z.number(),
  uploaded_by: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  uploader: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable()
    .optional(),
})

export type DocumentSchema = z.infer<typeof documentSchema>

// Form schema for create
export const documentFormSchema = z.object({
  documentable_type: z.string().min(1, 'Type is required'),
  documentable_id: z.number().min(1, 'Related item is required'),
  file: z.any(),
})

export type DocumentFormSchema = z.infer<typeof documentFormSchema>
