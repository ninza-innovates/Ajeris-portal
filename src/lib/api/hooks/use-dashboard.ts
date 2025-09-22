import { useQuery } from '@tanstack/react-query'
import { DashboardService, ActivityParams, TrendsParams } from '../services'
import { queryKeys } from '../query-client'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => DashboardService.getStats(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export function useActivity(params?: ActivityParams) {
  return useQuery({
    queryKey: queryKeys.dashboard.activity(params),
    queryFn: () => DashboardService.getActivity(params),
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useTrends(params: TrendsParams) {
  return useQuery({
    queryKey: queryKeys.dashboard.trends(params),
    queryFn: () => DashboardService.getTrends(params),
    enabled: !!params.period && !!params.metric,
  })
}