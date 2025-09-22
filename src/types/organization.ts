export interface Organization {
  id: string
  name: string
  type: 'Hospital' | 'Clinic' | 'Imaging Center' | 'Private Practice'
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  contact: {
    name: string
    email: string
    phone: string
  }
  status: 'Active' | 'Suspended' | 'Pending' | 'Inactive'
  contractStatus: 'Active' | 'Expired' | 'Pending' | 'None'
  contractExpiry?: string
  userCount: number
  studyCount: number
  monthlyVolume: number
  billingStatus: 'Current' | 'Overdue' | 'Pending'
  outstandingBalance: number
  createdAt: string
  lastActivity: string
  // Technical integration fields
  aeTitle: string
  datastoreId: string
  
  // HL7 Integration fields
  hl7InterfaceEnabled: boolean
  hl7Endpoint?: string
  hl7Port?: number
  hl7Version?: string
  pacsSystem?: string
  pacsAETitle?: string
  
  // Onboarding status
  onboardingStatus: 'pending' | 'credentialing' | 'technical-setup' | 'testing' | 'live' | 'suspended'
  onboardingStartDate?: string
  goLiveDate?: string
  lastTestDate?: string
}