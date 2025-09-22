import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { OrganizationsService, AssignRadiologistsRequest, UpdateCredentialingRequest } from '../services'
import { queryKeys } from '../query-client'
import { OrganizationFilters } from '../types'
import { toast } from '@/components/ui/use-toast'

export function useOrganizations(filters?: OrganizationFilters) {
  return useQuery({
    queryKey: queryKeys.organizations.list(filters),
    queryFn: () => OrganizationsService.getOrganizations(filters),
  })
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(id),
    queryFn: () => OrganizationsService.getOrganization(id),
    enabled: !!id,
  })
}

export function useOrganizationUsers(id: string) {
  return useQuery({
    queryKey: queryKeys.organizations.users(id),
    queryFn: () => OrganizationsService.getOrganizationUsers(id),
    enabled: !!id,
  })
}

export function useOrganizationRadiologists(
  orgId: string, 
  filters?: { credentialingStatus?: string; modioHealthStatus?: string }
) {
  return useQuery({
    queryKey: queryKeys.organizations.radiologists(orgId, filters),
    queryFn: () => OrganizationsService.getRadiologists(orgId, filters),
    enabled: !!orgId,
  })
}

export function useAssignRadiologists(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssignRadiologistsRequest) => 
      OrganizationsService.assignRadiologists(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.organizations.radiologists(orgId) 
      })
      toast({
        title: 'Radiologists assigned',
        description: 'Credentialing process has been initiated.',
      })
    },
  })
}

export function useUpdateRadiologistCredentialing(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ radiologistId, ...data }: UpdateCredentialingRequest & { radiologistId: string }) => 
      OrganizationsService.updateRadiologist(orgId, radiologistId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.organizations.radiologists(orgId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.organizations.radiologistDetail(orgId, variables.radiologistId) 
      })
      toast({
        title: 'Credentialing updated',
        description: 'Radiologist credentialing information has been updated.',
      })
    },
  })
}

export function useRemoveRadiologist(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (radId: string) => 
      OrganizationsService.removeRadiologist(orgId, radId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.organizations.radiologists(orgId) 
      })
      toast({
        title: 'Radiologist removed',
        description: 'Radiologist has been removed from this organization.',
      })
    },
  })
}

export function useTestHL7Connection() {
  return useMutation({
    mutationFn: (orgId: string) => OrganizationsService.testHL7Connection(orgId),
    onSuccess: (response) => {
      if (response.success && response.data?.success) {
        toast({
          title: 'Connection successful',
          description: `HL7 interface responded in ${response.data.responseTime}ms`,
        })
      } else {
        toast({
          title: 'Connection failed',
          description: 'Please check your HL7 configuration.',
          variant: 'destructive',
        })
      }
    },
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => OrganizationsService.createOrganization(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.lists() })
      toast({
        title: 'Organization created',
        description: `${response.data?.name} has been created successfully.`,
      })
    },
  })
}

export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => OrganizationsService.updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(id) })
      toast({
        title: 'Organization updated',
        description: 'Organization information has been updated.',
      })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => OrganizationsService.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.lists() })
      toast({
        title: 'Organization deleted',
        description: 'Organization has been permanently deleted.',
      })
    },
  })
}

export function useRenewCredentialing(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (radId: string) => 
      OrganizationsService.renewCredentialing(orgId, radId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.organizations.radiologists(orgId) 
      })
      toast({
        title: 'Credentialing renewal initiated',
        description: 'The credentialing renewal process has been started.',
      })
    },
  })
}