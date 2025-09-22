import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse, Study, StudyFilters, AuditLog, StudyPriority } from '../types'

export interface StudyFile {
  id: string
  filename: string
  size: number
  type: string
  uploadedAt: string
  uploadedBy: string
  status: 'pending' | 'validated' | 'rejected'
}

export interface StudyReassignRequest {
  radiologistId: string
  reason: string
}

export interface StudyEscalateRequest {
  priority: StudyPriority
  reason: string
}

export class StudiesService {
  static async getStudies(filters?: StudyFilters): Promise<ApiResponse<Study[]>> {
    return apiClient.get<Study[]>(API_ENDPOINTS.STUDIES.LIST, { params: filters })
  }

  static async getStudy(id: string): Promise<ApiResponse<Study>> {
    return apiClient.get<Study>(API_ENDPOINTS.STUDIES.DETAIL(id))
  }

  static async updateStudy(id: string, data: Partial<Study>): Promise<ApiResponse<Study>> {
    return apiClient.put<Study>(API_ENDPOINTS.STUDIES.UPDATE(id), data)
  }

  static async reassignStudy(id: string, data: StudyReassignRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.REASSIGN(id), data)
  }

  static async escalateStudy(id: string, data: StudyEscalateRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.ESCALATE(id), data)
  }

  static async resetWorkflow(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.RESET_WORKFLOW(id))
  }

  static async flagCompliance(id: string, reason: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.FLAG_COMPLIANCE(id), { reason })
  }

  static async overrideBilling(id: string, billingCode: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.OVERRIDE_BILLING(id), { billingCode })
  }

  static async deleteStudy(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.STUDIES.DELETE(id))
  }


  static async getFiles(id: string): Promise<ApiResponse<StudyFile[]>> {
    return apiClient.get<StudyFile[]>(API_ENDPOINTS.STUDIES.FILES(id))
  }

  static async validateFile(studyId: string, fileId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.VALIDATE_FILE(studyId, fileId))
  }

  static async markAsCritical(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.MARK_CRITICAL(id))
  }

  static async addNote(id: string, note: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.STUDIES.ADD_NOTE(id), { note })
  }

  static async getAuditLog(id: string): Promise<ApiResponse<AuditLog[]>> {
    return apiClient.get<AuditLog[]>(API_ENDPOINTS.STUDIES.AUDIT(id))
  }

  static async exportStudies(filters?: StudyFilters, format: 'csv' | 'xlsx' = 'csv'): Promise<ApiResponse<any>> {
    return apiClient.get<any>(API_ENDPOINTS.STUDIES.EXPORT, { 
      params: { ...filters, format },
      responseType: 'blob'
    })
  }

  static async getStudyStats(): Promise<ApiResponse<{
    totalStudies: number
    assignedStudies: number
    awaitingReview: number
    requireAttention: number
    completedToday: number
    averageTAT: number
  }>> {
    return apiClient.get<{
      totalStudies: number
      assignedStudies: number
      awaitingReview: number
      requireAttention: number
      completedToday: number
      averageTAT: number
    }>('/studies/stats')
  }
}