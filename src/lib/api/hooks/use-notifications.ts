import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationsService } from '../services/notifications.service'
import { queryKeys } from '../query-client'
import { toast } from '@/components/ui/use-toast'

export function useNotifications(params?: {
  page?: number
  limit?: number
  unread?: boolean
  category?: string
}) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => NotificationsService.getNotifications(params),
  })
}

export function useNotificationStats() {
  return useQuery({
    queryKey: queryKeys.notifications.stats(),
    queryFn: () => NotificationsService.getNotificationStats(),
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => NotificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => NotificationsService.markAllAsRead(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      toast({
        title: 'All notifications marked as read',
        description: `${response.data?.updated} notifications updated`,
      })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => NotificationsService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      toast({
        title: 'Notification deleted',
      })
    },
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.notifications.preferences(),
    queryFn: () => NotificationsService.getPreferences(),
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: NotificationsService.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() })
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been saved',
      })
    },
  })
}

// Admin hooks
export function useNotificationTemplates() {
  return useQuery({
    queryKey: queryKeys.notifications.templates(),
    queryFn: () => NotificationsService.getTemplates(),
  })
}

export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      NotificationsService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.templates() })
      toast({
        title: 'Template updated',
        description: 'Notification template has been updated',
      })
    },
  })
}

export function useSendNotification() {
  return useMutation({
    mutationFn: NotificationsService.send,
    onSuccess: () => {
      toast({
        title: 'Notification sent',
        description: 'Notification has been sent to recipients',
      })
    },
  })
}

export function useNotificationHistory(params?: any) {
  return useQuery({
    queryKey: queryKeys.notifications.history(params),
    queryFn: () => NotificationsService.getHistory(params),
  })
}

export function useCredentialingExpiryNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.credentialingExpiry(),
    queryFn: () => NotificationsService.getCredentialingExpiryNotifications(),
  })
}