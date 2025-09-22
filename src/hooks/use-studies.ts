import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { StudiesService, StudyReassignRequest, StudyEscalateRequest, StudyFile } from '@/lib/api/services/studies.service'
import { Study, StudyFilters, AuditLog } from '@/lib/api/types'

const STUDIES_QUERY_KEY = 'studies'

export function useStudies(filters?: StudyFilters) {
  return useQuery({
    queryKey: [STUDIES_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await StudiesService.getStudies(filters)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch studies')
      }
      return response.data
    },
  })
}

export function useStudy(id: string) {
  return useQuery({
    queryKey: [STUDIES_QUERY_KEY, id],
    queryFn: async () => {
      const response = await StudiesService.getStudy(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch study')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useUpdateStudy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Study> }) => {
      const response = await StudiesService.updateStudy(id, data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update study')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY, variables.id] })
      toast({
        title: 'Success',
        description: 'Study updated successfully',
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

export function useReassignStudy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudyReassignRequest }) => {
      const response = await StudiesService.reassignStudy(id, data)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to reassign study')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY, variables.id] })
      toast({
        title: 'Success',
        description: 'Study reassigned successfully',
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

export function useEscalateStudy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudyEscalateRequest }) => {
      const response = await StudiesService.escalateStudy(id, data)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to escalate study')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY, variables.id] })
      toast({
        title: 'Success',
        description: 'Study priority escalated successfully',
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

export function useDeleteStudy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await StudiesService.deleteStudy(id)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete study')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY] })
      toast({
        title: 'Success',
        description: 'Study deleted successfully',
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

export function useResetWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await StudiesService.resetWorkflow(id)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to reset workflow')
      }
      return response.data
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY, id] })
      toast({
        title: 'Success',
        description: 'Workflow reset successfully',
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

export function useFlagCompliance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await StudiesService.flagCompliance(id, reason)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to flag compliance')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY, variables.id] })
      toast({
        title: 'Success',
        description: 'Study flagged for compliance review',
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

export function useMarkAsCritical() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await StudiesService.markAsCritical(id)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to mark as critical')
      }
      return response.data
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [STUDIES_QUERY_KEY, id] })
      toast({
        title: 'Success',
        description: 'Study marked as critical',
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

export function useStudyFiles(id: string) {
  return useQuery({
    queryKey: [STUDIES_QUERY_KEY, id, 'files'],
    queryFn: async () => {
      const response = await StudiesService.getFiles(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch study files')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useStudyAuditLog(id: string) {
  return useQuery({
    queryKey: [STUDIES_QUERY_KEY, id, 'audit'],
    queryFn: async () => {
      const response = await StudiesService.getAuditLog(id)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch audit log')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useExportStudies() {
  return useMutation({
    mutationFn: async ({ filters, format }: { filters?: StudyFilters; format?: 'csv' | 'xlsx' }) => {
      const response = await StudiesService.exportStudies(filters, format)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to export studies')
      }
      return response.data
    },
    onSuccess: (data) => {
      // Create a download link for the exported file
      const blob = new Blob([data], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `studies_export_${new Date().toISOString().split('T')[0]}.${data.format || 'csv'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: 'Success',
        description: 'Studies exported successfully',
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

export function useStudyStats() {
  return useQuery({
    queryKey: ['study-stats'],
    queryFn: async () => {
      const response = await StudiesService.getStudyStats()
      if (!response.success) {
        throw new Error('Failed to fetch study statistics')
      }
      return response.data
    },
  })
}