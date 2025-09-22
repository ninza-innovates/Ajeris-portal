import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { OrganizationsService } from '@/lib/api/services/organizations.service'
import { Organization, OrganizationFilters, CreateOrganizationData, UpdateOrganizationData } from '@/lib/api/types'

const ORGANIZATIONS_QUERY_KEY = 'organizations'

export function useOrganizations(filters?: OrganizationFilters) {
  return useQuery({
    queryKey: [ORGANIZATIONS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await OrganizationsService.getOrganizations(filters)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch organizations')
      }
      return response.data
    },
  })
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: [ORGANIZATIONS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await OrganizationsService.getOrganization(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch organization')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateOrganizationData) => {
      const response = await OrganizationsService.createOrganization(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create organization')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY] })
      toast({
        title: 'Success',
        description: 'Organization created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrganizationData }) => {
      const response = await OrganizationsService.updateOrganization(id, data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update organization')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY, variables.id] })
      toast({
        title: 'Success',
        description: 'Organization updated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await OrganizationsService.deleteOrganization(id)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete organization')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY] })
      toast({
        title: 'Success',
        description: 'Organization deleted successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useSuspendOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await OrganizationsService.suspendOrganization(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to suspend organization')
      }
      return response.data
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY, id] })
      toast({
        title: 'Success',
        description: 'Organization suspended successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useActivateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await OrganizationsService.activateOrganization(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to activate organization')
      }
      return response.data
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_QUERY_KEY, id] })
      toast({
        title: 'Success',
        description: 'Organization activated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useOrganizationStats() {
  return useQuery({
    queryKey: ['organization-stats'],
    queryFn: async () => {
      const response = await OrganizationsService.getOrganizationStats()
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch organization stats')
      }
      return response.data
    },
  })
}