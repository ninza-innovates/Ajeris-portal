import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse, Radiologist, RadiologistFilters, RadiologistOrganization, Study } from '../types'
import { mapApiRadiologistToRadiologist, mapPaginatedResponse } from '../response-mappers'

export interface RadiologistCredentials {
  npi: string
  licenseNumber: string
  licenseState: string
  modioHealthId?: string
  credentialingStatus?: string
}

export interface RadiologistPerformance {
  studiesCompleted: number
  averageTAT: number
  qualityScore: number
  monthlyTrend: {
    month: string
    studies: number
    tat: number
  }[]
}

export class RadiologistsService {
  static async getRadiologists(filters?: RadiologistFilters): Promise<ApiResponse<Radiologist[]>> {
    console.log('=== RadiologistsService.getRadiologists called ===');
    console.log('Filters:', filters);
    console.log('Endpoint:', API_ENDPOINTS.RADIOLOGISTS.LIST);
    
    try {
      const response = await apiClient.get<any[]>(API_ENDPOINTS.RADIOLOGISTS.LIST, { params: filters })
      console.log('Raw API Response received:', response);
      
      // Apply mapper to transform backend response to frontend format
      // TODO: Remove this mapper once backend is updated to match frontend expectations
      if (response.success && response.data) {
        console.log('Response has data, type:', Array.isArray(response.data) ? 'array' : typeof response.data);
        
        // If the data is already an array of radiologists
        if (Array.isArray(response.data)) {
          const mappedData = response.data.map(mapApiRadiologistToRadiologist);
          return {
            ...response,
            data: mappedData,
            meta: response.meta || {
              page: 1,
              limit: response.data.length,
              total: response.data.length,
              hasMore: false
            }
          }
        } else {
          // If it's wrapped in pagination structure
          const mapped = mapPaginatedResponse(response.data, mapApiRadiologistToRadiologist)
          console.log('Mapped data:', mapped);
          return {
            ...response,
            data: mapped.data,
            meta: mapped.meta
          }
        }
      }
      
      console.log('No data in response, returning as is');
      return response as ApiResponse<Radiologist[]>
    } catch (error) {
      console.error('Error in getRadiologists:', error);
      throw error;
    }
  }

  static async getRadiologist(id: string): Promise<ApiResponse<Radiologist>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.RADIOLOGISTS.DETAIL(id))
    
    // Apply mapper to transform backend response to frontend format
    // TODO: Remove this mapper once backend is updated to match frontend expectations
    if (response.data) {
      return {
        ...response,
        data: mapApiRadiologistToRadiologist(response.data)
      }
    }
    
    return response as ApiResponse<Radiologist>
  }

  static async updateRadiologist(id: string, data: Partial<Radiologist>): Promise<ApiResponse<Radiologist>> {
    return apiClient.put<Radiologist>(API_ENDPOINTS.RADIOLOGISTS.UPDATE(id), data)
  }

  static async updateCredentials(id: string, credentials: RadiologistCredentials): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.RADIOLOGISTS.CREDENTIALS(id), credentials)
  }

  static async getPerformance(id: string): Promise<ApiResponse<RadiologistPerformance>> {
    return apiClient.get<RadiologistPerformance>(API_ENDPOINTS.RADIOLOGISTS.PERFORMANCE(id))
  }

  static async getStudies(id: string): Promise<ApiResponse<Study[]>> {
    return apiClient.get<Study[]>(API_ENDPOINTS.RADIOLOGISTS.STUDIES(id))
  }

  static async toggleAvailability(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.RADIOLOGISTS.TOGGLE_AVAILABILITY(id))
  }

  static async assignStudy(id: string, studyId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.RADIOLOGISTS.ASSIGN_STUDY(id), { studyId })
  }

  static async getOrganizations(id: string): Promise<ApiResponse<RadiologistOrganization[]>> {
    return apiClient.get<RadiologistOrganization[]>(API_ENDPOINTS.RADIOLOGISTS.ORGANIZATIONS(id))
  }

  static async getRadiologistStats(): Promise<ApiResponse<{
    totalRadiologists: number
    activeRadiologists: number
    onCallNow: number
    studiesThisMonth: number
    averageTAT: number
    pendingCredentials: number
  }>> {
    return apiClient.get<{
      totalRadiologists: number
      activeRadiologists: number
      onCallNow: number
      studiesThisMonth: number
      averageTAT: number
      pendingCredentials: number
    }>('/radiologists/stats')
  }
}