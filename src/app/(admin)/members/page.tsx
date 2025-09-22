'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMembers, useDeleteMember, useSuspendMember, useActivateMember } from '@/lib/api/hooks/use-members'
import { MemberFilters } from '@/lib/api/services/members.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import {
  Search,
  MoreVertical,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Ban,
  CheckCircle,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

export default function MembersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Mutations
  const deleteMember = useDeleteMember()
  const suspendMember = useSuspendMember()
  const activateMember = useActivateMember()

  // Build filters
  const filters: MemberFilters = {
    search: debouncedSearch,
    role: filterRole !== 'all' ? filterRole : undefined,
    status: filterStatus !== 'all' ? filterStatus : undefined,
    page,
    limit: 20,
  }

  const { data: membersResponse, isLoading, error } = useMembers(filters)
  const members = membersResponse?.data || []
  const meta = membersResponse?.meta

  const handleDelete = async () => {
    if (!selectedMemberId) return

    try {
      await deleteMember.mutateAsync(selectedMemberId)
      toast({
        title: 'Member deleted',
        description: 'The admin member has been permanently deleted.',
      })
      setIsDeleteDialogOpen(false)
      setSelectedMemberId(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete member',
        variant: 'destructive',
      })
    }
  }

  const handleToggleStatus = async (memberId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'active') {
        await suspendMember.mutateAsync(memberId)
        toast({
          title: 'Member suspended',
          description: 'The admin member has been suspended.',
        })
      } else {
        await activateMember.mutateAsync(memberId)
        toast({
          title: 'Member activated',
          description: 'The admin member has been activated.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member status',
        variant: 'destructive',
      })
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="default">Super Admin</Badge>
      case 'ADMIN':
        return <Badge variant="secondary">Admin</Badge>
      case 'VIEWER':
        return <Badge variant="outline">Viewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>
      case 'invited':
        return <Badge variant="warning">Invited</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = [
    {
      title: 'Total Members',
      value: meta?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active',
      value: members.filter(m => m.status === 'active').length,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Suspended',
      value: members.filter(m => m.status === 'suspended').length,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Pending Invites',
      value: members.filter(m => m.status === 'invited').length,
      icon: Mail,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Members</h1>
          <p className="text-muted-foreground">
            Manage admin portal access and permissions
          </p>
        </div>
        <Button onClick={() => router.push('/members/invite')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="invited">Invited</option>
              <option value="inactive">Inactive</option>
            </select>
            {(searchQuery || filterRole !== 'all' || filterStatus !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setFilterRole('all')
                  setFilterStatus('all')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Member</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">2FA</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Invited By</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Last Active</th>
                  <th className="p-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="p-3">
                        <Skeleton className="h-12 w-full" />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-red-600">
                      <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                      Error loading members
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No members found
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {member.role === 'SUPER_ADMIN' && (
                            <ShieldAlert className="h-4 w-4 text-purple-600" />
                          )}
                          {member.role === 'ADMIN' && (
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                          )}
                          {member.role === 'VIEWER' && (
                            <Shield className="h-4 w-4 text-gray-600" />
                          )}
                          {getRoleBadge(member.role)}
                        </div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(member.status)}
                      </td>
                      <td className="p-3">
                        {member.twoFactorEnabled ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-gray-600">{member.invitedBy}</p>
                        {member.invitedAt && (
                          <p className="text-xs text-gray-500">
                            {format(new Date(member.invitedAt), 'MMM d, yyyy')}
                          </p>
                        )}
                      </td>
                      <td className="p-3">
                        {member.lastActive ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            {format(new Date(member.lastActive), 'MMM d, HH:mm')}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Never</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/members/${member.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(member.id, member.status)}
                              disabled={member.role === 'SUPER_ADMIN'}
                            >
                              {member.status === 'active' ? (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend Member
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate Member
                                </>
                              )}
                            </DropdownMenuItem>
                            {member.status === 'invited' && (
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend Invitation
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedMemberId(member.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              disabled={member.role === 'SUPER_ADMIN'}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Member
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
          {meta && meta.total > 0 && (
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {((page - 1) * meta.limit) + 1} to {Math.min(page * meta.limit, meta.total)} of {meta.total} members
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {[...Array(meta.totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setPage(i + 1)}
                          isActive={page === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                        className={page === meta.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member
              and revoke their access to the admin portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedMemberId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}