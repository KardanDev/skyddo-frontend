// Insurer Types

export interface Insurer {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  contact_person: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  // Relationship counts
  quotes_count?: number
  policies_count?: number
}

export interface CreateInsurerInput {
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  contact_person?: string | null
  is_active?: boolean
}

export interface UpdateInsurerInput {
  name?: string
  email?: string | null
  phone?: string | null
  address?: string | null
  contact_person?: string | null
  is_active?: boolean
}

export type InsurerFormData = Omit<CreateInsurerInput, 'id'>
