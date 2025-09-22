import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { 
  ReportsService, 
  ReportType, 
  GenerateReportParams, 
  ScheduledReport, 
  GeneratedReport 
} from '@/lib/api/services/reports.service'

const REPORT_TYPES_KEY = 'report-types'
const SCHEDULED_REPORTS_KEY = 'scheduled-reports'
const GENERATED_REPORTS_KEY = 'generated-reports'

export function useReportTypes() {
  return useQuery({
    queryKey: [REPORT_TYPES_KEY],
    queryFn: async () => {
      const response = await ReportsService.getReportTypes()
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch report types')
      }
      return response.data
    },
  })
}

export function useGenerateReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: GenerateReportParams) => {
      const response = await ReportsService.generateReport(params)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to generate report')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [GENERATED_REPORTS_KEY] })
      toast({
        title: 'Report Generation Started',
        description: `Your report is being generated. ID: ${data.id}`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Report Generation Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useScheduledReports() {
  return useQuery({
    queryKey: [SCHEDULED_REPORTS_KEY],
    queryFn: async () => {
      const response = await ReportsService.getScheduledReports()
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch scheduled reports')
      }
      return response.data
    },
  })
}

export function useGeneratedReports(filters?: {
  reportTypeId?: string
  startDate?: string
  endDate?: string
  status?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: [GENERATED_REPORTS_KEY, filters],
    queryFn: async () => {
      const response = await ReportsService.getGeneratedReports(filters)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch generated reports')
      }
      return response.data
    },
  })
}

export function useReportStatus(reportId: string) {
  return useQuery({
    queryKey: [GENERATED_REPORTS_KEY, reportId],
    queryFn: async () => {
      const response = await ReportsService.getReportStatus(reportId)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch report status')
      }
      return response.data
    },
    refetchInterval: (data) => {
      // Poll every 5 seconds if report is still processing
      return data?.status === 'processing' ? 5000 : false
    },
  })
}

export function useScheduleReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<ScheduledReport>) => {
      const response = await ReportsService.scheduleReport(data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to schedule report')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULED_REPORTS_KEY] })
      toast({
        title: 'Report Scheduled',
        description: 'The report has been scheduled successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Scheduling Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateScheduledReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ScheduledReport> }) => {
      const response = await ReportsService.updateScheduledReport(id, data)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update scheduled report')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULED_REPORTS_KEY] })
      toast({
        title: 'Schedule Updated',
        description: 'The report schedule has been updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteScheduledReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await ReportsService.deleteScheduledReport(id)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete scheduled report')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULED_REPORTS_KEY] })
      toast({
        title: 'Schedule Deleted',
        description: 'The report schedule has been deleted successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useCredentialingReport(params?: {
  radiologistId?: string
  organizationId?: string
  includeExpired?: boolean
}) {
  return useQuery({
    queryKey: ['credentialing-report', params],
    queryFn: async () => {
      const response = await ReportsService.getCredentialingReport(params)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch credentialing report')
      }
      return response.data
    },
  })
}