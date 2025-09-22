// API Response Types

// Base Response Structure
export interface ApiResponse<T = any> {
  success: boolean
  data: T | null
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
  error?: ApiError | null
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Common Types
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'
export type UserStatus = 'Active' | 'Inactive' | 'Locked' | 'Pending' | 'Invited' | 'Suspended'
export type OrganizationStatus = 'Active' | 'Suspended' | 'Inactive'
export type ContractStatus = 'Active' | 'Expired' | 'Pending' | 'None'
export type BillingStatus = 'Current' | 'Overdue' | 'Pending'
export type OnboardingStatus = 'pending' | 'credentialing' | 'technical-setup' | 'testing' | 'live' | 'suspended'
export type CredentialingStatus = 'Pending' | 'In Progress' | 'Approved' | 'Expired' | 'Rejected'
export type ModioHealthStatus = 'Not Started' | 'Submitted' | 'Verified' | 'Issues Found'
export type StudyStatus = 'In Review' | 'Completed' | 'Error' | 'Pending'
export type StudyPriority = 'STAT' | 'Urgent' | 'Routine'

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: string
  organization: string
  status: UserStatus
  lastActive?: string
  createdAt: string
  updatedAt: string
  emailVerified?: boolean
  twoFactorEnabled?: boolean
  loginCount?: number
  failedAttempts?: number
}

// Admin Member Types
export interface AdminMember {
  id: string
  email: string
  name: string
  role: AdminRole
  status: UserStatus
  lastActive?: string
  invitedBy: string
  invitedAt: string
  acceptedAt?: string
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

// Radiologist Types
export interface Radiologist {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  specialties: string[]
  credentials: string
  licenseNumber: string
  yearsOfExperience: number
  status: 'active' | 'inactive' | 'on_leave'
  availability: 'available' | 'busy' | 'offline'
  performanceMetrics?: {
    totalStudies: number
    avgTurnaroundTime: number
    accuracyRate: number
    patientSatisfaction: number
  }
  createdAt: string
  updatedAt: string
  resumeUrl?: string
}

// Organization Types
export interface Organization {
  id: string
  name: string
  type: 'Hospital' | 'Imaging Center' | 'Clinic'
  status: OrganizationStatus
  contractStatus: ContractStatus
  billingStatus: BillingStatus
  aeTitle: string
  datastoreId: string
  hl7InterfaceEnabled: boolean
  hl7Settings?: {
    endpoint?: string
    port?: number
    version?: string
  }
  onboardingStatus?: OnboardingStatus
  radiologistCount?: number
  radiologistRequirements?: {
    minimum: number
    specialties: string[]
  }
  createdAt: string
  contact?: {
    name: string
    email: string
    phone: string
  }
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  // Additional UI fields
  address?: string
  userCount?: number
  hl7Config?: {
    enabled: boolean
  }
  contactEmail?: string
  contactPhone?: string
}

// Radiologist-Organization Relationship
export interface RadiologistOrganization {
  id: string
  radiologistId: string
  radiologistName: string
  organizationId: string
  organizationName: string
  credentialingStatus: CredentialingStatus
  modioHealthStatus: ModioHealthStatus
  assignedDate: string
  credentialingDate?: string
  expiryDate?: string
  privileges: string[]
  notes?: string
  requestedBy: string
  lastModifiedBy?: string
  lastModifiedAt?: string
}

// Study Types
export interface Study {
  id: string
  accession: string
  patientName: {
    first: string
    last: string
  }
  mrn: string
  status: StudyStatus
  priority: StudyPriority
  modality: string
  organization: string
  organizationName?: string
  assignedRadiologist?: string
  assignedRadiologistName?: string
  workflowStages?: WorkflowStage[]
  createdAt: string
  updatedAt?: string
  bodyPart?: string
  studyDescription?: string
  imageCount?: number
  studyDate?: string
}

export interface WorkflowStage {
  stage: string
  status: 'completed' | 'in-progress' | 'pending'
  timestamp?: string
  user?: string
}

// Dashboard Types
export interface DashboardStats {
  totalStudies: number
  activeRadiologists: number
  organizations: number
  monthlyVolume: number
  revenue: number
  tatCompliance: number
  studiesByStatus: Record<StudyStatus, number>
  recentActivity: ActivityItem[]
  pendingReports?: number
  criticalFindings?: number
  studiesChangePercent?: string
  radiologistsChangePercent?: string
  organizationsChangePercent?: string
  volumeChangePercent?: string
  reportsChangePercent?: string
  findingsChangePercent?: string
  criticalChangePercent?: string
}

export interface ActivityItem {
  id: string
  type: 'study' | 'user' | 'billing' | 'system'
  action: string
  description: string
  timestamp: string
  user?: string
  metadata?: Record<string, any>
}

// Billing Types
export interface Invoice {
  id: string
  organizationId: string
  organizationName: string
  invoiceNumber: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled'
  dueDate: string
  createdAt: string
  paidAt?: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Audit Types
export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  ipAddress: string
  userAgent: string
  timestamp: string
  changes?: Record<string, any>
}

// System Types
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  services: {
    database: ServiceStatus
    cache: ServiceStatus
    storage: ServiceStatus
    hl7: ServiceStatus
    dicom: ServiceStatus
  }
  uptime: number
  version: string
}

export interface ServiceStatus {
  status: 'up' | 'down'
  latency?: number
  error?: string
}

// Notification Types
export interface NotificationTemplate {
  id: string
  name: string
  description: string
  subject: string
  body: string
  variables: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

// Request Types
export interface LoginRequest {
  email: string
  password: string
  mfaCode?: string
}

export interface InviteAdminRequest {
  email: string
  name: string
  role: AdminRole
  permissions?: string[]
  customMessage?: string
  sendImmediately?: boolean
}

export interface AssignRadiologistsRequest {
  radiologistIds: string[]
  assignments: {
    radiologistId: string
    privileges: string[]
  }[]
}

export interface UpdateCredentialingRequest {
  privileges?: string[]
  credentialingStatus?: CredentialingStatus
  modioHealthStatus?: ModioHealthStatus
  notes?: string
}

export interface GenerateReportRequest {
  type: string
  filters: Record<string, any>
  format: 'pdf' | 'csv' | 'excel'
}

// Filter Types
export interface UserFilters extends PaginationParams {
  search?: string
  role?: 'RAD' | 'CLINIC' | 'BILLING'
  status?: 'active' | 'inactive' | 'pending_verification'
  organization?: string
}

export interface OrganizationFilters extends PaginationParams {
  search?: string
  status?: OrganizationStatus
  type?: string
  contractStatus?: ContractStatus
}

export interface StudyFilters extends PaginationParams {
  search?: string
  status?: StudyStatus
  priority?: StudyPriority
  organization?: string
  radiologist?: string
  dateFrom?: string
  dateTo?: string
}

export interface RadiologistFilters extends PaginationParams {
  search?: string
  specialty?: string
  status?: string
  availability?: string
}

export interface AuditLogFilters extends PaginationParams {
  user?: string
  action?: string
  resource?: string
  dateFrom?: string
  dateTo?: string
}

export interface MemberFilters extends PaginationParams {
  search?: string
  role?: string
  status?: string
}