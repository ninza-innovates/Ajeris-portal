export interface StudyDetails {
  id: string
  requestDate: string
  studyDate: string
  patientName: {
    first: string
    last: string
  }
  patientDOB: string
  patientAge: string
  patientGender: string
  mrn: string
  accession: string
  images: number
  status: 'In Review' | 'Completed' | 'Error' | 'Pending'
  priority: 'STAT' | 'Urgent' | 'Routine' | 'Standard'
  studyType: string
  studyDescription: string
  modality: string
  bodyPart: string
  radiologist: {
    id: string
    name: string
    email: string
    phone: string
    specialties: string[]
    availability: 'Available' | 'Busy' | 'Offline'
  }
  referringPhysician: {
    name: string
    department: string
    phone: string
  }
  hospital: string
  organization: string
  sourceAETitle: string // Added for tracking study origin
  billingStatus: 'Paid' | 'Submitted' | 'Pending' | 'Failed' | 'Not Started'
  compliance: 'Compliant' | 'Flagged' | 'Under Review'
  tat: 'On Time' | 'At Risk' | 'Overdue'
  clinicalHistory: string
  indication: string
  technique: string
  comparison: string
  report: {
    status: 'Draft' | 'Final' | 'Amended' | 'Not Started'
    content: string
    createdAt: string
    updatedAt: string
    finalizedAt?: string
    finalizedBy?: string
  }
  files: {
    id: string
    name: string
    type: 'DICOM' | 'PDF' | 'Image' | 'Other'
    size: string
    uploadedAt: string
    uploadedBy: string
    validated: boolean
    validatedBy?: string
    validatedAt?: string
  }[]
  timeline: {
    id: string
    timestamp: string
    event: string
    user: string
    details?: string
    type: 'status_change' | 'assignment' | 'upload' | 'report' | 'billing' | 'compliance' | 'admin_action'
  }[]
  workflowStages: {
    stage: string
    status: 'completed' | 'in_progress' | 'pending' | 'error' | 'future'
    completedAt?: string
    completedBy?: string
    startedAt?: string
    assignedTo?: string
    note?: string
  }[]
}

export const mockStudyDetails: StudyDetails = {
  id: '1',
  requestDate: 'Dec 20, 2024, 2:20 PM',
  studyDate: 'Dec 20, 2024, 1:45 PM',
  patientName: { first: 'Alice', last: 'Brown' },
  patientDOB: '1985-03-15',
  patientAge: '39 years',
  patientGender: 'Female',
  mrn: '654321',
  accession: 'A-1002',
  images: 560,
  status: 'In Review',
  priority: 'STAT',
  studyType: 'CT Chest • Contrast Enhanced',
  studyDescription: 'CT CHEST WITH IV CONTRAST',
  modality: 'CT',
  bodyPart: 'Chest',
  radiologist: {
    id: 'rad-001',
    name: 'Dr. Lisa Park, MD',
    email: 'lisa.park@hospital.com',
    phone: '+1 (555) 123-4567',
    specialties: ['Thoracic Imaging', 'Emergency Radiology'],
    availability: 'Available'
  },
  referringPhysician: {
    name: 'Dr. James Wilson',
    department: 'Emergency Medicine',
    phone: '+1 (555) 987-6543'
  },
  hospital: 'City Medical Center',
  organization: 'NYC-001',
  sourceAETitle: 'CMC_PACS',
  billingStatus: 'Pending',
  compliance: 'Compliant',
  tat: 'On Time',
  clinicalHistory: 'Patient presents with acute onset chest pain and shortness of breath. History of smoking 20 pack-years. No prior imaging available.',
  indication: 'R/O pulmonary embolism, pneumonia',
  technique: 'Helical CT of the chest was performed from the thoracic inlet to the diaphragm following administration of 100 mL of intravenous contrast material.',
  comparison: 'No prior studies available for comparison.',
  report: {
    status: 'Draft',
    content: `FINDINGS:

Lungs and Airways:
- No pulmonary embolism identified to the subsegmental level.
- Mild bilateral dependent atelectasis.
- No consolidation or ground-glass opacity to suggest pneumonia.
- Airways are patent.

Mediastinum:
- Heart size is normal. No pericardial effusion.
- Mediastinal and hilar lymph nodes are within normal size limits.
- Esophagus and great vessels are unremarkable.

Pleura:
- No pleural effusion or pneumothorax.

Bones and Soft Tissues:
- Visualized osseous structures are intact without acute abnormality.
- Soft tissues are unremarkable.

IMPRESSION:
1. No evidence of pulmonary embolism.
2. No acute cardiopulmonary process identified.
3. Mild dependent atelectasis, likely positional.`,
    createdAt: 'Dec 20, 2024, 2:45 PM',
    updatedAt: 'Dec 20, 2024, 3:15 PM'
  },
  files: [
    {
      id: 'file-001',
      name: 'CT_CHEST_20241220_DICOM.zip',
      type: 'DICOM',
      size: '125.4 MB',
      uploadedAt: 'Dec 20, 2024, 1:50 PM',
      uploadedBy: 'System Auto-Upload',
      validated: true,
      validatedBy: 'Dr. Lisa Park',
      validatedAt: 'Dec 20, 2024, 2:30 PM'
    },
    {
      id: 'file-002',
      name: 'patient_consent_form.pdf',
      type: 'PDF',
      size: '2.1 MB',
      uploadedAt: 'Dec 20, 2024, 1:30 PM',
      uploadedBy: 'Nurse Johnson',
      validated: true,
      validatedBy: 'Admin Smith',
      validatedAt: 'Dec 20, 2024, 1:35 PM'
    },
    {
      id: 'file-003',
      name: 'clinical_notes.pdf',
      type: 'PDF',
      size: '845 KB',
      uploadedAt: 'Dec 20, 2024, 1:40 PM',
      uploadedBy: 'Dr. James Wilson',
      validated: false
    }
  ],
  timeline: [
    {
      id: 'event-001',
      timestamp: 'Dec 20, 2024, 1:30 PM',
      event: 'Study requested',
      user: 'Dr. James Wilson',
      type: 'status_change'
    },
    {
      id: 'event-002',
      timestamp: 'Dec 20, 2024, 1:45 PM',
      event: 'Study performed',
      user: 'Tech Miller',
      type: 'status_change'
    },
    {
      id: 'event-003',
      timestamp: 'Dec 20, 2024, 1:50 PM',
      event: 'DICOM images uploaded',
      user: 'System Auto-Upload',
      details: '560 images uploaded successfully',
      type: 'upload'
    },
    {
      id: 'event-004',
      timestamp: 'Dec 20, 2024, 2:20 PM',
      event: 'Study received by Ajeris',
      user: 'System',
      type: 'status_change'
    },
    {
      id: 'event-005',
      timestamp: 'Dec 20, 2024, 2:25 PM',
      event: 'Assigned to radiologist',
      user: 'Auto-Assignment',
      details: 'Assigned to Dr. Lisa Park based on specialty and availability',
      type: 'assignment'
    },
    {
      id: 'event-006',
      timestamp: 'Dec 20, 2024, 2:30 PM',
      event: 'Review started',
      user: 'Dr. Lisa Park',
      type: 'status_change'
    },
    {
      id: 'event-007',
      timestamp: 'Dec 20, 2024, 2:45 PM',
      event: 'Report submitted',
      user: 'Dr. Lisa Park',
      type: 'report'
    },
    {
      id: 'event-008',
      timestamp: 'Dec 20, 2024, 2:50 PM',
      event: 'Report available in portal',
      user: 'System',
      details: 'Report available for viewing in healthcare portal',
      type: 'status_change'
    }
  ],
  workflowStages: [
    {
      stage: 'HL7 Order Received',
      status: 'completed',
      completedAt: 'Dec 20, 2024, 1:28 PM',
      completedBy: 'HL7 Interface'
    },
    {
      stage: 'PACS Query',
      status: 'completed',
      completedAt: 'Dec 20, 2024, 1:30 PM',
      completedBy: 'HL7 Engine'
    },
    {
      stage: 'DICOM Retrieval',
      status: 'completed',
      completedAt: 'Dec 20, 2024, 1:35 PM',
      completedBy: 'Orthanc Gateway'
    },
    {
      stage: 'S3 Storage',
      status: 'completed',
      completedAt: 'Dec 20, 2024, 1:45 PM',
      completedBy: 'AWS Lambda'
    },
    {
      stage: 'AI Processing',
      status: 'completed',
      completedAt: 'Dec 20, 2024, 1:50 PM',
      completedBy: 'OpenAI GPT-5'
    },
    {
      stage: 'Expert Assignment',
      status: 'completed',
      completedAt: 'Dec 20, 2024, 2:25 PM',
      completedBy: 'Auto-Assignment'
    },
    {
      stage: 'Expert Review',
      status: 'in_progress',
      startedAt: 'Dec 20, 2024, 2:30 PM',
      assignedTo: 'Dr. Lisa Park'
    },
    {
      stage: 'Result Available in Portal',
      status: 'pending'
    },
    {
      stage: 'HL7 Result Delivery',
      status: 'future',
      note: 'Coming Soon'
    }
  ]
}

// Additional mock data for different study states
export const mockStudyDetailsCompleted: StudyDetails = {
  ...mockStudyDetails,
  id: '5',
  status: 'Completed',
  report: {
    status: 'Final',
    content: mockStudyDetails.report.content,
    createdAt: 'Dec 20, 2024, 9:00 AM',
    updatedAt: 'Dec 20, 2024, 9:30 AM',
    finalizedAt: 'Dec 20, 2024, 9:30 AM',
    finalizedBy: 'Dr. Michael Chen, MD'
  },
  sourceAETitle: 'CMC_PACS',
  billingStatus: 'Paid',
  workflowStages: mockStudyDetails.workflowStages.map(stage => {
    if (stage.stage === 'HL7 Result Delivery') {
      return { ...stage, status: 'future' as const, note: 'Coming Soon' }
    }
    return {
      ...stage,
      status: 'completed' as const,
      completedAt: stage.completedAt || 'Dec 20, 2024, 9:30 AM',
      completedBy: stage.completedBy || 'System'
    }
  })
}

export const mockStudyDetailsError: StudyDetails = {
  ...mockStudyDetails,
  id: '3',
  status: 'Error',
  radiologist: {
    ...mockStudyDetails.radiologist,
    name: 'Unassigned',
    email: '',
    phone: '',
    specialties: [],
    availability: 'Offline'
  },
  compliance: 'Flagged',
  tat: 'Overdue',
  sourceAETitle: 'COUNTY_HOSP',
  report: {
    status: 'Not Started',
    content: '',
    createdAt: '',
    updatedAt: ''
  },
  workflowStages: [
    ...mockStudyDetails.workflowStages.slice(0, 3).map(stage => ({
      ...stage,
      status: 'completed' as const
    })),
    {
      stage: 'Radiologist Assigned',
      status: 'error' as const
    },
    ...mockStudyDetails.workflowStages.slice(4).map(stage => ({
      ...stage,
      status: 'pending' as const
    }))
  ]
}

export const mockStudyDetailsPending: StudyDetails = {
  ...mockStudyDetails,
  id: '10',
  status: 'Pending',
  sourceAETitle: 'NEURO_CTR',
  radiologist: {
    ...mockStudyDetails.radiologist,
    name: 'Unassigned',
    email: '',
    phone: '',
    specialties: [],
    availability: 'Offline'
  },
  report: {
    status: 'Not Started',
    content: '',
    createdAt: '',
    updatedAt: ''
  },
  workflowStages: [
    ...mockStudyDetails.workflowStages.slice(0, 3).map(stage => ({
      ...stage,
      status: 'completed' as const
    })),
    ...mockStudyDetails.workflowStages.slice(3).map(stage => ({
      ...stage,
      status: 'pending' as const
    }))
  ]
}

// Helper function to get study details by ID
export function getStudyDetailsById(id: string): StudyDetails {
  switch (id) {
    case '1':
      return mockStudyDetails
    case '5':
      return mockStudyDetailsCompleted
    case '3':
      return mockStudyDetailsError
    case '10':
      return mockStudyDetailsPending
    default:
      // Return a default study with the given ID
      return {
        ...mockStudyDetails,
        id,
        sourceAETitle: 'CMC_PACS'
      }
  }
}