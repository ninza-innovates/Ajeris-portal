import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { StudiesService, StudyReassignRequest } from '../services'
import { StudyFilters } from '../types'
import { queryKeys } from '../query-client'
import { toast } from '@/components/ui/use-toast'

export function useStudies(filters?: StudyFilters) {
  return useQuery({
    queryKey: queryKeys.studies.list(filters),
    queryFn: () => StudiesService.getStudies(filters),
  })
}

export function useStudy(id: string) {
  return useQuery({
    queryKey: queryKeys.studies.detail(id),
    queryFn: () => StudiesService.getStudy(id),
    enabled: !!id,
  })
}

export function useStudyAuditLog(id: string) {
  return useQuery({
    queryKey: queryKeys.studies.audit(id),
    queryFn: () => StudiesService.getAuditLog(id),
    enabled: !!id,
  })
}

export function useStudyFiles(id: string) {
  return useQuery({
    queryKey: queryKeys.studies.files(id),
    queryFn: () => StudiesService.getFiles(id),
    enabled: !!id,
  })
}

export function useReassignStudy(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: StudyReassignRequest) => StudiesService.reassignStudy(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studies.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.studies.lists() })
      toast({
        title: 'Study reassigned',
        description: `Study has been reassigned to ${response.data?.assignedTo}`,
      })
    },
  })
}

export function useExportStudies() {
  return useMutation({
    mutationFn: (params: { format: 'csv' | 'xlsx'; filters?: StudyFilters }) => 
      StudiesService.exportStudies(params.filters, params.format),
    onSuccess: (response) => {
      // Handle file download
      if (response.data) {
        const blob = new Blob([response.data], { 
          type: response.headers?.['content-type'] || 'application/octet-stream' 
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `studies-export-${new Date().toISOString().split('T')[0]}.${response.format || 'csv'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: 'Export successful',
          description: 'Studies have been exported.',
        })
      }
    },
  })
}

export function useMarkStudyCritical(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => StudiesService.markAsCritical(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studies.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.studies.lists() })
      toast({
        title: 'Study marked as critical',
        description: 'Study has been flagged for urgent review.',
        variant: 'destructive',
      })
    },
  })
}

export function useAddStudyNote(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (note: string) => StudiesService.addNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studies.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.studies.audit(id) })
      toast({
        title: 'Note added',
        description: 'Note has been added to the study.',
      })
    },
  })
}

export function useDeleteStudy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => StudiesService.deleteStudy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studies.lists() })
      toast({
        title: 'Study deleted',
        description: 'Study has been permanently deleted.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete study',
        variant: 'destructive',
      })
    },
  })
}