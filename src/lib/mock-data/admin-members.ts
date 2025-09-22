export interface AdminMember {
  id: string
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'
  status: 'Active' | 'Invited' | 'Suspended'
  lastActive?: string
  createdAt: string
  invitedBy: string
  twoFactorEnabled: boolean
}

export const mockAdminMembers: AdminMember[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ajeris.com',
    role: 'SUPER_ADMIN',
    status: 'Active',
    lastActive: '2024-01-20 16:45',
    createdAt: '2023-01-15',
    invitedBy: 'System',
    twoFactorEnabled: true,
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@ajeris.com',
    role: 'ADMIN',
    status: 'Active',
    lastActive: '2024-01-20 14:30',
    createdAt: '2023-06-20',
    invitedBy: 'Admin User',
    twoFactorEnabled: true,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@ajeris.com',
    role: 'ADMIN',
    status: 'Active',
    lastActive: '2024-01-19 18:20',
    createdAt: '2023-08-10',
    invitedBy: 'Admin User',
    twoFactorEnabled: false,
  },
  {
    id: '4',
    name: 'Jennifer Davis',
    email: 'jennifer.davis@ajeris.com',
    role: 'VIEWER',
    status: 'Active',
    lastActive: '2024-01-20 12:15',
    createdAt: '2023-11-05',
    invitedBy: 'Sarah Mitchell',
    twoFactorEnabled: false,
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@ajeris.com',
    role: 'VIEWER',
    status: 'Invited',
    createdAt: '2024-01-18',
    invitedBy: 'Michael Brown',
    twoFactorEnabled: false,
  },
  {
    id: '6',
    name: 'Emily Chen',
    email: 'emily.chen@ajeris.com',
    role: 'ADMIN',
    status: 'Suspended',
    lastActive: '2023-12-15 10:30',
    createdAt: '2023-04-22',
    invitedBy: 'Admin User',
    twoFactorEnabled: true,
  },
]