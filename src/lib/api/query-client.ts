import { QueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'

// Create a query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        if (error?.code === 'FORBIDDEN' || error?.code === 'UNAUTHORIZED') {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Show error toast on mutation failure
      onError: (error: any) => {
        const message = error?.message || 'An error occurred. Please try again.'
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      },
    },
  },
})

// Query key factory for consistent query keys
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    permissions: () => [...queryKeys.auth.all, 'permissions'] as const,
  },
  
  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    activity: (params?: any) => [...queryKeys.dashboard.all, 'activity', params] as const,
    trends: (params: any) => [...queryKeys.dashboard.all, 'trends', params] as const,
  },
  
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.users.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
    activity: (id: string) => [...queryKeys.users.all, 'activity', id] as const,
    loginHistory: (id: string) => [...queryKeys.users.all, 'loginHistory', id] as const,
  },
  
  // Members
  members: {
    all: ['members'] as const,
    lists: () => [...queryKeys.members.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.members.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.members.all, 'detail', id] as const,
  },
  
  // Radiologists
  radiologists: {
    all: ['radiologists'] as const,
    lists: () => [...queryKeys.radiologists.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.radiologists.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.radiologists.all, 'detail', id] as const,
    performance: (id: string) => [...queryKeys.radiologists.all, 'performance', id] as const,
    studies: (id: string) => [...queryKeys.radiologists.all, 'studies', id] as const,
    organizations: (id: string) => [...queryKeys.radiologists.all, 'organizations', id] as const,
  },
  
  // Organizations
  organizations: {
    all: ['organizations'] as const,
    lists: () => [...queryKeys.organizations.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.organizations.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.organizations.all, 'detail', id] as const,
    users: (id: string) => [...queryKeys.organizations.all, 'users', id] as const,
    billing: (id: string) => [...queryKeys.organizations.all, 'billing', id] as const,
    radiologists: (id: string, filters?: any) => 
      [...queryKeys.organizations.all, 'radiologists', id, filters] as const,
    radiologistDetail: (orgId: string, radId: string) => 
      [...queryKeys.organizations.all, 'radiologist', orgId, radId] as const,
  },
  
  // Studies
  studies: {
    all: ['studies'] as const,
    lists: () => [...queryKeys.studies.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.studies.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.studies.all, 'detail', id] as const,
    audit: (id: string) => [...queryKeys.studies.all, 'audit', id] as const,
    files: (id: string) => [...queryKeys.studies.all, 'files', id] as const,
  },
  
  // Credentialing
  credentialing: {
    all: ['credentialing'] as const,
    stats: (params?: any) => [...queryKeys.credentialing.all, 'stats', params] as const,
    expiring: (params?: any) => [...queryKeys.credentialing.all, 'expiring', params] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (params?: any) => [...queryKeys.notifications.lists(), params] as const,
    stats: () => [...queryKeys.notifications.all, 'stats'] as const,
    preferences: () => [...queryKeys.notifications.all, 'preferences'] as const,
    templates: () => [...queryKeys.notifications.all, 'templates'] as const,
    history: (params?: any) => [...queryKeys.notifications.all, 'history', params] as const,
    credentialingExpiry: () => [...queryKeys.notifications.all, 'credentialing-expiry'] as const,
  },
}