import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse, LoginRequest, AdminMember } from '../types'

export interface LoginResponse {
  token: string
  refreshToken?: string
  user: AdminMember
  permissions: string[]
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Admin login expects form data with username field (not email)
    const params = new URLSearchParams()
    params.append('username', credentials.email) // Backend accepts email in username field
    params.append('password', credentials.password)
    
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT)
  }

  static async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
  }

  static async verify(): Promise<ApiResponse<AdminMember>> {
    return apiClient.get<AdminMember>(API_ENDPOINTS.AUTH.VERIFY)
  }

  static async getPermissions(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(API_ENDPOINTS.AUTH.PERMISSIONS)
  }
}