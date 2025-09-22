'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useOrganization } from '@/lib/api/hooks/use-organizations'
import { useUsers } from '@/lib/api/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import {
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  UserPlus,
  Mail,
  Shield,
  Key,
  UserX,
  Edit,
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function OrganizationUsersPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = params.id as string
  
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'CLINIC',
    sendWelcomeEmail: true,
  })
  
  // Fetch organization details
  const { data: organization, isLoading: orgLoading } = useOrganization(organizationId)
  
  // Fetch users for this organization
  const { data: usersData, isLoading: usersLoading } = useUsers({
    organization: organizationId,
  })
  
  const users = usersData?.data || []
  
  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleInviteUser = () => {
    // TODO: Implement invite user API call
    toast({
      title: 'User Invited',
      description: `Invitation sent to ${inviteForm.email}`,
    })
    setInviteDialogOpen(false)
    setInviteForm({ email: '', role: 'CLINIC', sendWelcomeEmail: true })
  }
  
  const handleResetPassword = (user: any) => {
    // TODO: Implement reset password API call
    toast({
      title: 'Password Reset',
      description: `Password reset link sent to ${user.email}`,
    })
  }
  
  const handleRemoveUser = (user: any) => {
    // TODO: Implement remove user API call
    toast({
      title: 'User Removed',
      description: `${user.name} has been removed from the organization`,
    })
  }
  
  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      'RAD': 'default',
      'CLINIC': 'secondary',
      'BILLING': 'outline',
      'ADMIN': 'destructive',
    }
    return <Badge variant={variants[role] || 'default'}>{role}</Badge>
  }
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'active': 'success',
      'inactive': 'secondary',
      'pending_verification': 'warning',
      'suspended': 'destructive',
    }
    const labels: Record<string, string> = {
      'active': 'Active',
      'inactive': 'Inactive', 
      'pending_verification': 'Pending',
      'suspended': 'Suspended',
    }
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>
  }

  if (orgLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/organizations')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {organization?.name} - Users
            </h1>
            <p className="text-muted-foreground">
              Manage users for this organization
            </p>
          </div>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organization Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} users in this organization
              </CardDescription>
            </div>
            <div className="w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No users found{searchQuery && ' matching your search'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.lastActive 
                        ? new Date(user.lastActive).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => router.push(`/users/${user.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            View Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleRemoveUser(user)}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Remove from Organization
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to join {organization?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full px-3 py-2 border rounded-lg"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              >
                <option value="CLINIC">Healthcare Staff</option>
                <option value="BILLING">Billing Staff</option>
                <option value="RAD">Radiologist</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="welcome-email"
                checked={inviteForm.sendWelcomeEmail}
                onChange={(e) => setInviteForm({ ...inviteForm, sendWelcomeEmail: e.target.checked })}
              />
              <Label htmlFor="welcome-email" className="cursor-pointer">
                Send welcome email with setup instructions
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteUser}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}