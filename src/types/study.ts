export interface Study {
  id: string
  requestDate: string
  studyDate: string
  patientName: {
    first: string
    last: string
  }
  mrn: string
  accession: string
  images: number
  status: 'In Review' | 'Completed' | 'Error' | 'Pending'
  priority: 'STAT' | 'Urgent' | 'Routine' | 'Standard'
  studyType: string
  radiologist: string
  hospital: string
  organization: string
  billingStatus: 'Paid' | 'Submitted' | 'Pending' | 'Failed' | 'Not Started'
  compliance: 'Compliant' | 'Flagged' | 'Under Review'
  tat: 'On Time' | 'At Risk' | 'Overdue'
  
  // HL7 Integration fields
  hl7OrderId?: string
  hl7MessageControlId?: string
  orderingProvider?: string
  referringPhysician?: string
  
  // AI Processing
  aiDraftGeneratedAt?: string
  aiModel?: string
  aiConfidenceScore?: number
}