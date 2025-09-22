'use client'

import { useParams, useRouter } from 'next/navigation'
import { useStudy, useStudyAuditLog } from '@/lib/api/hooks/use-studies'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Clock,
  User,
  Activity,
  AlertCircle,
  Download,
  Filter,
  Search,
  MoreVertical,
  Shield,
  Database,
  FileText,
  UserCheck,
  Upload,
  DollarSign,
  Zap,
  Eye,
  Lock,
  Unlock,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  Key,
  LogIn,
  LogOut,
  Edit3,
  Trash2,
  Copy,
  Mail,
  Phone,
  Calendar,
  Users
} from 'lucide-react'
import { useState } from 'react'

// Extended audit event types
type AuditEventType = 
  | 'status_change' 
  | 'assignment' 
  | 'upload' 
  | 'report' 
  | 'billing' 
  | 'compliance' 
  | 'admin_action'
  | 'access'
  | 'system'
  | 'security'
  | 'data_change'
  | 'workflow'
  | 'communication'
  | 'export'

interface AuditEvent {
  id: string
  timestamp: string
  event: string
  user: string
  userRole?: string
  details?: string
  type: AuditEventType
  category: 'clinical' | 'administrative' | 'security' | 'system'
  severity: 'info' | 'warning' | 'critical'
  ipAddress?: string
  userAgent?: string
  duration?: string
  changes?: {
    field: string
    oldValue: string
    newValue: string
  }[]
}

export default function StudyAuditPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('timeline')
  
  // Fetch study and audit log data
  const { data: study, isLoading: studyLoading } = useStudy(studyId)
  const { data: auditLogData, isLoading: auditLoading } = useStudyAuditLog(studyId)
  
  // Transform API data to match our interface
  const transformAuditEvents = (rawEvents: any[]): AuditEvent[] => {
    if (!rawEvents) return []
    
    return rawEvents.map((event: any) => {
      // Determine event type based on action or event name
      let type: AuditEventType = 'system'
      let category: 'clinical' | 'administrative' | 'security' | 'system' = 'system'
      
      const eventLower = (event.event || event.action || '').toLowerCase()
      
      if (eventLower.includes('status')) type = 'status_change'
      else if (eventLower.includes('assign')) type = 'assignment'
      else if (eventLower.includes('upload')) type = 'upload'
      else if (eventLower.includes('report')) type = 'report'
      else if (eventLower.includes('billing')) type = 'billing'
      else if (eventLower.includes('compliance')) type = 'compliance'
      else if (eventLower.includes('access') || eventLower.includes('view')) type = 'access'
      else if (eventLower.includes('export') || eventLower.includes('download')) type = 'export'
      
      // Determine category
      if (['status_change', 'assignment', 'report', 'workflow'].includes(type)) category = 'clinical'
      else if (['billing', 'compliance', 'admin_action'].includes(type)) category = 'administrative'
      else if (['access', 'security', 'export'].includes(type)) category = 'security'
      
      return {
        id: event.id || `audit-${Date.now()}-${Math.random()}`,
        timestamp: event.timestamp || event.createdAt || new Date().toISOString(),
        event: event.event || event.action || 'Unknown Event',
        user: event.user || event.userName || event.performedBy || 'System',
        userRole: event.userRole || event.role,
        details: event.details || event.description,
        type,
        category,
        severity: event.severity || 'info',
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        duration: event.duration,
        changes: event.changes
      }
    })
  }
  
  const allAuditEvents = transformAuditEvents(auditLogData?.data || [])
  
  // Filter events based on search and filters
  const filteredEvents = allAuditEvents.filter(event => {
    const matchesSearch = event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.details && event.details.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || event.type === filterType
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })
  
  const getEventIcon = (type: AuditEventType) => {
    const icons: Record<AuditEventType, JSX.Element> = {
      status_change: <Activity className="h-4 w-4" />,
      assignment: <UserCheck className="h-4 w-4" />,
      upload: <Upload className="h-4 w-4" />,
      report: <FileText className="h-4 w-4" />,
      billing: <DollarSign className="h-4 w-4" />,
      compliance: <Shield className="h-4 w-4" />,
      admin_action: <Zap className="h-4 w-4" />,
      access: <Eye className="h-4 w-4" />,
      system: <Database className="h-4 w-4" />,
      security: <Lock className="h-4 w-4" />,
      data_change: <Edit3 className="h-4 w-4" />,
      workflow: <RefreshCw className="h-4 w-4" />,
      communication: <Mail className="h-4 w-4" />,
      export: <Download className="h-4 w-4" />
    }
    return icons[type] || <Info className="h-4 w-4" />
  }
  
  const getEventColor = (category: string) => {
    const colors: Record<string, string> = {
      clinical: 'bg-blue-50 border-blue-200',
      administrative: 'bg-purple-50 border-purple-200',
      security: 'bg-orange-50 border-orange-200',
      system: 'bg-gray-50 border-gray-200'
    }
    return colors[category] || 'bg-gray-50 border-gray-200'
  }
  
  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      info: 'secondary',
      warning: 'warning',
      critical: 'destructive'
    }
    return <Badge variant={variants[severity]}>{severity}</Badge>
  }
  
  // Calculate statistics
  const stats = {
    totalEvents: allAuditEvents.length,
    uniqueUsers: new Set(allAuditEvents.map(e => e.user)).size,
    accessEvents: allAuditEvents.filter(e => e.type === 'access').length,
    securityEvents: allAuditEvents.filter(e => e.category === 'security').length
  }
  
  if (studyLoading || auditLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }
  
  if (!study) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Study Not Found</AlertTitle>
          <AlertDescription>
            The requested study could not be found. Please check the study ID and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  
  const formatDateTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch {
      return timestamp
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Audit Trail
            </h1>
            <p className="text-muted-foreground">
              Study: {study.data?.accession || study.data?.id} • {study.data?.patientName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Audit Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                Security Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Compliance Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Audit Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Since study creation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Accessed this study
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Events</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accessEvents}</div>
            <p className="text-xs text-muted-foreground">
              Study access logs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.securityEvents}</div>
            <p className="text-xs text-muted-foreground">
              Security-related actions
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Audit Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search events, users, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-type">Event Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="status_change">Status Changes</SelectItem>
                  <SelectItem value="access">Access Logs</SelectItem>
                  <SelectItem value="report">Report Events</SelectItem>
                  <SelectItem value="billing">Billing Events</SelectItem>
                  <SelectItem value="system">System Events</SelectItem>
                  <SelectItem value="security">Security Events</SelectItem>
                  <SelectItem value="workflow">Workflow Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-category">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="filter-category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Audit Events */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="access">Access Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>
                Chronological view of all study events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>No audit events found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${getEventColor(event.category)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        {index < filteredEvents.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-3" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-base">{event.event}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              by {event.user}
                              {event.userRole && ` (${event.userRole})`}
                            </p>
                            {event.details && (
                              <p className="text-sm text-gray-600 mt-2">{event.details}</p>
                            )}
                            {event.changes && event.changes.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {event.changes.map((change, i) => (
                                  <p key={i} className="text-sm">
                                    <span className="font-medium">{change.field}:</span>{' '}
                                    <span className="text-red-600 line-through">{change.oldValue}</span>
                                    {' → '}
                                    <span className="text-green-600">{change.newValue}</span>
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <p className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDateTime(event.timestamp)}
                            </p>
                            {getSeverityBadge(event.severity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Event Log</CardTitle>
              <CardDescription>
                Complete audit information with all metadata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>No audit events found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${getEventColor(event.category)}`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <p className="font-medium">{event.event}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(event.timestamp)} • {event.user}
                              {event.userRole && ` (${event.userRole})`}
                            </p>
                          </div>
                        </div>
                        {getSeverityBadge(event.severity)}
                      </div>
                      
                      {event.details && (
                        <p className="text-sm text-gray-600 pl-13">{event.details}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-13 text-sm">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium">{event.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-medium">{event.category}</p>
                        </div>
                        {event.ipAddress && (
                          <div>
                            <p className="text-muted-foreground">IP Address</p>
                            <p className="font-mono">{event.ipAddress}</p>
                          </div>
                        )}
                        {event.duration && (
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{event.duration}</p>
                          </div>
                        )}
                      </div>
                      
                      {event.userAgent && (
                        <div className="pl-13">
                          <p className="text-sm text-muted-foreground">User Agent</p>
                          <p className="text-sm font-mono">{event.userAgent}</p>
                        </div>
                      )}
                      
                      {event.changes && event.changes.length > 0 && (
                        <div className="pl-13 space-y-1">
                          <p className="text-sm font-medium">Changes:</p>
                          {event.changes.map((change, i) => (
                            <p key={i} className="text-sm">
                              <span className="font-medium">{change.field}:</span>{' '}
                              <span className="text-red-600">{change.oldValue}</span>
                              {' → '}
                              <span className="text-green-600">{change.newValue}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>
                Detailed record of who accessed this study and when
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents.filter(event => event.type === 'access' || event.type === 'export').length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4" />
                  <p>No access logs found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents
                    .filter(event => event.type === 'access' || event.type === 'export')
                    .map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{event.user}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.userRole || 'Unknown Role'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{event.event}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</p>
                          {event.duration && (
                            <p className="text-xs text-muted-foreground">Duration: {event.duration}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {event.ipAddress && (
                            <p className="text-sm font-mono">{event.ipAddress}</p>
                          )}
                          {event.userAgent && (
                            <p className="text-xs text-muted-foreground">
                              {event.userAgent.split(' ')[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Security Alert */}
      {filteredEvents.some(e => e.severity === 'warning' || e.severity === 'critical') && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            This audit trail contains {filteredEvents.filter(e => e.severity === 'warning').length} warning 
            and {filteredEvents.filter(e => e.severity === 'critical').length} critical events that may require review.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}