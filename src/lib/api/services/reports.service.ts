import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse } from '../types'

export type ReportCategory = 'operational' | 'clinical' | 'financial' | 'compliance'
export type ReportFormat = 'pdf' | 'csv' | 'xlsx'
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly'
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ReportType {
  id: string
  code: string
  name: string
  description: string
  category: ReportCategory
  parameters: ReportParameter[]
  formats: ReportFormat[]
  estimatedRunTime: number // in seconds
}

export interface ReportParameter {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'daterange' | 'select' | 'multiselect' | 'boolean'
  required: boolean
  defaultValue?: any
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface GenerateReportParams {
  reportTypeId: string
  parameters: Record<string, any>
  format: ReportFormat
  recipients?: string[]
}

export interface GeneratedReport {
  id: string
  reportTypeId: string
  reportTypeName: string
  generatedAt: string
  generatedBy: string
  parameters: Record<string, any>
  status: ReportStatus
  format: ReportFormat
  downloadUrl?: string
  error?: string
}

export interface ScheduledReport {
  id: string
  reportTypeId: string
  reportTypeName: string
  name: string
  schedule: {
    frequency: ScheduleFrequency
    dayOfWeek?: number // 0-6 for weekly
    dayOfMonth?: number // 1-31 for monthly
    quarter?: number // 1-4 for quarterly
    time: string // HH:mm format
    timezone: string
  }
  parameters: Record<string, any>
  format: ReportFormat
  recipients: string[]
  enabled: boolean
  lastRun?: string
  nextRun?: string
  createdAt: string
  updatedAt: string
}

export interface ScheduleReportParams {
  reportTypeId: string
  name: string
  schedule: ScheduledReport['schedule']
  parameters: Record<string, any>
  format: ReportFormat
  recipients?: string[]
}

export class ReportsService {
  static async getReportTypes(): Promise<ApiResponse<ReportType[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Report types endpoint not yet implemented - GET /api/admin/reports/types')
  }

  static async generateReport(params: GenerateReportParams): Promise<ApiResponse<GeneratedReport>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Report generation endpoint not yet implemented - POST /api/admin/reports/generate')
  }

  static async getScheduledReports(): Promise<ApiResponse<ScheduledReport[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Scheduled reports endpoint not yet implemented - GET /api/admin/reports/scheduled')
  }

  static async scheduleReport(params: ScheduleReportParams): Promise<ApiResponse<ScheduledReport>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Schedule report endpoint not yet implemented - POST /api/admin/reports/schedule')
  }

  static async updateScheduledReport(
    id: string,
    params: Partial<ScheduleReportParams>
  ): Promise<ApiResponse<ScheduledReport>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Update scheduled report endpoint not yet implemented - PUT /api/admin/reports/scheduled/{id}')
  }

  static async deleteScheduledReport(id: string): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Delete scheduled report endpoint not yet implemented - DELETE /api/admin/reports/scheduled/{id}')
  }

  static async getReportHistory(
    reportTypeId?: string,
    limit = 50
  ): Promise<ApiResponse<GeneratedReport[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Report history endpoint not yet implemented - GET /api/admin/reports/history')
  }

  static async downloadReport(reportId: string): Promise<void> {
    // This would trigger a file download
    return apiClient.download(`/reports/${reportId}/download`, `report_${reportId}.pdf`)
  }

  static async getGeneratedReports(params?: {
    reportTypeId?: string
    status?: ReportStatus
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<GeneratedReport[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Generated reports endpoint not yet implemented - GET /api/admin/reports/generated')
  }

  static async getReportStatus(reportId: string): Promise<ApiResponse<GeneratedReport>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Report status endpoint not yet implemented - GET /api/admin/reports/{id}/status')
  }

  static async cancelReport(reportId: string): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Cancel report endpoint not yet implemented - POST /api/admin/reports/{id}/cancel')
  }

  static async retryReport(reportId: string): Promise<ApiResponse<GeneratedReport>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Retry report endpoint not yet implemented - POST /api/admin/reports/{id}/retry')
  }
}