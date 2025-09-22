'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUsers, useUserStats, useBatchSuspendUsers, useBatchDeleteUsers } from '@/lib/api/hooks/use-users'
import { UserFilters } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import {
  Search,
  MoreVertical,
  Download,
  UserPlus,
  Filter,
  Users as UsersIcon,
  UserCheck,
  Stethoscope,
  Building,
  AlertCircle,
  Eye,
  Edit,
  FileText,
  Clock,
  Key,
  Shield,
  Unlock,
  UserCheck as UserCheckIcon,
  Building as BuildingIcon,
  MessageSquare,
  Ban,
  Trash2,
} from 'lucide-react'

export default function UsersPage() {
  const router = useRouter()
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: undefined,
    status: undefined,
    organization: undefined,
    page: 1,
    limit: 10,
  })
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput || undefined, page: 1 }))
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchInput])
  
  // Fetch users with filters
  const { data: usersResponse, isLoading, error } = useUsers(filters)
  const { data: statsResponse, isLoading: statsLoading } = useUserStats()
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [toggle2FAOpen, setToggle2FAOpen] = useState(false)
  const [unlockAccountOpen, setUnlockAccountOpen] = useState(false)
  const [changeOrgOpen, setChangeOrgOpen] = useState(false)
  const [adminNoteOpen, setAdminNoteOpen] = useState(false)
  const [suspendUserOpen, setSuspendUserOpen] = useState(false)
  const [deleteUserOpen, setDeleteUserOpen] = useState(false)
  const [adminNote, setAdminNote] = useState('')
  
  // Batch operation dialogs
  const [batchSuspendOpen, setBatchSuspendOpen] = useState(false)
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false)
  const [batchReason, setBatchReason] = useState('')

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers)
    if (newSelection.has(userId)) {
      newSelection.delete(userId)
    } else {
      newSelection.add(userId)
    }
    setSelectedUsers(newSelection)
  }

  const toggleAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)))
    }
  }

  // Get users from API response
  const users = usersResponse?.data || []
  const totalUsers = usersResponse?.meta?.total || 0
  
  // Batch operation mutations
  const batchSuspendMutation = useBatchSuspendUsers()
  const batchDeleteMutation = useBatchDeleteUsers()

  const userStats = statsResponse?.data
  
  const stats = [
    {
      title: 'Total Platform Users',
      value: userStats?.totalUsers?.toString() || '0',
      subtitle: 'Across all organizations',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Currently Active',
      value: userStats?.loggedInLast30Days?.toString() || '0',
      subtitle: 'Logged in last 30 days',
      change: statsLoading ? '' : '+12 this week',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Expert Radiologists',
      value: userStats?.radiologists?.toString() || '0',
      subtitle: 'Licensed professionals',
      detail: userStats?.verifiedRadiologists 
        ? `${Math.round((userStats.verifiedRadiologists / userStats.radiologists) * 100)}% verified`
        : '0% verified',
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Healthcare Staff',
      value: userStats?.healthcareStaff?.toString() || '0',
      subtitle: 'Facility users',
      detail: '15 orgs',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Verification',
      value: userStats?.awaitingVerification?.toString() || '0',
      subtitle: 'Awaiting email/ID verify',
      change: 'Action needed',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Platform User Management</h1>
            <p className="text-muted-foreground">
              Manage all users across the platform - Radiologists and Healthcare Staff
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-destructive">Error Loading Users</h2>
            <p className="text-muted-foreground mt-2">Unable to fetch users data. Please try again.</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across the platform - Radiologists and Healthcare Staff
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button onClick={() => router.push('/users/create')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {statsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-8" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={cn(stat.bgColor, 'p-2 rounded-md')}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
                {stat.change && (
                  <span className="text-xs text-gray-500">{stat.change}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600">{stat.subtitle}</p>
              {stat.detail && (
                <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
              )}
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search in name, email, or username..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={filters.role || 'all'}
                onChange={(e) => setFilters({ ...filters, role: e.target.value === 'all' ? undefined : e.target.value as UserFilters['role'] })}
              >
                <option value="all">All Roles</option>
                <option value="RAD">Radiologist</option>
                <option value="CLINIC">Clinic Staff</option>
                <option value="BILLING">Billing</option>
              </select>
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={filters.status || 'all'}
                onChange={(e) => setFilters({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value as UserFilters['status'] })}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending_verification">Pending Verification</option>
              </select>
              <Input
                placeholder="Organization ID"
                value={filters.organization || ''}
                onChange={(e) => setFilters({ ...filters, organization: e.target.value || undefined })}
                className="w-48"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchInput('')
                  setFilters({ 
                    search: '',
                    role: undefined,
                    status: undefined,
                    organization: undefined,
                    page: 1,
                    limit: 10,
                  })
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.size} users selected
              </span>
              <button 
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() => setSelectedUsers(new Set(users.map(u => u.id)))}
              >
                Select all {users.length} on this page
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">Send Verification Email</Button>
              <Button size="sm" variant="outline">Enable 2FA</Button>
              <Button size="sm" variant="outline">Reset Password</Button>
              <Button size="sm" variant="outline">Export Selected</Button>
              <div className="border-l mx-2 h-6"></div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setBatchSuspendOpen(true)
                  setBatchReason('')
                }}
              >
                Suspend Selected
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => {
                  setBatchDeleteOpen(true)
                  setBatchReason('')
                }}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={selectedUsers.size === users.length && users.length > 0}
                      onCheckedChange={toggleAllUsers}
                    />
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Organization</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Security</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">License</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Last Active</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-red-500">
                      Error loading users. Please try again.
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                    <td className="p-3 text-sm">
                      {typeof user.organization === 'object' 
                        ? (user.organization?.name || 'No Organization') 
                        : (user.organization || 'No Organization')}
                    </td>
                    <td className="p-3">
                      <Badge variant={user.role === 'RAD' ? 'info' : user.role === 'CLINIC' ? 'secondary' : 'warning'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge 
                        variant={
                          user.status === 'Active' ? 'success' : 
                          user.status === 'Inactive' ? 'secondary' : 
                          user.status === 'Suspended' ? 'warning' : 
                          user.status === 'Locked' ? 'destructive' : 
                          user.status === 'Pending' ? 'outline' : 
                          'secondary'
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={user.emailVerified ? 'text-green-600' : 'text-red-600'}>
                          {user.emailVerified ? '✓' : '✗'}
                        </span>
                        <span className={user.twoFactorEnabled ? 'text-green-600' : 'text-yellow-600'}>
                          {user.twoFactorEnabled ? '🔐' : '⚠️'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-gray-400">
                        N/A
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{user.lastActive}</td>
                    <td className="p-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/users/${user.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/users/${user.id}/activity`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Activity Log
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/users/${user.id}/login-history`)}>
                            <Clock className="mr-2 h-4 w-4" />
                            View Login History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Security</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setResetPasswordOpen(true)
                          }}>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setToggle2FAOpen(true)
                          }}>
                            <Shield className="mr-2 h-4 w-4" />
                            Toggle 2FA
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setUnlockAccountOpen(true)
                          }}>
                            <Unlock className="mr-2 h-4 w-4" />
                            Unlock Account
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Admin</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            toast({
                              title: "Login as User",
                              description: `Switching to ${user.name}'s account...`,
                            })
                          }}>
                            <UserCheckIcon className="mr-2 h-4 w-4" />
                            Login as User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setChangeOrgOpen(true)
                          }}>
                            <BuildingIcon className="mr-2 h-4 w-4" />
                            Change Organization
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setAdminNoteOpen(true)
                          }}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Add Admin Note
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => {
                            setSelectedUser(user)
                            setSuspendUserOpen(true)
                          }}>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => {
                            setSelectedUser(user)
                            setDeleteUserOpen(true)
                          }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {usersResponse?.meta && usersResponse.meta.total > 0 && (
            <div className="p-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} to{' '}
                {Math.min((filters.page || 1) * (filters.limit || 10), usersResponse.meta.total)} of{' '}
                {usersResponse.meta.total} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })}
                  disabled={(filters.page || 1) <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {filters.page || 1} of {Math.ceil(usersResponse.meta.total / (filters.limit || 10))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  disabled={!(usersResponse.meta.hasMore)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset link to {selectedUser?.name} ({selectedUser?.email})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Password Reset Link Sent",
                description: `Password reset email sent to ${selectedUser?.email}`,
              })
              setResetPasswordOpen(false)
            }}>
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={toggle2FAOpen} onOpenChange={setToggle2FAOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Toggle Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              {selectedUser?.twoFactorEnabled 
                ? `Disable 2FA for ${selectedUser?.name}? This will reduce account security.`
                : `Enable 2FA for ${selectedUser?.name}? User will need to set up authenticator app.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggle2FAOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: selectedUser?.twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
                description: selectedUser?.twoFactorEnabled 
                  ? "Two-factor authentication has been disabled"
                  : "User will be prompted to set up 2FA on next login",
              })
              setToggle2FAOpen(false)
            }}>
              {selectedUser?.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={unlockAccountOpen} onOpenChange={setUnlockAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Account</DialogTitle>
            <DialogDescription>
              Unlock {selectedUser?.name}'s account? This will reset failed login attempts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnlockAccountOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Account Unlocked",
                description: "User can now log in again",
              })
              setUnlockAccountOpen(false)
            }}>
              Unlock Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={changeOrgOpen} onOpenChange={setChangeOrgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Organization</DialogTitle>
            <DialogDescription>
              Move {selectedUser?.name} to a different organization
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <select className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select Organization</option>
              <option value="1">City Hospital</option>
              <option value="2">Rural Clinic</option>
              <option value="3">Metro Health</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeOrgOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Organization Changed",
                description: "User has been moved to the new organization",
              })
              setChangeOrgOpen(false)
            }}>
              Change Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adminNoteOpen} onOpenChange={setAdminNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin Note</DialogTitle>
            <DialogDescription>
              Add an internal note about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter note..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAdminNoteOpen(false)
              setAdminNote('')
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Note Added",
                description: "Admin note has been saved",
              })
              setAdminNoteOpen(false)
              setAdminNote('')
            }}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspendUserOpen} onOpenChange={setSuspendUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {selectedUser?.name}? They will be unable to access the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendUserOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              toast({
                title: "User Suspended",
                description: `${selectedUser?.name} has been suspended`,
              })
              setSuspendUserOpen(false)
            }}>
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              toast({
                title: "User Deleted",
                description: `${selectedUser?.name} has been permanently deleted`,
              })
              setDeleteUserOpen(false)
            }}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Suspend Dialog */}
      <Dialog open={batchSuspendOpen} onOpenChange={setBatchSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Multiple Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {selectedUsers.size} users? They will be unable to access the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for suspension (optional)..."
              value={batchReason}
              onChange={(e) => setBatchReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setBatchSuspendOpen(false)
              setBatchReason('')
            }}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={async () => {
                try {
                  await batchSuspendMutation.mutateAsync({
                    userIds: Array.from(selectedUsers),
                    reason: batchReason || undefined
                  })
                  setSelectedUsers(new Set())
                  setBatchSuspendOpen(false)
                  setBatchReason('')
                } catch (error) {
                  // Error handled by the mutation hook
                }
              }}
              disabled={batchSuspendMutation.isPending}
            >
              {batchSuspendMutation.isPending ? 'Suspending...' : `Suspend ${selectedUsers.size} Users`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Delete Dialog */}
      <Dialog open={batchDeleteOpen} onOpenChange={setBatchDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUsers.size} users? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for deletion (optional)..."
              value={batchReason}
              onChange={(e) => setBatchReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setBatchDeleteOpen(false)
              setBatchReason('')
            }}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={async () => {
                try {
                  await batchDeleteMutation.mutateAsync({
                    userIds: Array.from(selectedUsers),
                    reason: batchReason || undefined
                  })
                  setSelectedUsers(new Set())
                  setBatchDeleteOpen(false)
                  setBatchReason('')
                } catch (error) {
                  // Error handled by the mutation hook
                }
              }}
              disabled={batchDeleteMutation.isPending}
            >
              {batchDeleteMutation.isPending ? 'Deleting...' : `Delete ${selectedUsers.size} Users`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}