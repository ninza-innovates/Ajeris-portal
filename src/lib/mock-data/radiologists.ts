import { Radiologist } from '@/types/radiologist'

export const mockRadiologists: Radiologist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@radiologyexperts.com',
    phone: '+1 (555) 123-4567',
    specialties: ['Neuroradiology', 'Head and Neck'],
    credentials: {
      degree: 'MD, PhD',
      boardCertifications: ['American Board of Radiology', 'Certificate of Added Qualification in Neuroradiology'],
      licenseNumber: 'MD-2015-12345',
      licenseState: 'CA',
      licenseExpiry: '2025-12-31',
      npiNumber: '1234567890'
    },
    performance: {
      studiesCompleted: 12847,
      studiesCompletedToday: 23,
      averageTAT: 18,
      accuracyRate: 98.7,
      totalReads: 15234,
      criticalFindingsRate: 2.3,
      amendmentRate: 0.8
    },
    availability: {
      status: 'Available',
      schedule: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '15:00' },
        saturday: null,
        sunday: null
      },
      timezone: 'America/Los_Angeles',
      nextAvailable: '2024-01-20 14:30'
    },
    workload: {
      currentQueue: 3,
      assignedStudies: 5,
      completedToday: 23,
      pendingReviews: 2,
      priorityStudies: 1
    },
    status: 'Active',
    yearsOfExperience: 12,
    joinedDate: '2022-03-15',
    lastActive: '2024-01-20 14:25',
    preferredModalities: ['MRI', 'CT', 'MRA'],
    languages: ['English', 'Spanish'],
    hospitalAffiliations: ['City General Hospital', 'St. Mary\'s Medical Center'],
    subspecialties: ['Pediatric Neuroradiology', 'Spine Imaging'],
    turnaroundTimePreference: 'STAT',
    maxDailyStudies: 30,
    currentDailyLoad: 23,
    qualityScore: 4.9,
    responseTime: 12,
    communicationRating: 4.8,
    resumeUrl: 'https://example.com/resumes/sarah-johnson-cv.pdf'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@radiologyexperts.com',
    phone: '+1 (555) 234-5678',
    specialties: ['Musculoskeletal', 'Sports Medicine Imaging'],
    credentials: {
      degree: 'MD',
      boardCertifications: ['American Board of Radiology', 'Musculoskeletal Radiology Certificate'],
      licenseNumber: 'MD-2018-67890',
      licenseState: 'NY',
      licenseExpiry: '2024-06-30',
      npiNumber: '0987654321'
    },
    performance: {
      studiesCompleted: 9876,
      studiesCompletedToday: 18,
      averageTAT: 22,
      accuracyRate: 97.5,
      totalReads: 11234,
      criticalFindingsRate: 1.8,
      amendmentRate: 1.2
    },
    availability: {
      status: 'On Call',
      schedule: {
        monday: { start: '10:00', end: '19:00' },
        tuesday: { start: '10:00', end: '19:00' },
        wednesday: { start: '10:00', end: '19:00' },
        thursday: { start: '10:00', end: '19:00' },
        friday: { start: '10:00', end: '19:00' },
        saturday: { start: '09:00', end: '13:00' },
        sunday: null
      },
      timezone: 'America/New_York',
      nextAvailable: '2024-01-20 15:00'
    },
    workload: {
      currentQueue: 7,
      assignedStudies: 8,
      completedToday: 18,
      pendingReviews: 3,
      priorityStudies: 2
    },
    status: 'Active',
    yearsOfExperience: 8,
    joinedDate: '2023-01-10',
    lastActive: '2024-01-20 14:10',
    preferredModalities: ['MRI', 'CT', 'X-Ray'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    hospitalAffiliations: ['Presbyterian Hospital', 'Sports Medicine Center'],
    subspecialties: ['Joint Imaging', 'Trauma Radiology'],
    turnaroundTimePreference: 'Urgent',
    maxDailyStudies: 25,
    currentDailyLoad: 18,
    qualityScore: 4.7,
    responseTime: 15,
    communicationRating: 4.6,
    resumeUrl: 'https://example.com/resumes/michael-chen-resume.pdf'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@radiologyexperts.com',
    phone: '+1 (555) 345-6789',
    specialties: ['Pediatric Radiology', 'Fetal Imaging'],
    credentials: {
      degree: 'MD',
      boardCertifications: ['American Board of Radiology', 'Pediatric Radiology Certificate'],
      licenseNumber: 'MD-2016-54321',
      licenseState: 'TX',
      licenseExpiry: '2025-09-30',
      npiNumber: '1122334455'
    },
    performance: {
      studiesCompleted: 8543,
      studiesCompletedToday: 0,
      averageTAT: 20,
      accuracyRate: 98.2,
      totalReads: 9876,
      criticalFindingsRate: 3.1,
      amendmentRate: 0.6
    },
    availability: {
      status: 'On Leave',
      schedule: {
        monday: { start: '07:00', end: '15:00' },
        tuesday: { start: '07:00', end: '15:00' },
        wednesday: { start: '07:00', end: '15:00' },
        thursday: { start: '07:00', end: '15:00' },
        friday: { start: '07:00', end: '15:00' },
        saturday: null,
        sunday: null
      },
      timezone: 'America/Chicago',
      nextAvailable: '2024-01-25 07:00'
    },
    workload: {
      currentQueue: 0,
      assignedStudies: 0,
      completedToday: 0,
      pendingReviews: 0,
      priorityStudies: 0
    },
    status: 'On Leave',
    yearsOfExperience: 10,
    joinedDate: '2022-06-20',
    lastActive: '2024-01-15 16:45',
    preferredModalities: ['MRI', 'CT', 'Ultrasound'],
    languages: ['English', 'Spanish', 'Portuguese'],
    hospitalAffiliations: ['Children\'s Hospital of Texas', 'Women\'s Health Center'],
    subspecialties: ['Neonatal Imaging', 'Congenital Anomalies'],
    turnaroundTimePreference: 'Routine',
    maxDailyStudies: 20,
    currentDailyLoad: 0,
    qualityScore: 4.8,
    responseTime: 18,
    communicationRating: 4.9
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@radiologyexperts.com',
    phone: '+1 (555) 456-7890',
    specialties: ['Interventional Radiology', 'Vascular Imaging'],
    credentials: {
      degree: 'MD, MBA',
      boardCertifications: ['American Board of Radiology', 'Vascular and Interventional Radiology Certificate'],
      licenseNumber: 'MD-2014-98765',
      licenseState: 'MA',
      licenseExpiry: '2024-03-31',
      npiNumber: '5544332211'
    },
    performance: {
      studiesCompleted: 7234,
      studiesCompletedToday: 12,
      averageTAT: 25,
      accuracyRate: 96.8,
      totalReads: 8567,
      criticalFindingsRate: 4.2,
      amendmentRate: 1.5
    },
    availability: {
      status: 'Busy',
      schedule: {
        monday: { start: '06:00', end: '14:00' },
        tuesday: { start: '06:00', end: '14:00' },
        wednesday: { start: '06:00', end: '14:00' },
        thursday: { start: '06:00', end: '14:00' },
        friday: { start: '06:00', end: '14:00' },
        saturday: null,
        sunday: null
      },
      timezone: 'America/New_York',
      nextAvailable: '2024-01-20 16:00'
    },
    workload: {
      currentQueue: 10,
      assignedStudies: 12,
      completedToday: 12,
      pendingReviews: 5,
      priorityStudies: 3
    },
    status: 'Active',
    yearsOfExperience: 15,
    joinedDate: '2021-11-05',
    lastActive: '2024-01-20 13:55',
    preferredModalities: ['Angiography', 'CT', 'Fluoroscopy'],
    languages: ['English'],
    hospitalAffiliations: ['Massachusetts General Hospital', 'Boston Medical Center'],
    subspecialties: ['Oncologic Interventions', 'Peripheral Vascular Disease'],
    turnaroundTimePreference: 'STAT',
    maxDailyStudies: 20,
    currentDailyLoad: 12,
    qualityScore: 4.5,
    responseTime: 20,
    communicationRating: 4.4
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@radiologyexperts.com',
    phone: '+1 (555) 567-8901',
    specialties: ['Breast Imaging', 'Women\'s Imaging'],
    credentials: {
      degree: 'MD',
      boardCertifications: ['American Board of Radiology', 'Mammography Quality Standards Act Certificate'],
      licenseNumber: 'MD-2017-13579',
      licenseState: 'FL',
      licenseExpiry: '2025-06-30',
      npiNumber: '9988776655'
    },
    performance: {
      studiesCompleted: 11234,
      studiesCompletedToday: 28,
      averageTAT: 15,
      accuracyRate: 99.1,
      totalReads: 13456,
      criticalFindingsRate: 5.2,
      amendmentRate: 0.4
    },
    availability: {
      status: 'Available',
      schedule: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '16:00' },
        saturday: null,
        sunday: null
      },
      timezone: 'America/New_York',
      nextAvailable: '2024-01-20 14:45'
    },
    workload: {
      currentQueue: 2,
      assignedStudies: 4,
      completedToday: 28,
      pendingReviews: 1,
      priorityStudies: 0
    },
    status: 'Active',
    yearsOfExperience: 9,
    joinedDate: '2022-09-12',
    lastActive: '2024-01-20 14:28',
    preferredModalities: ['Mammography', 'MRI', 'Ultrasound'],
    languages: ['English', 'French'],
    hospitalAffiliations: ['Women\'s Health Institute', 'Miami Breast Center'],
    subspecialties: ['Breast MRI', 'Image-Guided Breast Biopsy'],
    turnaroundTimePreference: 'Urgent',
    maxDailyStudies: 35,
    currentDailyLoad: 28,
    qualityScore: 4.9,
    responseTime: 10,
    communicationRating: 5.0
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    email: 'robert.kim@radiologyexperts.com',
    phone: '+1 (555) 678-9012',
    specialties: ['Cardiac Imaging', 'Thoracic Radiology'],
    credentials: {
      degree: 'MD, MS',
      boardCertifications: ['American Board of Radiology', 'Certification in Cardiac CT and MRI'],
      licenseNumber: 'MD-2019-24680',
      licenseState: 'WA',
      licenseExpiry: '2026-01-31',
      npiNumber: '6677889900'
    },
    performance: {
      studiesCompleted: 6789,
      studiesCompletedToday: 15,
      averageTAT: 24,
      accuracyRate: 97.3,
      totalReads: 7890,
      criticalFindingsRate: 3.8,
      amendmentRate: 1.1
    },
    availability: {
      status: 'Off Duty',
      schedule: {
        monday: { start: '12:00', end: '20:00' },
        tuesday: { start: '12:00', end: '20:00' },
        wednesday: { start: '12:00', end: '20:00' },
        thursday: { start: '12:00', end: '20:00' },
        friday: { start: '12:00', end: '20:00' },
        saturday: null,
        sunday: null
      },
      timezone: 'America/Los_Angeles',
      nextAvailable: '2024-01-21 12:00'
    },
    workload: {
      currentQueue: 0,
      assignedStudies: 0,
      completedToday: 15,
      pendingReviews: 0,
      priorityStudies: 0
    },
    status: 'Active',
    yearsOfExperience: 6,
    joinedDate: '2023-03-28',
    lastActive: '2024-01-20 20:00',
    preferredModalities: ['Cardiac CT', 'Cardiac MRI', 'Chest CT'],
    languages: ['English', 'Korean'],
    hospitalAffiliations: ['Seattle Heart Institute', 'Northwest Medical Center'],
    subspecialties: ['Coronary CTA', 'Pulmonary Embolism'],
    turnaroundTimePreference: 'Routine',
    maxDailyStudies: 22,
    currentDailyLoad: 15,
    qualityScore: 4.6,
    responseTime: 22,
    communicationRating: 4.5
  },
  {
    id: '7',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@radiologyexperts.com',
    phone: '+1 (555) 789-0123',
    specialties: ['Abdominal Imaging', 'Gastrointestinal Radiology'],
    credentials: {
      degree: 'MD',
      boardCertifications: ['American Board of Radiology'],
      licenseNumber: 'MD-2020-35791',
      licenseState: 'AZ',
      licenseExpiry: '2024-12-31',
      npiNumber: '3322114455'
    },
    performance: {
      studiesCompleted: 4567,
      studiesCompletedToday: 0,
      averageTAT: 19,
      accuracyRate: 98.0,
      totalReads: 5432,
      criticalFindingsRate: 2.7,
      amendmentRate: 0.9
    },
    availability: {
      status: 'Off Duty',
      schedule: {
        monday: { start: '08:00', end: '16:00' },
        tuesday: { start: '08:00', end: '16:00' },
        wednesday: { start: '08:00', end: '16:00' },
        thursday: { start: '08:00', end: '16:00' },
        friday: { start: '08:00', end: '16:00' },
        saturday: null,
        sunday: null
      },
      timezone: 'America/Phoenix',
      nextAvailable: 'Unknown'
    },
    workload: {
      currentQueue: 0,
      assignedStudies: 0,
      completedToday: 0,
      pendingReviews: 0,
      priorityStudies: 0
    },
    status: 'Inactive',
    yearsOfExperience: 5,
    joinedDate: '2023-06-15',
    lastActive: '2023-12-20 15:30',
    preferredModalities: ['CT', 'MRI', 'Fluoroscopy'],
    languages: ['English', 'Spanish'],
    hospitalAffiliations: ['Phoenix General Hospital'],
    subspecialties: ['Hepatobiliary Imaging', 'Pancreatic Imaging'],
    turnaroundTimePreference: 'Routine',
    maxDailyStudies: 25,
    currentDailyLoad: 0,
    qualityScore: 4.7,
    responseTime: 16,
    communicationRating: 4.8
  },
  {
    id: '8',
    name: 'Dr. Ahmed Patel',
    email: 'ahmed.patel@radiologyexperts.com',
    phone: '+1 (555) 890-1234',
    specialties: ['Emergency Radiology', 'Trauma Imaging'],
    credentials: {
      degree: 'MD, FRCR',
      boardCertifications: ['American Board of Radiology', 'Fellowship of the Royal College of Radiologists'],
      licenseNumber: 'MD-2015-46802',
      licenseState: 'IL',
      licenseExpiry: '2025-03-31',
      npiNumber: '7788990011'
    },
    performance: {
      studiesCompleted: 14567,
      studiesCompletedToday: 31,
      averageTAT: 12,
      accuracyRate: 97.8,
      totalReads: 16789,
      criticalFindingsRate: 6.2,
      amendmentRate: 1.0
    },
    availability: {
      status: 'Available',
      schedule: {
        monday: { start: '18:00', end: '06:00' },
        tuesday: { start: '18:00', end: '06:00' },
        wednesday: { start: '18:00', end: '06:00' },
        thursday: { start: '18:00', end: '06:00' },
        friday: { start: '18:00', end: '06:00' },
        saturday: { start: '00:00', end: '23:59' },
        sunday: { start: '00:00', end: '23:59' }
      },
      timezone: 'America/Chicago',
      nextAvailable: '2024-01-20 18:00'
    },
    workload: {
      currentQueue: 5,
      assignedStudies: 7,
      completedToday: 31,
      pendingReviews: 3,
      priorityStudies: 4
    },
    status: 'Active',
    yearsOfExperience: 11,
    joinedDate: '2021-08-10',
    lastActive: '2024-01-20 14:30',
    preferredModalities: ['CT', 'X-Ray', 'Ultrasound'],
    languages: ['English', 'Hindi', 'Urdu'],
    hospitalAffiliations: ['Chicago Trauma Center', 'Emergency Medical Services'],
    subspecialties: ['Polytrauma Imaging', 'Acute Abdomen'],
    turnaroundTimePreference: 'STAT',
    maxDailyStudies: 40,
    currentDailyLoad: 31,
    qualityScore: 4.8,
    responseTime: 8,
    communicationRating: 4.7
  }
]