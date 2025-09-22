import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse, DashboardStats, ActivityItem } from '../types'

export interface TrendsParams {
  period: '7d' | '30d' | '90d' | '1y'
  metric: 'studies' | 'revenue' | 'tat'
}

export interface ActivityParams {
  limit?: number
  type?: 'all' | 'studies' | 'users' | 'billing'
}

export interface TrendsData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
  }[]
}

export class DashboardService {
  static async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS)
  }

  static async getActivity(params?: ActivityParams): Promise<ApiResponse<ActivityItem[]>> {
    return apiClient.get<ActivityItem[]>(API_ENDPOINTS.DASHBOARD.ACTIVITY, {
      params,
    })
  }

  static async getTrends(params: TrendsParams): Promise<ApiResponse<TrendsData>> {
    return apiClient.get<TrendsData>(API_ENDPOINTS.DASHBOARD.TRENDS, {
      params,
    })
  }
}