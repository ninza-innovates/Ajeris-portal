import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RadiologistsService, CreateRadiologistRequest, UpdateRadiologistRequest, RadiologistFilters } from '../services'
import { queryKeys } from '../query-client'
import { toast } from '@/components/ui/use-toast'

export function useRadiologists(filters?: RadiologistFilters) {
  return useQuery({
    queryKey: queryKeys.radiologists.list(filters),
    queryFn: () => RadiologistsService.getRadiologists(filters),
  })
}

export function useRadiologist(id: string) {
  return useQuery({
    queryKey: queryKeys.radiologists.detail(id),
    queryFn: () => RadiologistsService.getRadiologist(id),
    enabled: !!id,
  })
}

export function useRadiologistPerformance(id: string, dateRange?: { from: Date; to: Date }) {
  return useQuery({
    queryKey: queryKeys.radiologists.performance(id),
    queryFn: () => RadiologistsService.getPerformance(id, dateRange),
    enabled: !!id,
  })
}

export function useRadiologistStudies(id: string, filters?: any) {
  return useQuery({
    queryKey: queryKeys.radiologists.studies(id),
    queryFn: () => RadiologistsService.getStudies(id, filters),
    enabled: !!id,
  })
}

export function useRadiologistOrganizations(id: string) {
  return useQuery({
    queryKey: queryKeys.radiologists.organizations(id),
    queryFn: () => RadiologistsService.getOrganizations(id),
    enabled: !!id,
  })
}

export function useCreateRadiologist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRadiologistRequest) => RadiologistsService.createRadiologist(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.radiologists.lists() })
      toast({
        title: 'Radiologist created',
        description: `${response.data?.firstName} ${response.data?.lastName} has been added.`,
      })
    },
  })
}

export function useUpdateRadiologist(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateRadiologistRequest) => RadiologistsService.updateRadiologist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.radiologists.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.radiologists.detail(id) })
      toast({
        title: 'Radiologist updated',
        description: 'Radiologist information has been updated.',
      })
    },
  })
}

export function useSuspendRadiologist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => RadiologistsService.suspendRadiologist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.radiologists.lists() })
      toast({
        title: 'Radiologist suspended',
        description: 'Radiologist has been suspended.',
      })
    },
  })
}

export function useActivateRadiologist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => RadiologistsService.activateRadiologist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.radiologists.lists() })
      toast({
        title: 'Radiologist activated',
        description: 'Radiologist has been activated.',
      })
    },
  })
}