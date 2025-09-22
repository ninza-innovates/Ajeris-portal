export interface RadiologistOrganization {
  id: string
  radiologistId: string
  radiologistName: string
  organizationId: string
  organizationName: string
  credentialingStatus: 'Pending' | 'In Progress' | 'Approved' | 'Expired' | 'Rejected'
  modioHealthStatus: 'Not Started' | 'Submitted' | 'Verified' | 'Issues Found'
  assignedDate: string
  credentialingDate?: string
  expiryDate?: string
  privileges: string[]
  notes?: string
  requestedBy: string
}

export const mockRadiologistOrganizations: RadiologistOrganization[] = [
  // City Hospital
  {
    id: '1',
    radiologistId: '1',
    radiologistName: 'Dr. Sarah Johnson',
    organizationId: 'org-1',
    organizationName: 'City Hospital',
    credentialingStatus: 'Approved',
    modioHealthStatus: 'Verified',
    assignedDate: '2024-01-15',
    credentialingDate: '2024-01-20',
    expiryDate: '2025-01-20',
    privileges: ['CT', 'MRI', 'X-Ray', 'Ultrasound'],
    requestedBy: 'Emily Rodriguez',
  },
  {
    id: '2',
    radiologistId: '2',
    radiologistName: 'Dr. Michael Chen',
    organizationId: 'org-1',
    organizationName: 'City Hospital',
    credentialingStatus: 'In Progress',
    modioHealthStatus: 'Submitted',
    assignedDate: '2024-01-10',
    privileges: ['CT', 'MRI'],
    notes: 'Awaiting state license verification',
    requestedBy: 'Emily Rodriguez',
  },
  // Rural Clinic
  {
    id: '3',
    radiologistId: '2',
    radiologistName: 'Dr. Michael Chen',
    organizationId: 'org-2',
    organizationName: 'Rural Clinic',
    credentialingStatus: 'Approved',
    modioHealthStatus: 'Verified',
    assignedDate: '2023-11-01',
    credentialingDate: '2023-11-15',
    expiryDate: '2024-11-15',
    privileges: ['X-Ray', 'Ultrasound'],
    requestedBy: 'System Admin',
  },
  {
    id: '4',
    radiologistId: '3',
    radiologistName: 'Dr. Lisa Wang',
    organizationId: 'org-2',
    organizationName: 'Rural Clinic',
    credentialingStatus: 'Pending',
    modioHealthStatus: 'Not Started',
    assignedDate: '2024-01-18',
    privileges: ['X-Ray'],
    notes: 'New assignment - credentialing not started',
    requestedBy: 'Mark Thompson',
  },
  // Metro Health
  {
    id: '5',
    radiologistId: '4',
    radiologistName: 'Dr. James Wilson',
    organizationId: 'org-3',
    organizationName: 'Metro Health',
    credentialingStatus: 'Expired',
    modioHealthStatus: 'Verified',
    assignedDate: '2023-03-01',
    credentialingDate: '2023-03-15',
    expiryDate: '2024-03-15',
    privileges: ['CT', 'MRI', 'PET'],
    notes: 'Credentialing expired - renewal required',
    requestedBy: 'System Admin',
  },
  {
    id: '6',
    radiologistId: '5',
    radiologistName: 'Dr. Emily Martinez',
    organizationId: 'org-3',
    organizationName: 'Metro Health',
    credentialingStatus: 'Approved',
    modioHealthStatus: 'Verified',
    assignedDate: '2023-06-01',
    credentialingDate: '2023-06-20',
    expiryDate: '2024-06-20',
    privileges: ['MRI', 'CT', 'Nuclear Medicine'],
    requestedBy: 'John Davis',
  },
  // County General
  {
    id: '7',
    radiologistId: '1',
    radiologistName: 'Dr. Sarah Johnson',
    organizationId: 'org-4',
    organizationName: 'County General',
    credentialingStatus: 'Rejected',
    modioHealthStatus: 'Issues Found',
    assignedDate: '2024-01-05',
    privileges: [],
    notes: 'Malpractice insurance does not meet minimum requirements',
    requestedBy: 'Admin User',
  },
  // Women's Health Center
  {
    id: '8',
    radiologistId: '6',
    radiologistName: 'Dr. Robert Kim',
    organizationId: 'org-5',
    organizationName: "Women's Health Center",
    credentialingStatus: 'Approved',
    modioHealthStatus: 'Verified',
    assignedDate: '2023-09-01',
    credentialingDate: '2023-09-15',
    expiryDate: '2024-09-15',
    privileges: ['Mammography', 'Ultrasound', 'MRI'],
    requestedBy: 'Maria Garcia',
  },
]

// Helper function to get radiologists by organization
export function getRadiologistsByOrganization(organizationId: string) {
  return mockRadiologistOrganizations.filter(
    ro => ro.organizationId === organizationId
  )
}

// Helper function to get organizations by radiologist
export function getOrganizationsByRadiologist(radiologistId: string) {
  return mockRadiologistOrganizations.filter(
    ro => ro.radiologistId === radiologistId
  )
}

// Helper function to get credentialing stats
export function getCredentialingStats(organizationId?: string) {
  const filtered = organizationId 
    ? mockRadiologistOrganizations.filter(ro => ro.organizationId === organizationId)
    : mockRadiologistOrganizations

  return {
    total: filtered.length,
    approved: filtered.filter(ro => ro.credentialingStatus === 'Approved').length,
    pending: filtered.filter(ro => ro.credentialingStatus === 'Pending').length,
    inProgress: filtered.filter(ro => ro.credentialingStatus === 'In Progress').length,
    expired: filtered.filter(ro => ro.credentialingStatus === 'Expired').length,
    rejected: filtered.filter(ro => ro.credentialingStatus === 'Rejected').length,
  }
}