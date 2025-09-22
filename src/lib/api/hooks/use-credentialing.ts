import { useQuery } from '@tanstack/react-query'
import { CredentialingService } from '../services'
import { queryKeys } from '../query-client'

export function useCredentialingStats(params?: {
  organizationId?: string
  startDate?: Date
  endDate?: Date
}) {
  return useQuery({
    queryKey: queryKeys.credentialing.stats(params),
    queryFn: () => CredentialingService.getStats(params),
  })
}

export function useExpiringCredentials(params?: {
  daysAhead?: number
  organizationId?: string
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.credentialing.expiring(params),
    queryFn: () => CredentialingService.getExpiring(params),
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  })
}