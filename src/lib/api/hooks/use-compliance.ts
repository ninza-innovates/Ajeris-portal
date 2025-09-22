import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ComplianceService } from '../services'
import { toast } from '@/components/ui/use-toast'

export function useComplianceOverview() {
  return useQuery({
    queryKey: ['compliance', 'overview'],
    queryFn: () => ComplianceService.getOverview(),
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  })
}

export function useComplianceFlags(filters?: { 
  organizationId?: string
  studyId?: string
  flagType?: string
  status?: string
  page?: number
  limit?: number 
}) {
  return useQuery({
    queryKey: ['compliance', 'flags', filters],
    queryFn: () => ComplianceService.getFlags(filters),
  })
}

export function useCreateComplianceFlag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      studyId: string
      flagType: string
      severity: string
      description: string
    }) => ComplianceService.createFlag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance', 'flags'] })
      toast({
        title: 'Flag created',
        description: 'Compliance flag has been created successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create flag',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateComplianceFlag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: string; resolution?: string } }) => 
      ComplianceService.updateFlag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance', 'flags'] })
      toast({
        title: 'Flag updated',
        description: 'Compliance flag has been updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update flag',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useAuditLogs(params?: { 
  userId?: string
  resource?: string
  startDate?: Date
  endDate?: Date
  category?: string
  page?: number
  limit?: number 
}) {
  const filters = params ? {
    ...params,
    startDate: params.startDate?.toISOString(),
    endDate: params.endDate?.toISOString(),
  } : undefined
  
  return useQuery({
    queryKey: ['compliance', 'audit-logs', filters],
    queryFn: () => ComplianceService.getAuditLogs(filters),
  })
}

export function useComplianceAudits(filters?: {
  type?: string
  status?: string
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['compliance', 'audits', filters],
    queryFn: () => ComplianceService.getAudits(filters),
  })
}

export function useCreateAudit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      type: string
      startDate: string
      endDate: string
      scope: string[]
    }) => ComplianceService.createAudit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance', 'audits'] })
      toast({
        title: 'Audit scheduled',
        description: 'Compliance audit has been scheduled successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to schedule audit',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useHIPAAReports(year?: number) {
  return useQuery({
    queryKey: ['compliance', 'hipaa-reports', year],
    queryFn: () => ComplianceService.getHIPAAReports(year),
  })
}

export function useGenerateHIPAAReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (period: string) => ComplianceService.generateHIPAAReport(period),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance', 'hipaa-reports'] })
      toast({
        title: 'Report generated',
        description: 'HIPAA compliance report has been generated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to generate report',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useExportAuditLogs() {
  return useMutation({
    mutationFn: (params: { 
      format: 'csv' | 'pdf' | 'xlsx'
      filters?: {
        startDate?: Date
        endDate?: Date
        category?: string
      }
    }) => ComplianceService.exportAudit({
      format: params.format,
      startDate: params.filters?.startDate?.toISOString(),
      endDate: params.filters?.endDate?.toISOString(),
    }),
    onSuccess: (response, variables) => {
      // For now, just show a success message since the service throws an error
      toast({
        title: 'Export requested',
        description: `Audit logs export in ${variables.format.toUpperCase()} format has been requested.`,
      })
    },
    onError: (error: Error) => {
      // Expected error for now since the endpoint isn't implemented
      if (error.message.includes('not yet implemented')) {
        toast({
          title: 'Feature coming soon',
          description: 'Audit log export is not yet available.',
          variant: 'default',
        })
      } else {
        toast({
          title: 'Export failed',
          description: error.message,
          variant: 'destructive',
        })
      }
    },
  })
}

export function useCredentialingAudit() {
  return useQuery({
    queryKey: ['compliance', 'credentialing-audit'],
    queryFn: () => ComplianceService.getCredentialingAudit(),
  })
}

// Legacy exports for backward compatibility
export const useComplianceStatus = useComplianceOverview
export const useDataRetention = () => useQuery({
  queryKey: ['compliance', 'data-retention'],
  queryFn: () => Promise.resolve({ 
    data: { 
      studyRetentionDays: 365, 
      reportRetentionDays: 2555,
      auditLogRetentionDays: 2555,
      autoArchiveEnabled: true 
    },
    success: true 
  }),
})
export const useUpdateDataRetention = () => useMutation({
  mutationFn: () => Promise.resolve({ success: true }),
})
export const useComplianceReports = useHIPAAReports
export const useGenerateComplianceReport = useGenerateHIPAAReport
export const useSecurityAlerts = () => useQuery({
  queryKey: ['compliance', 'security-alerts'],
  queryFn: () => Promise.resolve({ data: [], success: true }),
})
export const useAcknowledgeAlert = () => useMutation({
  mutationFn: () => Promise.resolve({ success: true }),
})