'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockOrganizations } from '@/lib/mock-data/organizations'
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
  Search,
  MoreVertical,
  Building,
  Users,
  FileText,
  DollarSign,
  Plus,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Edit,
  Eye,
  UserPlus,
  FileEdit,
  Ban,
  Trash2,
} from 'lucide-react'
import { Organization } from '@/types/organization'
import {
  EditOrganizationDialog,
  AddUserDialog,
  ContractDialog,
  ReportDialog,
  SuspendOrganizationDialog,
  DeleteOrganizationDialog,
} from '@/components/dialogs/organization-dialogs'

export default function OrganizationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [contractDialogOpen, setContractDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)

  // Filter organizations
  const filteredOrganizations = mockOrganizations.filter(org => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || org.status === filterStatus
    const matchesType = filterType === 'all' || org.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const stats = [
    {
      title: 'Total Organizations',
      value: '45',
      subtitle: 'Active partnerships',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Users',
      value: '1,247',
      subtitle: 'Across all orgs',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Studies',
      value: '12,456',
      subtitle: 'Current month',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Outstanding Balance',
      value: '$48,250',
      subtitle: '3 orgs overdue',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const getStatusBadge = (status: Organization['status']) => {
    const variants: Record<Organization['status'], any> = {
      'Active': 'success',
      'Suspended': 'destructive',
      'Pending': 'warning',
      'Inactive': 'secondary'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getContractBadge = (status: Organization['contractStatus']) => {
    const variants: Record<Organization['contractStatus'], any> = {
      'Active': 'success',
      'Expired': 'destructive',
      'Pending': 'warning',
      'None': 'secondary'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getBillingBadge = (status: Organization['billingStatus']) => {
    const variants: Record<Organization['billingStatus'], any> = {
      'Current': 'success',
      'Overdue': 'destructive',
      'Pending': 'warning'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage healthcare organizations and partnerships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn(stat.bgColor, 'p-2 rounded-md')}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
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
                placeholder="Search organizations..."
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
              <option value="Hospital">Hospital</option>
              <option value="Clinic">Clinic</option>
              <option value="Imaging Center">Imaging Center</option>
              <option value="Private Practice">Private Practice</option>
            </select>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <div className="grid gap-4">
        {filteredOrganizations.map((org) => (
          <Card key={org.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'p-3 rounded-lg',
                      org.status === 'Active' ? 'bg-blue-100' : 'bg-gray-100'
                    )}>
                      <Building className={cn(
                        'h-6 w-6',
                        org.status === 'Active' ? 'text-blue-600' : 'text-gray-600'
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{org.name}</h3>
                        {getStatusBadge(org.status)}
                        <Badge variant="outline">{org.id}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <MapPin className="h-4 w-4" />
                            {org.address.street}, {org.address.city}, {org.address.state} {org.address.zip}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Users className="h-4 w-4" />
                            {org.userCount} users
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="h-4 w-4" />
                            {org.studyCount} total studies • {org.monthlyVolume}/month avg
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Mail className="h-4 w-4" />
                            {org.contact.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Phone className="h-4 w-4" />
                            {org.contact.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            Created {org.createdAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">AE Title:</span>
                          <span className="font-mono font-medium">{org.aeTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Datastore ID:</span>
                          <span className="font-mono font-medium">{org.datastoreId}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Contract:</span>
                          {getContractBadge(org.contractStatus)}
                          {org.contractExpiry && org.contractStatus === 'Active' && (
                            <span className="text-xs text-gray-500">
                              Expires {org.contractExpiry}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Billing:</span>
                          {getBillingBadge(org.billingStatus)}
                          {org.outstandingBalance > 0 && (
                            <span className="text-sm font-medium text-red-600">
                              ${org.outstandingBalance.toLocaleString()} due
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/organizations/${org.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedOrganization(org)
                      setEditDialogOpen(true)
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Organization
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedOrganization(org)
                      setAddUserDialogOpen(true)
                    }}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedOrganization(org)
                      setContractDialogOpen(true)
                    }}>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Manage Contract
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/organizations/${org.id}/billing`)}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      View Billing History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedOrganization(org)
                      setReportDialogOpen(true)
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-orange-600"
                      onClick={() => {
                        setSelectedOrganization(org)
                        setSuspendDialogOpen(true)
                      }}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend Organization
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => {
                        setSelectedOrganization(org)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Organization
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      {selectedOrganization && (
        <>
          <EditOrganizationDialog
            organization={selectedOrganization}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <AddUserDialog
            organization={selectedOrganization}
            open={addUserDialogOpen}
            onOpenChange={setAddUserDialogOpen}
          />
          <ContractDialog
            organization={selectedOrganization}
            open={contractDialogOpen}
            onOpenChange={setContractDialogOpen}
          />
          <ReportDialog
            organization={selectedOrganization}
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
          />
          <SuspendOrganizationDialog
            organization={selectedOrganization}
            open={suspendDialogOpen}
            onOpenChange={setSuspendDialogOpen}
          />
          <DeleteOrganizationDialog
            organization={selectedOrganization}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}