import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SystemService } from '../services'
import { toast } from '@/components/ui/use-toast'

export function useSystemHealth() {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => SystemService.getHealth(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export function useSystemMetrics() {
  return useQuery({
    queryKey: ['system', 'metrics'],
    queryFn: () => SystemService.getMetrics(),
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useSystemConfiguration() {
  return useQuery({
    queryKey: ['system', 'configuration'],
    queryFn: () => SystemService.getConfiguration(),
    staleTime: 10 * 60 * 1000, // Consider fresh for 10 minutes
  })
}

export function useUpdateSystemConfiguration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: Record<string, any>) => SystemService.updateConfiguration(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'configuration'] })
      toast({
        title: 'Configuration updated',
        description: 'System configuration has been updated.',
      })
    },
  })
}

export function useSystemLogs(params?: {
  level?: 'error' | 'warn' | 'info' | 'debug'
  service?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}) {
  return useQuery({
    queryKey: ['system', 'logs', params],
    queryFn: () => SystemService.getLogs(params),
  })
}

export function useBackupStatus() {
  return useQuery({
    queryKey: ['system', 'backup-status'],
    queryFn: () => SystemService.getBackupStatus(),
  })
}

export function useTriggerBackup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: 'full' | 'incremental') => SystemService.triggerBackup(type),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['system', 'backup-status'] })
      toast({
        title: 'Backup initiated',
        description: `${response.data?.type} backup has been started.`,
      })
    },
  })
}

export function useMaintenanceMode() {
  return useQuery({
    queryKey: ['system', 'maintenance'],
    queryFn: () => SystemService.getMaintenanceMode(),
  })
}

export function useToggleMaintenanceMode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { enabled: boolean; message?: string; estimatedEndTime?: Date }) => 
      SystemService.toggleMaintenanceMode(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['system', 'maintenance'] })
      toast({
        title: response.data?.enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
        description: response.data?.enabled 
          ? 'System is now in maintenance mode.'
          : 'System is back online.',
      })
    },
  })
}

export function useServiceStatus() {
  return useQuery({
    queryKey: ['system', 'services'],
    queryFn: () => SystemService.getServiceStatus(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export function useRestartService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serviceName: string) => SystemService.restartService(serviceName),
    onSuccess: (response, serviceName) => {
      queryClient.invalidateQueries({ queryKey: ['system', 'services'] })
      toast({
        title: 'Service restarted',
        description: `${serviceName} has been restarted successfully.`,
      })
    },
  })
}

export function useExportSystemLogs() {
  return useMutation({
    mutationFn: (params: {
      format: 'txt' | 'json'
      filters?: {
        level?: string
        service?: string
        startDate?: Date
        endDate?: Date
      }
    }) => SystemService.exportLogs(params.filters, params.format),
    onSuccess: (response) => {
      // Handle file download
      if (response.data) {
        const blob = new Blob([response.data], { 
          type: response.headers?.['content-type'] || 'application/octet-stream' 
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.${response.format || 'txt'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: 'Export successful',
          description: 'System logs have been exported.',
        })
      }
    },
  })
}