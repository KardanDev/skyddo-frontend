// Client Types

export interface Client {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  id_number: string | null
  company_name: string | null
  zoho_contact_id: string | null
  created_at: string
  updated_at: string
  // Relationship counts
  quotes_count?: number
  policies_count?: number
  claims_count?: number
  invoices_count?: number
}

export interface CreateClientInput {
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  id_number?: string | null
  company_name?: string | null
}

export interface UpdateClientInput {
  name?: string
  email?: string | null
  phone?: string | null
  address?: string | null
  id_number?: string | null
  company_name?: string | null
}

export type ClientFormData = Omit<CreateClientInput, 'id'>
