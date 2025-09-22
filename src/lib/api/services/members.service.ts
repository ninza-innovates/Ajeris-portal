import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse, AdminMember, InviteAdminRequest, PaginationParams } from '../types'

export interface MemberFilters extends PaginationParams {
  search?: string
  role?: string
  status?: string
}

export interface InvitationResponse {
  invitationId: string
  expiresAt: string
}

export class MembersService {
  static async getMembers(filters?: MemberFilters): Promise<ApiResponse<AdminMember[]>> {
    return apiClient.get<AdminMember[]>(API_ENDPOINTS.MEMBERS.LIST, { params: filters })
  }

  static async getMember(id: string): Promise<ApiResponse<AdminMember>> {
    return apiClient.get<AdminMember>(API_ENDPOINTS.MEMBERS.DETAIL(id))
  }

  static async inviteMember(data: InviteAdminRequest): Promise<ApiResponse<InvitationResponse>> {
    return apiClient.post<InvitationResponse>(API_ENDPOINTS.MEMBERS.INVITE, data)
  }

  static async updateMember(id: string, data: Partial<AdminMember>): Promise<ApiResponse<AdminMember>> {
    return apiClient.put<AdminMember>(API_ENDPOINTS.MEMBERS.UPDATE(id), data)
  }

  static async suspendMember(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.MEMBERS.SUSPEND(id))
  }

  static async activateMember(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.MEMBERS.ACTIVATE(id))
  }

  static async deleteMember(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.MEMBERS.DELETE(id))
  }

  static async resendInvitation(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.MEMBERS.RESEND_INVITATION(id))
  }

  static async cancelInvitation(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.MEMBERS.CANCEL_INVITATION(id))
  }
}