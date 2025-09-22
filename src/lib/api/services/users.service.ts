import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse, User, UserFilters, ActivityItem, AuditLog } from '../types'

export interface LoginHistoryItem {
  id: string
  timestamp: string
  ipAddress: string
  userAgent: string
  success: boolean
  location?: string
}

export interface CreateUserRequest {
  email: string
  name: string
  phone?: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RAD' | 'CLINIC' | 'BILLING'
  organizationId?: string
  password?: string
  twoFactorEnabled?: boolean
  sendInvitationEmail?: boolean
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'RAD' | 'CLINIC' | 'BILLING'
  organizationId?: string
  status?: 'active' | 'suspended' | 'inactive'
}

export class UsersService {
  static async getUsers(filters?: UserFilters): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST, { params: filters })
  }

  static async getUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id))
  }

  static async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.USERS.CREATE, data)
  }

  static async updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data)
  }

  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE(id))
  }

  static async resetPassword(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.USERS.RESET_PASSWORD(id))
  }

  static async toggle2FA(id: string, enabled: boolean): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.USERS.TOGGLE_2FA(id), { enabled })
  }

  static async suspendUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.USERS.SUSPEND(id))
  }

  static async activateUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.USERS.ACTIVATE(id))
  }

  static async getUserActivity(id: string): Promise<ApiResponse<ActivityItem[]>> {
    return apiClient.get<ActivityItem[]>(API_ENDPOINTS.USERS.ACTIVITY(id))
  }

  static async getLoginHistory(id: string): Promise<ApiResponse<LoginHistoryItem[]>> {
    return apiClient.get<LoginHistoryItem[]>(API_ENDPOINTS.USERS.LOGIN_HISTORY(id))
  }

  static async getUserStats(): Promise<ApiResponse<{
    totalUsers: number
    activeLastMonth: number
    licensedProfessionals: number
    facilityUsers: number
    pendingVerification: number
  }>> {
    return apiClient.get<{
      totalUsers: number
      activeLastMonth: number
      licensedProfessionals: number
      facilityUsers: number
      pendingVerification: number
    }>('/users/stats')
  }

  static async batchSuspend(userIds: string[], reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/users/batch-suspend', {
      user_ids: userIds,
      reason
    })
  }

  static async batchDelete(userIds: string[], reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/users/batch-delete', {
      user_ids: userIds,
      reason
    })
  }

  static async getUserStats(): Promise<ApiResponse<{
    totalUsers: number
    activeUsers: number
    radiologists: number
    healthcareStaff: number
    awaitingVerification: number
    loggedInLast30Days: number
    verifiedRadiologists: number
  }>> {
    return apiClient.get<{
      totalUsers: number
      activeUsers: number
      radiologists: number
      healthcareStaff: number
      awaitingVerification: number
      loggedInLast30Days: number
      verifiedRadiologists: number
    }>('/users/stats')
  }
}