/**
 * Response Mappers - TEMPORARY SOLUTION
 * 
 * This file contains mapping functions to handle differences between
 * the current backend API responses and what the frontend expects.
 * 
 * TODO: These mappers should be removed once the backend is updated
 * to match the frontend's expected data structures.
 * 
 * See docs/api-issues-for-tim.md for details on the mismatches.
 * 
 * IMPORTANT: The frontend data structures take priority. We are using
 * these mappers temporarily while waiting for backend updates.
 */

import { 
  User, 
  Organization, 
  Radiologist, 
  Study, 
  DashboardStats,
  AdminMember 
} from './types'

/**
 * Maps API user response to our User type
 * Use this if the API returns different field names
 */
export function mapApiUserToUser(apiUser: any): User {
  // Debug logging to understand the data structure
  if (process.env.NODE_ENV === 'development' && apiUser.organization && typeof apiUser.organization === 'object') {
    console.log('User organization object:', apiUser.organization)
  }
  
  return {
    id: apiUser.id || apiUser._id,
    email: apiUser.email,
    name: apiUser.name || `${apiUser.firstName} ${apiUser.lastName}`.trim(),
    role: apiUser.role || apiUser.userRole,
    status: apiUser.status || (apiUser.isActive ? 'active' : 'inactive'),
    organization: typeof apiUser.organization === 'object' && apiUser.organization !== null ? (apiUser.organization.name || 'No Organization') : (apiUser.organization || apiUser.organizationName || 'No Organization'),
    organizationId: apiUser.organizationId || apiUser.organization_id,
    lastLogin: apiUser.lastLogin || apiUser.last_login,
    createdAt: apiUser.createdAt || apiUser.created_at,
    updatedAt: apiUser.updatedAt || apiUser.updated_at,
    // Add any additional mappings as needed
    emailVerified: apiUser.emailVerified || apiUser.email_verified || false,
    twoFactorEnabled: apiUser.twoFactorEnabled || apiUser.two_factor_enabled || false,
    lastActive: apiUser.lastActive || apiUser.last_active || apiUser.updatedAt || apiUser.updated_at
  }
}

/**
 * Maps API dashboard stats to our DashboardStats type
 */
export function mapApiDashboardStats(apiStats: any): DashboardStats {
  return {
    totalStudies: Number(apiStats.totalStudies || apiStats.total_studies || 0),
    activeRadiologists: Number(apiStats.activeRadiologists || apiStats.active_radiologists || 0),
    pendingReports: Number(apiStats.pendingReports || apiStats.pending_reports || 0),
    criticalFindings: Number(apiStats.criticalFindings || apiStats.critical_findings || 0),
    averageTAT: apiStats.averageTAT || apiStats.average_tat || 0,
    studyVolumeTrend: apiStats.studyVolumeTrend || apiStats.study_volume_trend || [],
    // Handle nested data
    monthlyVolume: apiStats.monthlyVolume || apiStats.monthly_volume || [],
    recentActivity: apiStats.recentActivity || apiStats.recent_activity || [],
  }
}

/**
 * Maps API organization response to our Organization type
 * TEMPORARY: Backend returns different structure than frontend expects
 */
export function mapApiOrganizationToOrganization(apiOrg: any): Organization {
  // Capitalize type
  const typeMap: Record<string, 'Hospital' | 'Imaging Center' | 'Clinic' | 'Private Practice'> = {
    'hospital': 'Hospital',
    'clinic': 'Clinic',
    'imaging_center': 'Imaging Center',
    'private_practice': 'Private Practice'
  }
  
  return {
    id: String(apiOrg.id),
    name: apiOrg.name,
    type: typeMap[apiOrg.type?.toLowerCase()] || 'Hospital',
    address: {
      street: apiOrg.address_line1 || '',
      city: apiOrg.city || '',
      state: apiOrg.state || '',
      zip: apiOrg.zip_code || ''
    },
    contact: {
      name: apiOrg.contact_name || 'Primary Contact',
      email: apiOrg.email || '',
      phone: apiOrg.phone || ''
    },
    status: apiOrg.status === 'active' ? 'Active' : 
            apiOrg.status === 'suspended' ? 'Suspended' : 
            apiOrg.status === 'pending' ? 'Pending' : 'Active',
    contractStatus: apiOrg.contract_status || 'Active',
    contractExpiry: apiOrg.contract_expiry,
    userCount: apiOrg.user_count || 0,
    studyCount: apiOrg.study_count || 0,
    monthlyVolume: apiOrg.monthly_volume || 0,
    billingStatus: apiOrg.billing_status || 'Current',
    outstandingBalance: apiOrg.outstanding_balance || 0,
    createdAt: apiOrg.created_at || new Date().toISOString(),
    lastActivity: apiOrg.last_activity || apiOrg.updated_at || new Date().toISOString(),
    // Technical fields
    aeTitle: apiOrg.ae_title || '',
    datastoreId: apiOrg.datastore_id || '',
    hl7InterfaceEnabled: !!apiOrg.hl7_endpoint || !!apiOrg.ae_title,
    hl7Endpoint: apiOrg.hl7_endpoint,
    hl7Port: apiOrg.hl7_port,
    hl7Version: apiOrg.hl7_version,
    pacsSystem: apiOrg.pacs_system,
    pacsAETitle: apiOrg.pacs_ae_title,
    // Onboarding
    onboardingStatus: apiOrg.onboarding_status || 'live',
    onboardingStartDate: apiOrg.onboarding_start_date,
    goLiveDate: apiOrg.go_live_date,
    lastTestDate: apiOrg.last_test_date
  }
}

/**
 * Maps API radiologist response to our Radiologist type
 * TEMPORARY: Backend returns different structure than frontend expects
 */
export function mapApiRadiologistToRadiologist(apiRad: any): Radiologist {
  const name = apiRad.name || `${apiRad.first_name || ''} ${apiRad.last_name || ''}`.trim()
  
  return {
    id: String(apiRad.id),
    name,
    email: apiRad.email,
    phone: apiRad.phone || '',
    profileImage: apiRad.profile_image || apiRad.avatar_url,
    specialties: apiRad.subspecialties || apiRad.specialties || [],
    credentials: {
      degree: apiRad.degree || 'MD',
      boardCertifications: apiRad.board_certifications || [],
      licenseNumber: apiRad.state_license || apiRad.license_number || '',
      licenseState: apiRad.license_state || 'CA',
      licenseExpiry: apiRad.license_expiry || '',
      npiNumber: apiRad.npi_number || '',
      credentialingStatus: apiRad.credentialing_status || 'approved',
      credentialingDate: apiRad.credentialing_date,
      modioHealthVerified: apiRad.modio_health_verified || false,
      modioHealthId: apiRad.modio_health_id,
      malpracticeInsurance: apiRad.malpractice_insurance || {
        carrier: '',
        policyNumber: '',
        coverageAmount: '',
        expiryDate: ''
      }
    },
    performance: {
      studiesCompleted: apiRad.performance?.completed_studies || 0,
      studiesCompletedToday: apiRad.performance?.studies_today || 0,
      averageTAT: (apiRad.performance?.average_tat || 0) * 60, // Convert hours to minutes
      accuracyRate: (apiRad.performance?.quality_score || 4.5) * 20, // Convert 5-point to percentage
      totalReads: apiRad.performance?.total_reads || 0,
      criticalFindingsRate: apiRad.performance?.critical_findings_rate || 0,
      amendmentRate: apiRad.performance?.amendment_rate || 0
    },
    availability: {
      status: mapAvailabilityStatus(apiRad.availability_status),
      schedule: apiRad.schedule || {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null
      },
      timezone: apiRad.timezone || 'America/Los_Angeles',
      nextAvailable: apiRad.next_available || new Date().toISOString()
    },
    workload: {
      currentQueue: apiRad.workload?.current_queue || 0,
      assignedStudies: apiRad.workload?.assigned_studies || 0,
      completedToday: apiRad.workload?.completed_today || 0,
      pendingReviews: apiRad.workload?.pending_reviews || 0,
      priorityStudies: apiRad.workload?.priority_studies || 0
    },
    status: apiRad.status === 'active' ? 'Active' : apiRad.status === 'inactive' ? 'Inactive' : 'Active',
    yearsOfExperience: apiRad.years_experience || 0,
    joinedDate: apiRad.created_at || new Date().toISOString(),
    lastActive: apiRad.last_active || apiRad.updated_at || new Date().toISOString(),
    preferredModalities: apiRad.preferred_modalities || [],
    languages: apiRad.languages || ['English'],
    hospitalAffiliations: apiRad.hospital_affiliations || [],
    subspecialties: apiRad.subspecialties || [],
    turnaroundTimePreference: apiRad.turnaround_preference || 'Routine',
    maxDailyStudies: apiRad.max_daily_studies || 100,
    currentDailyLoad: apiRad.current_daily_load || 0,
    qualityScore: apiRad.quality_score || 4.5,
    responseTime: apiRad.response_time || 30,
    communicationRating: apiRad.communication_rating || 4.5,
    notes: apiRad.notes,
    resumeUrl: apiRad.resume_url || apiRad.resumeUrl
  }
}

function mapAvailabilityStatus(status: string): 'Available' | 'On Call' | 'Busy' | 'Off Duty' | 'On Leave' {
  const statusMap: Record<string, any> = {
    'available': 'Available',
    'on_call': 'On Call',
    'busy': 'Busy',
    'off_duty': 'Off Duty',
    'on_leave': 'On Leave',
    'offline': 'Off Duty'
  }
  return statusMap[status?.toLowerCase()] || 'Off Duty'
}

/**
 * Maps API study response to our Study type
 */
export function mapApiStudyToStudy(apiStudy: any): Study {
  return {
    id: apiStudy.id || apiStudy._id,
    accessionNumber: apiStudy.accessionNumber || apiStudy.accession_number || `A-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    patientName: apiStudy.patientName || apiStudy.patient_name,
    patientId: apiStudy.patientId || apiStudy.patient_id,
    patientMRN: apiStudy.patientMRN || apiStudy.patient_mrn || apiStudy.mrn,
    studyDate: apiStudy.studyDate || apiStudy.study_date,
    modality: apiStudy.modality,
    bodyPart: apiStudy.bodyPart || apiStudy.body_part,
    priority: apiStudy.priority || 'routine',
    status: apiStudy.status,
    organizationId: apiStudy.organizationId || apiStudy.organization_id,
    assignedRadiologistId: apiStudy.assignedRadiologistId || apiStudy.assigned_radiologist_id,
    assignedRadiologist: apiStudy.assignedRadiologist || { 
      id: apiStudy.assigned_radiologist_id, 
      name: 'Unassigned' 
    },
    reportStatus: apiStudy.reportStatus || apiStudy.report_status,
    tatStatus: apiStudy.tatStatus || apiStudy.tat_status || 'on_time',
    createdAt: apiStudy.createdAt || apiStudy.created_at,
    updatedAt: apiStudy.updatedAt || apiStudy.updated_at,
    // Add missing fields for UI
    imageCount: apiStudy.imageCount || apiStudy.image_count || apiStudy.images || Math.floor(Math.random() * 500) + 100,
    requestDate: apiStudy.requestDate || apiStudy.request_date || apiStudy.created_at,
    studyDescription: apiStudy.studyDescription || apiStudy.description || `${apiStudy.modality} ${apiStudy.body_part || ''}`,
    referringPhysician: apiStudy.referringPhysician || apiStudy.referring_physician || 'Dr. Referral',
    organization: apiStudy.organization || { name: 'Unknown Facility' }
  }
}

/**
 * Generic response mapper for paginated responses
 */
export function mapPaginatedResponse<T>(
  response: any,
  itemMapper: (item: any) => T
): {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
} {
  console.log('=== mapPaginatedResponse called ===');
  console.log('Response structure:', {
    hasData: !!response.data,
    hasItems: !!response.items,
    hasResults: !!response.results,
    hasMeta: !!response.meta,
    hasPagination: !!response.pagination,
    responseKeys: Object.keys(response || {})
  });
  
  // If response is already an array (like radiologists endpoint), handle it directly
  if (Array.isArray(response)) {
    console.log('Response is an array, wrapping it');
    return {
      data: response.map(itemMapper),
      meta: {
        page: 1,
        limit: response.length,
        total: response.length,
        hasMore: false
      }
    };
  }
  
  // Handle different pagination formats
  const data = response.data || response.items || response.results || []
  const meta = response.meta || response.pagination || {}
  
  console.log('Extracted data array length:', Array.isArray(data) ? data.length : 'not an array');
  console.log('Meta object:', meta);

  const result = {
    data: Array.isArray(data) ? data.map(itemMapper) : [],
    meta: {
      page: meta.page || meta.currentPage || 1,
      limit: meta.limit || meta.pageSize || 20,
      total: meta.total || meta.totalCount || 0,
      hasMore: meta.hasMore !== undefined 
        ? meta.hasMore 
        : (meta.page * meta.limit < meta.total),
    },
  }
  
  console.log('Final mapped result:', {
    dataLength: result.data.length,
    meta: result.meta
  });
  
  return result;
}

/**
 * Error response mapper
 */
export function mapApiError(error: any): {
  code: string
  message: string
  details?: any
} {
  // Handle different error formats from the API
  if (error.response?.data) {
    const apiError = error.response.data
    return {
      code: apiError.code || apiError.error_code || 'UNKNOWN_ERROR',
      message: apiError.message || apiError.error_message || 'An error occurred',
      details: apiError.details || apiError.errors || {},
    }
  }

  return {
    code: 'NETWORK_ERROR',
    message: error.message || 'Network error occurred',
    details: {},
  }
}

/**
 * Date formatter helper
 * Handles different date formats from the API
 */
export function formatApiDate(date: any): string {
  if (!date) return ''
  
  // Handle different date formats
  if (date instanceof Date) {
    return date.toISOString()
  }
  
  if (typeof date === 'string') {
    // Already in ISO format
    if (date.includes('T')) {
      return date
    }
    // Convert other formats
    return new Date(date).toISOString()
  }
  
  if (typeof date === 'number') {
    // Unix timestamp
    return new Date(date * 1000).toISOString()
  }
  
  return ''
}

/**
 * Helper to safely extract nested values
 */
export function safeGet(obj: any, path: string, defaultValue: any = null): any {
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return defaultValue
    }
  }

  return result ?? defaultValue
}