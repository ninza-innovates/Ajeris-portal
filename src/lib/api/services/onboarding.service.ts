import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse } from '../types'

export interface OnboardingStatus {
  // Placeholder interface
  orgId: string
  status: string
  progress: number
  completedSteps: string[]
}

export interface OnboardingChecklist {
  // Placeholder interface
  id: string
  title: string
  completed: boolean
  required: boolean
}

export interface OnboardingTask {
  // Placeholder interface
  id: string
  title: string
  description: string
  status: string
}

export class OnboardingService {
  static async getList(): Promise<ApiResponse<OnboardingStatus[]>> {
    throw new Error('OnboardingService.getList is not implemented yet')
  }

  static async getStatus(orgId: string): Promise<ApiResponse<OnboardingStatus>> {
    throw new Error('OnboardingService.getStatus is not implemented yet')
  }

  static async updateStatus(orgId: string, data: Partial<OnboardingStatus>): Promise<ApiResponse<OnboardingStatus>> {
    throw new Error('OnboardingService.updateStatus is not implemented yet')
  }

  static async getChecklist(orgId: string): Promise<ApiResponse<OnboardingChecklist[]>> {
    throw new Error('OnboardingService.getChecklist is not implemented yet')
  }

  static async getTasks(): Promise<ApiResponse<OnboardingTask[]>> {
    throw new Error('OnboardingService.getTasks is not implemented yet')
  }

  static async getRadiologistRequirements(orgId: string): Promise<ApiResponse<any>> {
    throw new Error('OnboardingService.getRadiologistRequirements is not implemented yet')
  }

  static async completeCredentialing(orgId: string): Promise<ApiResponse<void>> {
    throw new Error('OnboardingService.completeCredentialing is not implemented yet')
  }
}