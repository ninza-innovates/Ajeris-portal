import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse } from '../types'

export type CredentialType = 'license' | 'board_certification' | 'dea' | 'npi' | 'malpractice'
export type CredentialStatus = 'active' | 'expired' | 'expiring_soon' | 'pending' | 'suspended'
export type CredentialingRequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected'

export interface Credential {
  id: string
  radiologistId: string
  radiologistName: string
  type: CredentialType
  number: string
  issuingAuthority: string
  state?: string
  issueDate: string
  expiryDate: string
  status: CredentialStatus
  verifiedBy?: string
  verifiedAt?: string
  documents?: Array<{
    id: string
    name: string
    uploadedAt: string
    url: string
  }>
  notes?: string
}

export interface CredentialingStats {
  totalRadiologists: number
  fullyCredentialed: number
  pendingCredentials: number
  expiringWithin30Days: number
  expiredCredentials: number
  avgDaysToCredential: number
  byState: Record<string, number>
}

export interface ExpiringCredential {
  id: string
  radiologistId: string
  radiologistName: string
  radiologistEmail: string
  credentialType: CredentialType
  credentialNumber: string
  expiryDate: string
  daysUntilExpiry: number
  state?: string
  lastNotificationSent?: string
}

export interface CredentialingRequest {
  id: string
  radiologistId: string
  radiologistName: string
  organizationId: string
  organizationName: string
  requestDate: string
  status: CredentialingRequestStatus
  requiredCredentials: CredentialType[]
  submittedCredentials: CredentialType[]
  missingCredentials: CredentialType[]
  assignedTo?: string
  completedAt?: string
  notes?: string
}

export interface CredentialingDocument {
  id: string
  credentialId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
}

export interface ModioHealthCredential {
  providerId: string
  providerName: string
  credentialType: string
  status: string
  expirationDate?: string
  lastVerified: string
  modioHealthId: string
}

export class CredentialingService {
  static async getStats(): Promise<ApiResponse<CredentialingStats>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Credentialing stats endpoint not yet implemented - GET /api/admin/credentialing/stats')
  }

  static async syncWithModioHealth(): Promise<ApiResponse<{
    synced: number
    updated: number
    errors: number
    details: Array<{
      radiologistId: string
      status: 'synced' | 'updated' | 'error'
      message?: string
    }>
  }>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('ModioHealth sync endpoint not yet implemented - POST /api/admin/credentialing/modiohealth/sync')
  }

  static async getExpiringCredentials(params?: {
    daysAhead?: number
    credentialType?: CredentialType
    state?: string
  }): Promise<ApiResponse<ExpiringCredential[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Expiring credentials endpoint not yet implemented - GET /api/admin/credentialing/expiring')
  }

  static async getCredentials(radiologistId: string): Promise<ApiResponse<Credential[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Get radiologist credentials endpoint not yet implemented - GET /api/admin/radiologists/{id}/credentials')
  }

  static async getCredentialDetails(credentialId: string): Promise<ApiResponse<Credential>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Get credential details endpoint not yet implemented - GET /api/admin/credentialing/{id}')
  }

  static async updateCredential(
    credentialId: string,
    data: Partial<Credential>
  ): Promise<ApiResponse<Credential>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Update credential endpoint not yet implemented - PUT /api/admin/credentialing/{id}')
  }

  static async uploadCredentialDocument(
    credentialId: string,
    file: File
  ): Promise<ApiResponse<CredentialingDocument>> {
    const formData = new FormData()
    formData.append('file', file)
    
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Upload credential document endpoint not yet implemented - POST /api/admin/credentialing/{id}/documents')
  }

  static async verifyDocument(
    documentId: string,
    verified: boolean,
    reason?: string
  ): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Verify document endpoint not yet implemented - POST /api/admin/credentialing/documents/{id}/verify')
  }

  static async getCredentialingRequests(params?: {
    status?: CredentialingRequestStatus
    organizationId?: string
    assignedTo?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<CredentialingRequest[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Credentialing requests endpoint not yet implemented - GET /api/admin/credentialing/requests')
  }

  static async updateRequestStatus(
    requestId: string,
    status: CredentialingRequestStatus,
    notes?: string
  ): Promise<ApiResponse<CredentialingRequest>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Update credentialing request endpoint not yet implemented - PUT /api/admin/credentialing/requests/{id}/status')
  }

  static async assignRequest(
    requestId: string,
    assignedTo: string
  ): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Assign credentialing request endpoint not yet implemented - POST /api/admin/credentialing/requests/{id}/assign')
  }

  static async getModioHealthCredentials(
    radiologistId: string
  ): Promise<ApiResponse<ModioHealthCredential[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Get ModioHealth credentials endpoint not yet implemented - GET /api/admin/credentialing/modiohealth/radiologist/{id}')
  }

  static async linkModioHealthProfile(
    radiologistId: string,
    modioHealthId: string
  ): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Link ModioHealth profile endpoint not yet implemented - POST /api/admin/credentialing/modiohealth/link')
  }

  static async generateCredentialingReport(params: {
    startDate: string
    endDate: string
    includeExpired?: boolean
    byState?: boolean
  }): Promise<ApiResponse<{
    reportId: string
    downloadUrl: string
  }>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Generate credentialing report endpoint not yet implemented - POST /api/admin/credentialing/report')
  }
}