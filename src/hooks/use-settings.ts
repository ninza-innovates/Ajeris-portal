import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SystemService, SystemSettings, Integration } from '@/lib/api/services/system.service'
import { toast } from '@/components/ui/use-toast'

const SETTINGS_QUERY_KEY = 'settings'
const INTEGRATIONS_QUERY_KEY = 'integrations'
const HEALTH_QUERY_KEY = 'system-health'

export function useSystemSettings() {
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY],
    queryFn: async () => {
      const response = await SystemService.getSettings()
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch system settings')
      }
      return response.data
    },
  })
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<SystemSettings>) => {
      const response = await SystemService.updateSettings(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update settings')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY] })
      toast({
        title: 'Settings Updated',
        description: 'System settings have been saved successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useIntegrations() {
  return useQuery({
    queryKey: [INTEGRATIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await SystemService.getIntegrations()
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch integrations')
      }
      return response.data
    },
  })
}

export function useTestIntegration() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await SystemService.testIntegration(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to test integration')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [INTEGRATIONS_QUERY_KEY] })
      toast({
        title: 'Integration Test',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useSystemHealth() {
  return useQuery({
    queryKey: [HEALTH_QUERY_KEY],
    queryFn: async () => {
      const response = await SystemService.getHealth()
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch system health')
      }
      return response.data
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

export function useClearCache() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await SystemService.clearCache()
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to clear cache')
      }
      return response
    },
    onSuccess: () => {
      // Clear all React Query caches as well
      queryClient.clear()
      toast({
        title: 'Cache Cleared',
        description: 'System cache has been cleared successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Clear Cache Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useToggleMaintenanceMode() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await SystemService.toggleMaintenanceMode(enabled)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to toggle maintenance mode')
      }
      return response
    },
    onSuccess: (_, enabled) => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY] })
      toast({
        title: 'Maintenance Mode',
        description: `Maintenance mode has been ${enabled ? 'enabled' : 'disabled'}.`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Toggle Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}