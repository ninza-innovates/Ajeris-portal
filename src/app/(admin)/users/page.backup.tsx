'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockUsers } from '@/lib/mock-data/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
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
    if (selectedUsers.size === mockUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(mockUsers.map(u => u.id)))
    }
  }

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === 'all' || 
      (filterType === 'expert' && user.type === 'Expert') ||
      (filterType === 'healthcare' && user.type === 'Healthcare')
    
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const stats = [
    {
      title: 'Total Platform Users',
      value: '247',
      subtitle: 'Across all organizations',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Currently Active',
      value: '198',
      subtitle: 'Logged in last 30 days',
      change: '+12 this week',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Expert Radiologists',
      value: '156',
      subtitle: 'Licensed professionals',
      detail: '82% verified',
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Healthcare Staff',
      value: '91',
      subtitle: 'Facility users',
      detail: '15 orgs',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Verification',
      value: '23',
      subtitle: 'Awaiting email/ID verify',
      change: 'Action needed',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

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
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
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
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users... Try: email:*@hospital.com or 2fa:disabled"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="expert">Expert (Radiologist)</option>
                <option value="healthcare">Healthcare (Staff)</option>
              </select>
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="locked">Locked</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
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
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Select all {filteredUsers.length}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">Send Verification Email</Button>
              <Button size="sm" variant="outline">Enable 2FA</Button>
              <Button size="sm" variant="outline">Reset Password</Button>
              <Button size="sm" variant="outline">Export Selected</Button>
              <div className="border-l mx-2 h-6"></div>
              <Button size="sm" variant="destructive">Suspend</Button>
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
                      checked={selectedUsers.size === mockUsers.length}
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                    <td className="p-3 text-sm">{user.organization}</td>
                    <td className="p-3">
                      <Badge variant={user.role === 'RAD' ? 'info' : user.role === 'CLINIC' ? 'secondary' : 'warning'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge 
                        variant={
                          user.status === 'Active' ? 'success' : 
                          user.status === 'Suspended' ? 'warning' : 
                          user.status === 'Locked' ? 'destructive' : 
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
                      <span className={
                        user.licenseStatus === 'Active' ? 'text-green-600' :
                        user.licenseStatus === 'Expiring' ? 'text-yellow-600' :
                        user.licenseStatus === 'Expired' ? 'text-red-600' :
                        'text-gray-400'
                      }>
                        {user.licenseStatus}
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
                          <DropdownMenuLabel>View</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Full Profile
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
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}