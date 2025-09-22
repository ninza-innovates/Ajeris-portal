import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SettingsService, Settings, GeneralSettings, SecuritySettings, NotificationSettings, AuditSettings, HL7Settings, RateLimits } from '../services/settings.service'
import { toast } from '@/components/ui/use-toast'

const SETTINGS_QUERY_KEY = ['settings']

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await SettingsService.getSettings()
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch settings')
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  })
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<GeneralSettings>) => {
      const response = await SettingsService.updateGeneralSettings(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update general settings')
      }
      return response.data
    },
    onSuccess: (data) => {
      // Update the cache with the new general settings
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          general: data
        }
      })
      toast({
        title: 'Settings Updated',
        description: 'General settings have been saved successfully.',
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

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<SecuritySettings>) => {
      const response = await SettingsService.updateSecuritySettings(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update security settings')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          security: data
        }
      })
      toast({
        title: 'Settings Updated',
        description: 'Security settings have been saved successfully.',
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

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<NotificationSettings>) => {
      const response = await SettingsService.updateNotificationSettings(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update notification settings')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          notifications: data
        }
      })
      toast({
        title: 'Settings Updated',
        description: 'Notification settings have been saved successfully.',
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

export function useUpdateAuditSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<AuditSettings>) => {
      const response = await SettingsService.updateAuditSettings(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update audit settings')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          audit: data
        }
      })
      toast({
        title: 'Settings Updated',
        description: 'Audit settings have been saved successfully.',
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

export function useUpdateHL7Settings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<HL7Settings>) => {
      const response = await SettingsService.updateHL7Settings(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update HL7 settings')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          hl7: data
        }
      })
      toast({
        title: 'Settings Updated',
        description: 'HL7 settings have been saved successfully.',
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

export function useUpdateRateLimits() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<RateLimits>) => {
      const response = await SettingsService.updateRateLimits(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update rate limits')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          rateLimits: data
        }
      })
      toast({
        title: 'Settings Updated',
        description: 'Rate limits have been saved successfully.',
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