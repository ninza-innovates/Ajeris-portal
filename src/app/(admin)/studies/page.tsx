'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useStudies, useStudyStats, useReassignStudy, useEscalateStudy, useFlagCompliance, useDeleteStudy, useExportStudies } from '@/hooks/use-studies'
import { Study } from '@/types/study'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/auth-store'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import {
  Search,
  MoreVertical,
  Download,
  Filter,
  Eye,
  Info,
  Settings,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserCheck,
  Edit,
  DollarSign,
  Flag,
  FileText,
  Archive,
} from 'lucide-react'

export default function StudiesPage() {
  const router = useRouter()
  const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOrg, setFilterOrg] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Dialog states
  const [selectedStudy, setSelectedStudy] = useState<any>(null)
  const [reassignRadiologistOpen, setReassignRadiologistOpen] = useState(false)
  const [overrideStatusOpen, setOverrideStatusOpen] = useState(false)
  const [flagComplianceOpen, setFlagComplianceOpen] = useState(false)
  const [archiveStudyOpen, setArchiveStudyOpen] = useState(false)
  const [complianceNote, setComplianceNote] = useState('')

  const toggleStudySelection = (studyId: string) => {
    const newSelection = new Set(selectedStudies)
    if (newSelection.has(studyId)) {
      newSelection.delete(studyId)
    } else {
      newSelection.add(studyId)
    }
    setSelectedStudies(newSelection)
  }

  // Fetch studies with filters
  const { data: studies = [], isLoading, error } = useStudies({
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
    organizationId: filterOrg !== 'all' ? filterOrg : undefined,
    priority: filterPriority !== 'all' ? filterPriority as any : undefined,
    status: filterStatus !== 'all' ? filterStatus as any : undefined,
  })

  const { data: stats, isLoading: statsLoading } = useStudyStats()
  const reassignMutation = useReassignStudy()
  const escalateMutation = useEscalateStudy()
  const flagComplianceMutation = useFlagCompliance()
  const deleteMutation = useDeleteStudy()
  const exportMutation = useExportStudies()

  const toggleAllStudies = () => {
    if (selectedStudies.size === studies.length) {
      setSelectedStudies(new Set())
    } else {
      setSelectedStudies(new Set(studies.map(s => s.id)))
    }
  }

  // Get unique organizations for filter
  const organizations = useMemo(() => {
    const orgs = new Set<string>()
    studies.forEach(study => {
      if (study.organization?.name) {
        orgs.add(study.organization.name)
      }
    })
    return Array.from(orgs).sort()
  }, [studies])

  const statsData = useMemo(() => [
    {
      title: 'Total Studies',
      value: stats?.totalStudies?.toLocaleString() || '0',
      subtitle: 'All time',
      change: '+12.5%',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Studies Assigned',
      value: stats?.assignedStudies?.toLocaleString() || '0',
      subtitle: 'Studies assigned',
      change: '+8.2%',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Awaiting Review',
      value: stats?.awaitingReview?.toString() || '0',
      subtitle: 'Awaiting review',
      detail: '7 urgent',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Require Attention',
      value: stats?.requireAttention?.toString() || '0',
      subtitle: 'Require attention',
      detail: 'Immediate action',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ], [stats])

  const getStatusBadge = (status: Study['status']) => {
    const variants: Record<Study['status'], any> = {
      'In Review': 'info',
      'Completed': 'success',
      'Error': 'destructive',
      'Pending': 'warning'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getPriorityBadge = (priority: Study['priority']) => {
    if (priority === 'Standard') return null
    const variants: Record<string, any> = {
      'STAT': 'destructive',
      'Urgent': 'warning',
      'Routine': 'secondary'
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
  }

  const getBillingBadge = (billing: Study['billingStatus']) => {
    const variants: Record<Study['billingStatus'], any> = {
      'Paid': 'success',
      'Submitted': 'info',
      'Pending': 'warning',
      'Failed': 'destructive',
      'Not Started': 'secondary'
    }
    return <Badge variant={variants[billing]}>{billing}</Badge>
  }

  const getComplianceBadge = (compliance: Study['compliance']) => {
    const variants: Record<Study['compliance'], any> = {
      'Compliant': 'success',
      'Flagged': 'destructive',
      'Under Review': 'warning'
    }
    return <Badge variant={variants[compliance]}>{compliance}</Badge>
  }

  const getTATIcon = (tat: Study['tat']) => {
    const icons = {
      'On Time': <CheckCircle className="h-4 w-4 text-green-600" />,
      'At Risk': <AlertCircle className="h-4 w-4 text-yellow-600" />,
      'Overdue': <XCircle className="h-4 w-4 text-red-600" />
    }
    return icons[tat]
  }

  const openDicomViewer = (study: Study) => {
    // Use the Ajeris DICOM Viewer URL format from Tim's message
    // Correct IP address is 52.2.136.143
    const viewerBaseUrl = process.env.NEXT_PUBLIC_DICOM_VIEWER_URL || 'http://52.2.136.143/viewer'
    const studyId = study.id || study.StudyInstanceUID
    const datastoreId = study.datastoreId || '08933571d745443db49000983184fc7b' // Default from Frank's example
    
    // Get auth token if available
    const authStore = useAuthStore.getState()
    const token = authStore.token
    
    let viewerUrl = `${viewerBaseUrl}?StudyInstanceUIDs=${studyId}&datastoreId=${datastoreId}`
    
    // Add token if available
    if (token) {
      viewerUrl += `&token=${token}`
    }
    
    window.open(viewerUrl, '_blank')
  }

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Studies</h1>
            <p className="text-muted-foreground">Admin View</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-destructive">Error Loading Studies</h2>
            <p className="text-muted-foreground mt-2">Unable to fetch studies data. Please try again.</p>
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
          <h1 className="text-2xl font-bold tracking-tight">All Studies</h1>
          <p className="text-muted-foreground">Admin View</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-8 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          statsData.map((stat) => (
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
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search patient, study, modality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterOrg}
              onChange={(e) => setFilterOrg(e.target.value)}
            >
              <option value="all">All Organizations</option>
              <option value="NYC-001">NYC-001</option>
              <option value="NYC-002">NYC-002</option>
              <option value="CHI-001">CHI-001</option>
              <option value="BOS-001">BOS-001</option>
              <option value="LA-001">LA-001</option>
            </select>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="STAT">STAT</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
            </select>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 24h
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button 
              size="sm" 
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button 
              size="sm" 
              variant={filterStatus === 'Completed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('Completed')}
            >
              Completed
            </Button>
            <Button 
              size="sm" 
              variant={filterStatus === 'In Review' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('In Review')}
            >
              In Review
            </Button>
            <Button 
              size="sm" 
              variant={filterStatus === 'Error' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('Error')}
            >
              Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedStudies.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedStudies.size} studies selected
              </span>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Select all {studies.length}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">Reassign Radiologist</Button>
              <Button size="sm" variant="outline">Update Status</Button>
              <Button size="sm" variant="outline">Export Selected</Button>
              <Button size="sm" variant="destructive">Archive</Button>
            </div>
          </div>
        </div>
      )}

      {/* Studies Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={selectedStudies.size === studies.length && studies.length > 0}
                      onCheckedChange={toggleAllStudies}
                    />
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Request Date</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Study Date</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Last</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">First</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">MRN#</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Accession #</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase"># Images</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Study</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Radiologist</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Hospital</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Organization</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Billing</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={14} className="p-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-6 w-6" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={14} className="p-6 text-center text-red-600">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Failed to load studies: {error.message}</span>
                      </div>
                    </td>
                  </tr>
                ) : studies.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="p-6 text-center text-muted-foreground">
                      No studies found
                    </td>
                  </tr>
                ) : (
                  studies.map((study) => (
                  <tr 
                    key={study.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      // Don't navigate if clicking on checkbox or action buttons
                      if ((e.target as HTMLElement).closest('button, input[type="checkbox"]')) {
                        return
                      }
                      router.push(`/studies/${study.id}`)
                    }}
                  >
                    <td className="p-3">
                      <Checkbox
                        checked={selectedStudies.has(study.id)}
                        onCheckedChange={() => toggleStudySelection(study.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDicomViewer(study)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open DICOM Viewer</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedStudy(study)
                              setReassignRadiologistOpen(true)
                            }}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Reassign Radiologist
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedStudy(study)
                              setOverrideStatusOpen(true)
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Override Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/studies/${study.id}/billing`)}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              View Billing Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedStudy(study)
                              setFlagComplianceOpen(true)
                            }}>
                              <Flag className="mr-2 h-4 w-4" />
                              Flag for Compliance
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/studies/${study.id}/audit`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Audit Trail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => {
                              setSelectedStudy(study)
                              setArchiveStudyOpen(true)
                            }}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive Study
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{study.requestDate || study.createdAt}</td>
                    <td className="p-3 text-sm">{study.studyDate}</td>
                    <td className="p-3 text-sm font-medium">{study.patientName?.last || study.patientName}</td>
                    <td className="p-3 text-sm">{study.patientName?.first || ''}</td>
                    <td className="p-3 text-sm font-mono text-gray-600">{study.mrn || study.patientMRN}</td>
                    <td className="p-3 text-sm font-mono text-gray-600">{study.accession || study.accessionNumber}</td>
                    <td className="p-3 text-sm text-center">{study.images || study.imageCount}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(study.status)}
                        {getPriorityBadge(study.priority)}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{study.studyType || study.modality || 'N/A'}</td>
                    <td className="p-3 text-sm">{study.radiologist || study.assignedRadiologist?.name || 'Unassigned'}</td>
                    <td className="p-3 text-sm">{study.hospital || study.referringPhysician || 'N/A'}</td>
                    <td className="p-3 text-sm text-gray-600">{study.organization || study.organizationId || 'N/A'}</td>
                    <td className="p-3">{getBillingBadge(study.billingStatus)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getComplianceBadge(study.compliance)}
                        {getTATIcon(study.tat)}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <Dialog open={reassignRadiologistOpen} onOpenChange={setReassignRadiologistOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Radiologist</DialogTitle>
            <DialogDescription>
              Reassign study {selectedStudy?.accession} to a different radiologist
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <select className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select Radiologist</option>
              <option value="1">Dr. Sarah Johnson - Neuroradiology</option>
              <option value="2">Dr. Michael Chen - Musculoskeletal</option>
              <option value="3">Dr. Lisa Park - Chest/Cardiac</option>
              <option value="4">Dr. Ethan Moore - Abdominal</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignRadiologistOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Radiologist Reassigned",
                description: "Study has been reassigned to the selected radiologist",
              })
              setReassignRadiologistOpen(false)
            }}>
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={overrideStatusOpen} onOpenChange={setOverrideStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Study Status</DialogTitle>
            <DialogDescription>
              Change the status of study {selectedStudy?.accession}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <select className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select Status</option>
              <option value="pending">Pending Assignment</option>
              <option value="in-review">In Review</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Status Updated",
                description: "Study status has been overridden",
              })
              setOverrideStatusOpen(false)
            }}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={flagComplianceOpen} onOpenChange={setFlagComplianceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag for Compliance Review</DialogTitle>
            <DialogDescription>
              Flag study {selectedStudy?.accession} for compliance review
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for Flagging</label>
              <select className="w-full px-3 py-2 border rounded-lg mt-1">
                <option value="">Select Reason</option>
                <option value="quality">Quality Concern</option>
                <option value="billing">Billing Issue</option>
                <option value="patient-safety">Patient Safety</option>
                <option value="regulatory">Regulatory Compliance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea
                placeholder="Enter details..."
                value={complianceNote}
                onChange={(e) => setComplianceNote(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFlagComplianceOpen(false)
              setComplianceNote('')
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Flagged for Compliance",
                description: "Study has been flagged for compliance review",
              })
              setFlagComplianceOpen(false)
              setComplianceNote('')
            }}>
              Flag Study
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={archiveStudyOpen} onOpenChange={setArchiveStudyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Study</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive study {selectedStudy?.accession}? 
              This will remove it from active lists but keep it for records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveStudyOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              toast({
                title: "Study Archived",
                description: "Study has been moved to archives",
              })
              setArchiveStudyOpen(false)
            }}>
              Archive Study
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