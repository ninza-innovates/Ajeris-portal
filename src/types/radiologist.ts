export interface Radiologist {
  id: string
  name: string
  email: string
  phone: string
  profileImage?: string
  specialties: string[]
  credentials: {
    degree: string
    boardCertifications: string[]
    licenseNumber: string
    licenseState: string
    licenseExpiry: string
    npiNumber: string
    
    // Credentialing status
    credentialingStatus: 'pending' | 'in-review' | 'approved' | 'expired' | 'rejected'
    credentialingDate?: string
    modioHealthVerified: boolean
    modioHealthId?: string
    malpracticeInsurance: {
      carrier: string
      policyNumber: string
      coverageAmount: string
      expiryDate: string
    }
  }
  performance: {
    studiesCompleted: number
    studiesCompletedToday: number
    averageTAT: number // in minutes
    accuracyRate: number // percentage
    totalReads: number
    criticalFindingsRate: number // percentage
    amendmentRate: number // percentage
  }
  availability: {
    status: 'Available' | 'On Call' | 'Busy' | 'Off Duty' | 'On Leave'
    schedule: {
      monday: { start: string; end: string } | null
      tuesday: { start: string; end: string } | null
      wednesday: { start: string; end: string } | null
      thursday: { start: string; end: string } | null
      friday: { start: string; end: string } | null
      saturday: { start: string; end: string } | null
      sunday: { start: string; end: string } | null
    }
    timezone: string
    nextAvailable: string
  }
  workload: {
    currentQueue: number
    assignedStudies: number
    completedToday: number
    pendingReviews: number
    priorityStudies: number
  }
  status: 'Active' | 'Inactive' | 'Suspended' | 'On Leave'
  yearsOfExperience: number
  joinedDate: string
  lastActive: string
  preferredModalities: string[]
  languages: string[]
  hospitalAffiliations: string[]
  subspecialties?: string[]
  turnaroundTimePreference: 'STAT' | 'Urgent' | 'Routine'
  maxDailyStudies: number
  currentDailyLoad: number
  qualityScore: number // 1-5
  responseTime: number // average in minutes
  communicationRating: number // 1-5
  notes?: string
  resumeUrl?: string // URL to uploaded resume document
}