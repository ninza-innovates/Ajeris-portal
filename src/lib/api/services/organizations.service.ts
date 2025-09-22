import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { 
  ApiResponse, 
  Organization, 
  OrganizationFilters, 
  User, 
  Invoice, 
  RadiologistOrganization,
  AssignRadiologistsRequest,
  UpdateCredentialingRequest
} from '../types'
import { mapApiOrganizationToOrganization, mapPaginatedResponse } from '../response-mappers'

export interface OrganizationSettings {
  notificationPreferences?: {
    emailAlerts: boolean
    smsAlerts: boolean
    criticalFindings: boolean
  }
  autoAssignment?: {
    enabled: boolean
    rules: Record<string, any>
  }
  customFields?: Record<string, any>
}

export interface HL7TestResult {
  success: boolean
  responseTime: number
  details: {
    connection: boolean
    authentication: boolean
    messageFormat: boolean
    errors?: string[]
  }
}

export interface RadiologyRequirements {
  requiredCount: number
  requiredSpecialties: string[]
  currentAssigned: number
}

export class OrganizationsService {
  static async getOrganizations(filters?: OrganizationFilters): Promise<ApiResponse<Organization[]>> {
    const response = await apiClient.get<any[]>(API_ENDPOINTS.ORGANIZATIONS.LIST, { params: filters })
    
    // Apply mapper to transform backend response to frontend format
    // TODO: Remove this mapper once backend is updated to match frontend expectations
    if (response.data) {
      const mapped = mapPaginatedResponse(response, mapApiOrganizationToOrganization)
      return {
        ...response,
        data: mapped.data,
        meta: mapped.meta
      }
    }
    
    return response as ApiResponse<Organization[]>
  }

  static async getOrganization(id: string): Promise<ApiResponse<Organization>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.ORGANIZATIONS.DETAIL(id))
    
    // Apply mapper to transform backend response to frontend format
    // TODO: Remove this mapper once backend is updated to match frontend expectations
    if (response.data) {
      return {
        ...response,
        data: mapApiOrganizationToOrganization(response.data)
      }
    }
    
    return response as ApiResponse<Organization>
  }

  static async createOrganization(data: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return apiClient.post<Organization>(API_ENDPOINTS.ORGANIZATIONS.CREATE, data)
  }

  static async updateOrganization(id: string, data: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return apiClient.put<Organization>(API_ENDPOINTS.ORGANIZATIONS.UPDATE(id), data)
  }

  static async deleteOrganization(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.ORGANIZATIONS.DELETE(id))
  }

  static async getOrganizationUsers(id: string): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(API_ENDPOINTS.ORGANIZATIONS.USERS(id))
  }

  static async inviteUser(id: string, email: string, role: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.ORGANIZATIONS.INVITE_USER(id), { email, role })
  }

  static async getBilling(id: string): Promise<ApiResponse<Invoice[]>> {
    return apiClient.get<Invoice[]>(API_ENDPOINTS.ORGANIZATIONS.BILLING(id))
  }

  static async testHL7Connection(id: string): Promise<ApiResponse<HL7TestResult>> {
    return apiClient.post<HL7TestResult>(API_ENDPOINTS.ORGANIZATIONS.TEST_HL7(id))
  }

  static async updateSettings(id: string, settings: OrganizationSettings): Promise<ApiResponse<void>> {
    return apiClient.put<void>(API_ENDPOINTS.ORGANIZATIONS.SETTINGS(id), settings)
  }

  // Radiologist-Organization Management
  static async getRadiologists(
    orgId: string, 
    filters?: { credentialingStatus?: string; modioHealthStatus?: string }
  ): Promise<ApiResponse<RadiologistOrganization[]>> {
    return apiClient.get<RadiologistOrganization[]>(
      API_ENDPOINTS.ORGANIZATIONS.RADIOLOGISTS(orgId), 
      { params: filters }
    )
  }

  static async assignRadiologists(
    orgId: string, 
    data: AssignRadiologistsRequest
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.ORGANIZATIONS.ASSIGN_RADIOLOGISTS(orgId), data)
  }

  static async getRadiologistDetail(
    orgId: string, 
    radId: string
  ): Promise<ApiResponse<RadiologistOrganization>> {
    return apiClient.get<RadiologistOrganization>(
      API_ENDPOINTS.ORGANIZATIONS.RADIOLOGIST_DETAIL(orgId, radId)
    )
  }

  static async updateRadiologist(
    orgId: string, 
    radId: string, 
    data: UpdateCredentialingRequest
  ): Promise<ApiResponse<void>> {
    return apiClient.put<void>(
      API_ENDPOINTS.ORGANIZATIONS.UPDATE_RADIOLOGIST(orgId, radId), 
      data
    )
  }

  static async removeRadiologist(orgId: string, radId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.ORGANIZATIONS.REMOVE_RADIOLOGIST(orgId, radId))
  }

  static async renewCredentialing(orgId: string, radId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.ORGANIZATIONS.RENEW_CREDENTIALING(orgId, radId))
  }

  static async getOrganizationStats(): Promise<ApiResponse<{
    totalOrganizations: number
    activeOrganizations: number
    totalUsers: number
    monthlyStudies: number
    totalOutstandingBalance: number
    organizationsWithOverdue: number
  }>> {
    return apiClient.get<{
      totalOrganizations: number
      activeOrganizations: number
      totalUsers: number
      monthlyStudies: number
      totalOutstandingBalance: number
      organizationsWithOverdue: number
    }>('/organizations/stats')
  }
}