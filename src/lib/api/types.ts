// API Request/Response Helper Types
import { type AxiosResponse } from 'axios'
import { type ApiResponse, type PaginatedResponse } from '@/types/api'

// Helper to extract data from axios response
export type ApiData<T> = T extends AxiosResponse<infer U> ? U : never

// Helper for paginated endpoints
export interface PaginationParams {
  page?: number
  per_page?: number
}

// Helper for search/filter params
export interface SearchParams extends PaginationParams {
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Generic query params
export type QueryParams = Record<string, string | number | boolean | undefined>

// Helper to unwrap API response
export type UnwrapApiResponse<T> = T extends ApiResponse<infer U> ? U : T

// Helper to unwrap paginated response
export type UnwrapPaginatedResponse<T> =
  T extends PaginatedResponse<infer U> ? U : T

// Mutation result helper
export interface MutationResult<T = unknown> {
  data?: T
  message?: string
  success: boolean
}

// Error response structure
export interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

// Delay helper for static data
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
