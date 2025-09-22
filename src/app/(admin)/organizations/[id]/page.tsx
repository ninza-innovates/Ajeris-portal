'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOrganization, useOrganizationUsers, useDeleteOrganization, useTestHL7Connection } from '@/lib/api/hooks/use-organizations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Building, 
  Users, 
  CreditCard, 
  Settings, 
  Activity,
  Edit,
  UserPlus,
  FileText,
  Power,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Server,
  Database,
  Shield,
  Clock,
  TrendingUp,
  DollarSign,
  FileSearch,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Stethoscope
} from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Mock data for charts - replace with actual API calls
const studyVolumeData = [
  { month: 'Jan', studies: 450 },
  { month: 'Feb', studies: 520 },
  { month: 'Mar', studies: 480 },
  { month: 'Apr', studies: 610 },
  { month: 'May', studies: 580 },
  { month: 'Jun', studies: 690 },
]

const tatMetricsData = [
  { day: 'Mon', avg: 24, target: 30 },
  { day: 'Tue', avg: 28, target: 30 },
  { day: 'Wed', avg: 22, target: 30 },
  { day: 'Thu', avg: 26, target: 30 },
  { day: 'Fri', avg: 31, target: 30 },
  { day: 'Sat', avg: 29, target: 30 },
  { day: 'Sun', avg: 25, target: 30 },
]

const modalityDistribution = [
  { name: 'CT', value: 35, color: '#0088FE' },
  { name: 'MRI', value: 30, color: '#00C49F' },
  { name: 'X-Ray', value: 20, color: '#FFBB28' },
  { name: 'Ultrasound', value: 15, color: '#FF8042' },
]

const userActivityData = [
  { hour: '00:00', logins: 2 },
  { hour: '04:00', logins: 1 },
  { hour: '08:00', logins: 25 },
  { hour: '12:00', logins: 15 },
  { hour: '16:00', logins: 20 },
  { hour: '20:00', logins: 8 },
]

// Mock data for recent studies
const recentStudies = [
  { id: '1', accession: 'ACC001', patientName: 'John Doe', modality: 'CT', status: 'Completed', createdAt: '2024-01-15T10:30:00' },
  { id: '2', accession: 'ACC002', patientName: 'Jane Smith', modality: 'MRI', status: 'In Review', createdAt: '2024-01-15T09:15:00' },
  { id: '3', accession: 'ACC003', patientName: 'Robert Johnson', modality: 'X-Ray', status: 'Completed', createdAt: '2024-01-15T08:45:00' },
]

// Mock data for invoices
const recentInvoices = [
  { id: '1', number: 'INV-2024-001', amount: 5000, status: 'Paid', date: '2024-01-01' },
  { id: '2', number: 'INV-2024-002', amount: 7500, status: 'Pending', date: '2024-01-15' },
  { id: '3', number: 'INV-2023-012', amount: 4200, status: 'Paid', date: '2023-12-15' },
]

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = params.id as string
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch organization data
  const { data: orgResponse, isLoading } = useOrganization(organizationId)
  const { data: usersResponse } = useOrganizationUsers(organizationId)
  const deleteOrganization = useDeleteOrganization()
  const testHL7 = useTestHL7Connection()

  const organization = orgResponse?.data
  const users = usersResponse?.data || []

  const handleToggleStatus = async () => {
    try {
      // API call to toggle organization status
      toast({
        title: 'Success',
        description: `Organization ${organization?.status === 'Active' ? 'suspended' : 'activated'} successfully`,
      })
      setIsActivateDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update organization status',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateReport = () => {
    toast({
      title: 'Report Generation',
      description: 'Organization report is being generated...',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[600px]" />
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Organization not found</p>
        <p className="text-muted-foreground mb-4">The organization you're looking for doesn't exist or has been removed.</p>
        <Button
          variant="outline"
          onClick={() => router.push('/organizations')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getContractBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'Expired':
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const icon = type === 'Hospital' ? <Building className="h-3 w-3" /> : 
                 type === 'Imaging Center' ? <FileSearch className="h-3 w-3" /> : 
                 <Stethoscope className="h-3 w-3" />
    return (
      <Badge variant="outline" className="gap-1">
        {icon}
        {type}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/organizations')}
              className="mt-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/api/placeholder/64/64`} alt={organization.name} />
                <AvatarFallback className="text-xl">
                  {organization.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold">{organization.name}</h1>
                  {getTypeBadge(organization.type)}
                  {getStatusBadge(organization.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {organization.contact?.email || organization.contactEmail || 'No email'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {organization.contact?.phone || organization.contactPhone || 'No phone'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Since {format(new Date(organization.createdAt), 'MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/organizations/${organizationId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Organization
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/organizations/${organizationId}/users`)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Manage Contract
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
            >
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button
              variant={organization.status === 'Active' ? 'destructive' : 'default'}
              size="sm"
              onClick={() => setIsActivateDialogOpen(true)}
            >
              <Power className="mr-2 h-4 w-4" />
              {organization.status === 'Active' ? 'Suspend' : 'Activate'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full max-w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="studies">Studies</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Organization Type</p>
                    <p className="mt-1">{organization.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="mt-1">{getStatusBadge(organization.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="mt-1">{organization.userCount || users.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Radiologists</p>
                    <p className="mt-1">{organization.radiologistCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address & Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Address & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Primary Contact</p>
                  <p className="mt-1">{organization.contact?.name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${organization.contact?.email || organization.contactEmail}`} className="text-sm text-blue-600 hover:underline">
                      {organization.contact?.email || organization.contactEmail || 'No email'}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{organization.contact?.phone || organization.contactPhone || 'No phone'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {organization.address ? (
                        typeof organization.address === 'string' ? 
                          organization.address : 
                          `${organization.address.street}, ${organization.address.city}, ${organization.address.state} ${organization.address.zip}`
                      ) : 'No address specified'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contract Status</p>
                  <div className="mt-1">{getContractBadge(organization.contractStatus)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Billing Status</p>
                  <Badge variant={organization.billingStatus === 'Current' ? 'outline' : 'destructive'}>
                    {organization.billingStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contract Start</p>
                  <p className="mt-1">{format(new Date(organization.createdAt), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Onboarding Status</p>
                  <Badge variant="outline">{organization.onboardingStatus || 'Completed'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Organization Users</CardTitle>
                <CardDescription>Manage users associated with this organization</CardDescription>
              </div>
              <Button onClick={() => router.push(`/organizations/${organizationId}/users`)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
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
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'outline' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastActive ? format(new Date(user.lastActive), 'MMM d, yyyy') : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No users found for this organization
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Studies Tab */}
        <TabsContent value="studies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Studies</CardTitle>
              <CardDescription>Studies submitted by this organization</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accession</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Modality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentStudies.map((study) => (
                    <TableRow key={study.id}>
                      <TableCell className="font-medium">{study.accession}</TableCell>
                      <TableCell>{study.patientName}</TableCell>
                      <TableCell>{study.modality}</TableCell>
                      <TableCell>
                        <Badge variant={study.status === 'Completed' ? 'outline' : 'secondary'}>
                          {study.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(study.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* PACS Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  PACS Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AE Title</p>
                  <p className="mt-1 font-mono">{organization.aeTitle || 'Not configured'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Datastore ID</p>
                  <p className="mt-1 font-mono">{organization.datastoreId || 'Not configured'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Connection Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HL7 Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  HL7 Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">HL7 Enabled</p>
                  <div className="flex items-center gap-2 mt-1">
                    {organization.hl7InterfaceEnabled ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Enabled</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
                {organization.hl7Settings && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Endpoint</p>
                      <p className="mt-1 font-mono text-sm">{organization.hl7Settings.endpoint || 'Not configured'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Port</p>
                      <p className="mt-1">{organization.hl7Settings.port || 'Not configured'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Version</p>
                      <p className="mt-1">{organization.hl7Settings.version || 'Not configured'}</p>
                    </div>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testHL7.mutate(organizationId)}
                  disabled={testHL7.isPending || !organization.hl7InterfaceEnabled}
                  className="w-full"
                >
                  Test HL7 Connection
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">IP Whitelisting</p>
                    <p className="text-sm text-muted-foreground">Restrict access by IP</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Badge variant="outline">30 mins</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,500</div>
                <p className="text-xs text-muted-foreground">Due in 15 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,200</div>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Total: $7,500</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ACH</div>
                <p className="text-xs text-muted-foreground">Net 30 terms</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Invoice history and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{format(new Date(invoice.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'Paid' ? 'outline' : 'destructive'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Monthly payment trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={studyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="studies" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                    name="Amount ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Study Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Study Volume</CardTitle>
                <CardDescription>Monthly study submission trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={studyVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="studies" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* TAT Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Turnaround Time (TAT)</CardTitle>
                <CardDescription>Average TAT vs target (hours)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tatMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg" fill="#8884d8" name="Average TAT" />
                    <Bar dataKey="target" fill="#82ca9d" name="Target TAT" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Modality Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Modality Distribution</CardTitle>
                <CardDescription>Study types breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modalityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {modalityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Login patterns throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="logins" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name="User Logins"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Key metrics for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-muted-foreground">Study Growth</p>
                  </div>
                  <p className="text-2xl font-bold">+12%</p>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-muted-foreground">Avg TAT</p>
                  </div>
                  <p className="text-2xl font-bold">26 hrs</p>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  </div>
                  <p className="text-2xl font-bold">89%</p>
                  <Progress value={89} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-muted-foreground">Revenue Impact</p>
                  </div>
                  <p className="text-2xl font-bold">$45K</p>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activate/Suspend Confirmation Dialog */}
      <AlertDialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {organization.status === 'Active' ? 'Suspend Organization?' : 'Activate Organization?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {organization.status === 'Active' 
                ? `This will suspend "${organization.name}" and prevent users from accessing the system. All ongoing studies will be paused.`
                : `This will activate "${organization.name}" and allow users to access the system and submit studies.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={organization.status === 'Active' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {organization.status === 'Active' ? 'Suspend Organization' : 'Activate Organization'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}