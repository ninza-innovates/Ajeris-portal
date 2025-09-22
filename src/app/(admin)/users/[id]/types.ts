import type { User as BaseUser } from '@/lib/api/types';

// Extended User type for detailed view
export interface UserDetail extends BaseUser {
  // Basic fields already in BaseUser:
  // id, email, name, role, organization, status, lastActive,
  // createdAt, updatedAt, emailVerified, twoFactorEnabled,
  // loginCount, failedAttempts

  // Additional fields for detailed view
  type?: 'Expert' | 'Healthcare';
  typeLabel?: string;
  phone?: string;
  department?: string;
  manager?: string;
  location?: string;
  timezone?: string;
  language?: string;
  lastLogin?: string;
  accountType?: string;
  bio?: string;
  passwordLastChanged?: string;
  failedLoginAttempts?: number;
  isLocked?: boolean;
  accountLocked?: boolean;
  licenseStatus?: 'Active' | 'Expiring' | 'Expired' | 'N/A';
  contractStatus?: 'Signed' | 'Pending' | 'Expired' | 'N/A';
  trainingCompleted?: boolean;
  hasNotes?: boolean;
  createdBy?: string;
  studiesReviewed?: number;
  studiesSubmitted?: number;
}