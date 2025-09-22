import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { RadiologistsService, RadiologistCredentials, RadiologistPerformance } from '@/lib/api/services/radiologists.service'
import { Radiologist, RadiologistFilters, Study, RadiologistOrganization } from '@/lib/api/types'

const RADIOLOGISTS_QUERY_KEY = 'radiologists'

export function useRadiologists(filters?: RadiologistFilters) {
  return useQuery({
    queryKey: [RADIOLOGISTS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await RadiologistsService.getRadiologists(filters)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch radiologists')
      }
      return response.data
    },
  })
}

export function useRadiologist(id: string) {
  return useQuery({
    queryKey: [RADIOLOGISTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await RadiologistsService.getRadiologist(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch radiologist')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useUpdateRadiologist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Radiologist> }) => {
      const response = await RadiologistsService.updateRadiologist(id, data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update radiologist')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [RADIOLOGISTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [RADIOLOGISTS_QUERY_KEY, variables.id] })
      toast({
        title: 'Success',
        description: 'Radiologist updated successfully',
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

export function useUpdateRadiologistCredentials() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, credentials }: { id: string; credentials: RadiologistCredentials }) => {
      const response = await RadiologistsService.updateCredentials(id, credentials)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update credentials')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [RADIOLOGISTS_QUERY_KEY, variables.id] })
      toast({
        title: 'Success',
        description: 'Credentials updated successfully',
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

export function useRadiologistPerformance(id: string) {
  return useQuery({
    queryKey: [RADIOLOGISTS_QUERY_KEY, id, 'performance'],
    queryFn: async () => {
      const response = await RadiologistsService.getPerformance(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch performance data')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useRadiologistStudies(id: string) {
  return useQuery({
    queryKey: [RADIOLOGISTS_QUERY_KEY, id, 'studies'],
    queryFn: async () => {
      const response = await RadiologistsService.getStudies(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch studies')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useToggleRadiologistAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await RadiologistsService.toggleAvailability(id)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to toggle availability')
      }
      return response.data
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [RADIOLOGISTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [RADIOLOGISTS_QUERY_KEY, id] })
      toast({
        title: 'Success',
        description: 'Availability updated successfully',
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

export function useAssignStudy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ radiologistId, studyId }: { radiologistId: string; studyId: string }) => {
      const response = await RadiologistsService.assignStudy(radiologistId, studyId)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to assign study')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [RADIOLOGISTS_QUERY_KEY, variables.radiologistId, 'studies'] })
      queryClient.invalidateQueries({ queryKey: ['studies'] })
      toast({
        title: 'Success',
        description: 'Study assigned successfully',
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

export function useRadiologistOrganizations(id: string) {
  return useQuery({
    queryKey: [RADIOLOGISTS_QUERY_KEY, id, 'organizations'],
    queryFn: async () => {
      const response = await RadiologistsService.getOrganizations(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch organizations')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useRadiologistStats() {
  return useQuery({
    queryKey: ['radiologist-stats'],
    queryFn: async () => {
      const response = await RadiologistsService.getRadiologistStats()
      if (!response.success) {
        throw new Error('Failed to fetch radiologist statistics')
      }
      return response.data
    },
  })
}