import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UsersService, CreateUserRequest, UpdateUserRequest } from '../services'
import { queryKeys } from '../query-client'
import { UserFilters } from '../types'
import { toast } from '@/components/ui/use-toast'

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => UsersService.getUsers(filters),
  })
}

export function useUserStats() {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => UsersService.getUserStats(),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => UsersService.getUser(id),
    enabled: !!id,
  })
}

export function useUserActivity(id: string) {
  return useQuery({
    queryKey: queryKeys.users.activity(id),
    queryFn: () => UsersService.getUserActivity(id),
    enabled: !!id,
  })
}

export function useUserLoginHistory(id: string) {
  return useQuery({
    queryKey: queryKeys.users.loginHistory(id),
    queryFn: () => UsersService.getLoginHistory(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => UsersService.createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    onError: (error: any) => {
      // Let the component handle error toasts
      throw error
    },
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => UsersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      toast({
        title: 'User updated',
        description: 'User information has been updated.',
      })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => UsersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast({
        title: 'User deleted',
        description: 'User has been permanently deleted.',
      })
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (id: string) => UsersService.resetPassword(id),
    onSuccess: (response) => {
      toast({
        title: 'Password reset',
        description: 'Password reset email has been sent.',
      })
    },
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => UsersService.suspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast({
        title: 'User suspended',
        description: 'User has been suspended.',
      })
    },
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => UsersService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast({
        title: 'User activated',
        description: 'User has been activated.',
      })
    },
  })
}

export function useToggle2FA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: string; enabled: boolean }) => 
      UsersService.toggle2FA(data.id, data.enabled),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })
      toast({
        title: variables.enabled ? '2FA Enabled' : '2FA Disabled',
        description: variables.enabled 
          ? 'Two-factor authentication has been enabled.'
          : 'Two-factor authentication has been disabled.',
      })
    },
  })
}

export function useBatchSuspendUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userIds: string[]; reason?: string }) => 
      UsersService.batchSuspend(data.userIds, data.reason),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast({
        title: 'Users suspended',
        description: `${variables.userIds.length} users have been suspended.`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to suspend users. Please try again.',
        variant: 'destructive',
      })
    },
  })
}

export function useBatchDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userIds: string[]; reason?: string }) => 
      UsersService.batchDelete(data.userIds, data.reason),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast({
        title: 'Users deleted',
        description: `${variables.userIds.length} users have been deleted.`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete users. Please try again.',
        variant: 'destructive',
      })
    },
  })
}