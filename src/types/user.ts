export interface User {
  id: string
  name: string
  email: string
  type: 'Expert' | 'Healthcare'
  typeLabel: string
  organization: string
  role: 'admin' | 'super_admin' | 'editor' | 'viewer' | 'RAD' | 'CLINIC' | 'BILLING' | 'ADMIN'
  status: 'active' | 'suspended' | 'locked' | 'inactive' | 'Active' | 'Suspended' | 'Locked' | 'Inactive'
  emailVerified: boolean
  twoFactorEnabled: boolean
  loginCount: number
  failedAttempts: number
  licenseStatus: 'Active' | 'Expiring' | 'Expired' | 'N/A'
  contractStatus: 'Signed' | 'Pending' | 'Expired' | 'N/A'
  trainingCompleted: boolean
  created: string
  lastActive: string
  hasNotes: boolean
  accountLocked: boolean
  createdBy: string
  studiesReviewed?: number
  studiesSubmitted?: number
  
  // Additional fields for detailed view
  phone?: string
  department?: string
  manager?: string
  location?: string
  timezone?: string
  language?: string
  createdAt?: string
  lastLogin?: string
  accountType?: string
  bio?: string
  passwordLastChanged?: string
  failedLoginAttempts?: number
  isLocked?: boolean
}