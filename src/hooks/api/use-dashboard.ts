import { useQuery } from '@tanstack/react-query'

import api from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

// Types
export interface DashboardStats {
  total_clients: number
  active_policies: number
  pending_quotes: number
  open_claims: number
  overdue_invoices: number
  total_premium_this_month: number
  policies_expiring_soon: number
}

export interface DashboardData {
  stats: DashboardStats
  recent_quotes: any[]
  expiring_policies: any[]
  pending_claims: any[]
  overdue_invoices: any[]
}

// Query Keys
const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
}

/**
 * Fetch dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await api.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}

/**
 * Fetch full dashboard data
 */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: async () => {
      const response = await api.get<DashboardData>(API_ENDPOINTS.DASHBOARD.INDEX)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}
