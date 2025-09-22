import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MembersService, MemberFilters } from '../services'
import { InviteAdminRequest } from '../types'
import { queryKeys } from '../query-client'
import { toast } from '@/components/ui/use-toast'

export function useMembers(filters?: MemberFilters) {
  return useQuery({
    queryKey: queryKeys.members.list(filters),
    queryFn: () => MembersService.getMembers(filters),
  })
}

export function useMember(id: string) {
  return useQuery({
    queryKey: queryKeys.members.detail(id),
    queryFn: () => MembersService.getMember(id),
    enabled: !!id,
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InviteAdminRequest) => MembersService.inviteMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.lists() })
    },
  })
}

export function useSuspendMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => MembersService.suspendMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.lists() })
      toast({
        title: 'Member suspended',
        description: 'Admin member has been suspended.',
      })
    },
  })
}

export function useActivateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => MembersService.activateMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.lists() })
      toast({
        title: 'Member activated',
        description: 'Admin member has been activated.',
      })
    },
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => MembersService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.lists() })
      toast({
        title: 'Member removed',
        description: 'Admin member has been removed.',
      })
    },
  })
}