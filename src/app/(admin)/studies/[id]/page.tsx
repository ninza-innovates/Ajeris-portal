'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  useStudy, 
  useStudyAuditLog, 
  useStudyFiles,
  useReassignStudy,
  useMarkStudyCritical,
  useAddStudyNote
} from '@/lib/api/hooks/use-studies'
import { useRadiologists } from '@/lib/api/hooks/use-radiologists'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Building, 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  MessageSquare,
  Download,
  Eye,
  History,
  FileImage,
  Loader2,
  Play,
  MonitorSpeaker,
  Shield,
  FileDown,
  Activity,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function StudyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [selectedRadiologistId, setSelectedRadiologistId] = useState('')
  const [reassignReason, setReassignReason] = useState('')
  const [showPrivacyControls, setShowPrivacyControls] = useState(false)

  // Fetch study data
  const { data: studyResponse, isLoading } = useStudy(studyId)
  const { data: auditLogResponse } = useStudyAuditLog(studyId)
  const { data: filesResponse } = useStudyFiles(studyId)
  const { data: radiologistsResponse } = useRadiologists()
  
  // Mutations
  const reassignStudy = useReassignStudy(studyId)
  const markStudyCritical = useMarkStudyCritical(studyId)
  const addStudyNote = useAddStudyNote(studyId)

  const study = studyResponse?.data
  const auditLog = auditLogResponse?.data || []
  const files = filesResponse?.data || []
  const radiologists = radiologistsResponse?.data || []

  const handleGenerateReport = async () => {
    try {
      // Mock report generation - in real app would call API
      toast({
        title: 'Report Generation Started',
        description: 'Radiologist report is being generated...',
      })
      setIsReportDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadImages = async () => {
    try {
      // Mock download - in real app would call API
      toast({
        title: 'Download Started',
        description: 'DICOM images are being prepared for download...',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download images',
        variant: 'destructive',
      })
    }
  }

  const handleViewInPACS = () => {
    // Mock PACS viewer - in real app would open PACS interface
    toast({
      title: 'Opening PACS Viewer',
      description: 'Launching external PACS viewer...',
    })
  }

  const handleReassign = async () => {
    if (!selectedRadiologistId) {
      toast({
        title: 'Error',
        description: 'Please select a radiologist',
        variant: 'destructive',
      })
      return
    }

    try {
      await reassignStudy.mutateAsync({
        radiologistId: selectedRadiologistId,
        reason: reassignReason
      })
      setIsReassignDialogOpen(false)
      setSelectedRadiologistId('')
      setReassignReason('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reassign study',
        variant: 'destructive',
      })
    }
  }

  const handleMarkPriority = async () => {
    try {
      await markStudyCritical.mutateAsync()
      toast({
        title: 'Success',
        description: 'Study marked as priority',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark study as priority',
        variant: 'destructive',
      })
    }
  }


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-[600px]" />
      </div>
    )
  }

  if (!study) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Study not found</h3>
        <p className="text-muted-foreground mb-6">The requested study could not be found or you don't have permission to view it.</p>
        <Button
          variant="outline"
          onClick={() => router.push('/studies')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Studies
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case 'in review':
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Review</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'stat':
        return <Badge variant="destructive">STAT</Badge>
      case 'urgent':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Urgent</Badge>
      case 'routine':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Routine</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getModalityColor = (modality: string) => {
    const colors: Record<string, string> = {
      'CT': 'bg-blue-100 text-blue-800 border-blue-200',
      'MRI': 'bg-purple-100 text-purple-800 border-purple-200',
      'X-RAY': 'bg-green-100 text-green-800 border-green-200',
      'US': 'bg-teal-100 text-teal-800 border-teal-200',
      'NM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PET': 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[modality] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Mock data for demonstration
  const mockStudy = {
    ...study,
    accessionNumber: study?.accession || 'ACC001234',
    patientName: study?.patientName ? 
      `${study.patientName.first} ${study.patientName.last}` : 
      'Jane Doe',
    mrn: study?.mrn || 'MRN123456',
    studyDate: study?.studyDate || study?.createdAt,
    bodyPart: study?.bodyPart || 'Chest',
    description: study?.studyDescription || 'CT Chest with Contrast',
    referringPhysician: 'Dr. John Smith',
    technologist: 'Sarah Johnson, RT',
    studyInstance: '1.2.840.113654.2.55.123456789',
    seriesCount: 4,
    imageCount: study?.imageCount || 125,
    studySize: '45.2 MB',
    acquisitionTime: '14:32:15',
    institutionName: study?.organizationName || study?.organization,
    clinicalHistory: 'Chest pain, rule out pulmonary embolism',
    reportStatus: 'Draft',
    reportContent: 'Preliminary findings: No acute cardiopulmonary abnormality...',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/studies')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold">{mockStudy.accessionNumber}</h1>
                <Badge className={getModalityColor(mockStudy.modality)}>
                  {mockStudy.modality}
                </Badge>
                {getStatusBadge(mockStudy.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {mockStudy.patientName}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  MRN: {mockStudy.mrn}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(mockStudy.studyDate), 'MMM d, yyyy')}
                </div>
                {getPriorityBadge(mockStudy.priority)}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReassignDialogOpen(true)}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Assign to Radiologist
            </Button>
            {mockStudy.priority !== 'STAT' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkPriority}
                disabled={markStudyCritical.isPending}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Mark as Priority
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportDialogOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadImages}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Images
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewInPACS}
            >
              <MonitorSpeaker className="mr-2 h-4 w-4" />
              View in PACS
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivacyControls(!showPrivacyControls)}
            >
              <Shield className="mr-2 h-4 w-4" />
              Privacy
            </Button>
          </div>
        </div>
        
        {/* Privacy Controls */}
        {showPrivacyControls && (
          <Card className="mt-4 border-amber-200 bg-amber-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">Patient Privacy Controls</span>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                This study contains protected health information (PHI). Access is logged for HIPAA compliance.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Request Access Extension
                </Button>
                <Button size="sm" variant="outline">
                  Log PHI Access
                </Button>
                <Button size="sm" variant="outline">
                  View Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Study Viewer Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* DICOM Viewer Placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                DICOM Viewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                <div className="relative z-10 text-center text-white">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">DICOM Viewer Integration</p>
                  <p className="text-sm opacity-75 mb-4">Click to load study images</p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => toast({ title: 'Loading DICOM Viewer', description: 'Initializing medical image viewer...' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Load Images
                  </Button>
                </div>
                {/* Mock viewer overlay */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    Series 1/4
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    Image 45/125
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-20 flex gap-1">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Study Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Series Count</span>
                <span className="text-sm">{mockStudy.seriesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Image Count</span>
                <span className="text-sm">{mockStudy.imageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Study Size</span>
                <span className="text-sm">{mockStudy.studySize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Body Part</span>
                <span className="text-sm">{mockStudy.bodyPart}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium">Acquisition Time</span>
                <span className="text-sm font-mono">{mockStudy.acquisitionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Institution</span>
                <span className="text-sm">{mockStudy.institutionName}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Assigned Radiologist</span>
                <div className="flex items-center gap-2 mt-1">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{mockStudy.assignedRadiologistName || 'Unassigned'}</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Referring Physician</span>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{mockStudy.referringPhysician}</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Technologist</span>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{mockStudy.technologist}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Study Details */}
            <Card>
              <CardHeader>
                <CardTitle>Study Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Accession Number</p>
                    <p className="mt-1 font-mono text-sm">{mockStudy.accessionNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Study Instance UID</p>
                    <p className="mt-1 font-mono text-xs break-all">{mockStudy.studyInstance}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Study Date</p>
                    <p className="mt-1 text-sm">{format(new Date(mockStudy.studyDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                    <p className="mt-1 text-sm font-mono">{mockStudy.acquisitionTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Modality</p>
                    <Badge className={getModalityColor(mockStudy.modality)} variant="outline">
                      {mockStudy.modality}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Body Part</p>
                    <p className="mt-1 text-sm">{mockStudy.bodyPart}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Study Description</p>
                  <p className="text-sm">{mockStudy.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Clinical History</p>
                  <p className="text-sm text-muted-foreground">{mockStudy.clinicalHistory}</p>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                    <p className="mt-1 font-medium">{mockStudy.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">MRN</p>
                    <p className="mt-1 font-mono text-sm">{mockStudy.mrn}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                    <p className="mt-1 text-sm">Jan 15, 1980</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="mt-1 text-sm">44 years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="mt-1 text-sm">Female</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                    <p className="mt-1 font-mono text-sm">PID789012</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Referring Physician</p>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockStudy.referringPhysician}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      (555) 123-4567
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      dr.smith@hospital.com
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Institution</p>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockStudy.institutionName}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    123 Medical Center Drive, Healthcare City
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>DICOM Images</CardTitle>
              <CardDescription>Study series and images with thumbnails</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mock Series Data */}
                {[
                  { seriesNumber: 1, description: 'Localizer', images: 3, thickness: '5.0mm' },
                  { seriesNumber: 2, description: 'Axial CT Chest', images: 45, thickness: '1.25mm' },
                  { seriesNumber: 3, description: 'Coronal Reconstruction', images: 25, thickness: '2.5mm' },
                  { seriesNumber: 4, description: 'Sagittal Reconstruction', images: 15, thickness: '2.5mm' },
                ].map((series) => (
                  <div key={series.seriesNumber} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Series {series.seriesNumber}: {series.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {series.images} images • Slice thickness: {series.thickness}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Series
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {/* Mock Thumbnails */}
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: Math.min(8, series.images) }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-900 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded" />
                          <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
                            {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Radiologist Report</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {mockStudy.reportStatus}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Edit Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Clinical Indication</h4>
                      <p className="text-sm text-muted-foreground border-l-4 border-blue-200 pl-4">
                        {mockStudy.clinicalHistory}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Technique</h4>
                      <p className="text-sm">
                        Helical CT of the chest was performed with IV contrast administration. 
                        Images were obtained in the axial plane with multiplanar reconstructions.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Findings</h4>
                      <div className="text-sm space-y-2">
                        <p>The lungs are clear bilaterally without evidence of consolidation, pneumothorax, or pleural effusion.</p>
                        <p>The heart size is normal. No pericardial effusion.</p>
                        <p>The mediastinal and hilar contours appear normal.</p>
                        <p>No enlarged lymph nodes are identified.</p>
                        <p>The pulmonary vasculature appears normal without evidence of pulmonary embolism.</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Impression</h4>
                      <p className="text-sm font-medium bg-green-50 border-l-4 border-green-400 p-3 rounded">
                        No acute cardiopulmonary abnormality.
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Dictated by: Dr. Sarah Wilson, MD</span>
                        <span>Draft created: {format(new Date(), 'MMM d, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Report Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Images Reviewed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Findings Documented</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Pending Final Review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-muted-foreground">Awaiting Signature</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Button className="w-full" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Finalize Report
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Request Peer Review
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Save as Template
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Turnaround Time</p>
                    <p className="text-sm">Target: 24 hours</p>
                    <p className="text-sm text-green-600">Elapsed: 4.2 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Workflow History</CardTitle>
              <CardDescription>Complete timeline of study workflow and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Workflow Timeline */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  
                  {/* Mock workflow events */}
                  {[
                    {
                      time: '2024-01-15 08:30:00',
                      event: 'Study Received',
                      description: 'DICOM images uploaded from modality',
                      user: 'System',
                      status: 'completed'
                    },
                    {
                      time: '2024-01-15 08:32:15',
                      event: 'Quality Check',
                      description: 'Automated quality validation passed',
                      user: 'QC System',
                      status: 'completed'
                    },
                    {
                      time: '2024-01-15 09:15:30',
                      event: 'Assigned to Radiologist',
                      description: 'Study assigned to Dr. Sarah Wilson based on specialty match',
                      user: 'Auto-Assignment',
                      status: 'completed'
                    },
                    {
                      time: '2024-01-15 13:45:00',
                      event: 'Reading Started',
                      description: 'Dr. Wilson began preliminary review',
                      user: 'Dr. Sarah Wilson',
                      status: 'completed'
                    },
                    {
                      time: '2024-01-15 14:20:00',
                      event: 'Report Draft Created',
                      description: 'Initial findings documented',
                      user: 'Dr. Sarah Wilson',
                      status: 'in-progress'
                    },
                    {
                      time: 'Pending',
                      event: 'Final Review',
                      description: 'Awaiting final review and signature',
                      user: 'Dr. Sarah Wilson',
                      status: 'pending'
                    }
                  ].map((event, index) => (
                    <div key={index} className="relative flex items-start gap-4 pb-6">
                      <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        event.status === 'completed' ? 'bg-green-100 border-green-500' :
                        event.status === 'in-progress' ? 'bg-blue-100 border-blue-500' :
                        'bg-gray-100 border-gray-300'
                      }`}>
                        {event.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : event.status === 'in-progress' ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{event.event}</h4>
                          <span className="text-xs text-muted-foreground">
                            {event.time !== 'Pending' ? format(new Date(event.time), 'MMM d, HH:mm') : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">By: {event.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Assignment History */}
                <Separator />
                <div>
                  <h4 className="font-medium mb-4">Assignment History</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium text-sm">Dr. Sarah Wilson</p>
                          <p className="text-xs text-muted-foreground">Chest Radiology Specialist</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Current Assignment</p>
                        <p className="text-xs text-muted-foreground">Jan 15, 09:15</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <History className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Auto-Assignment Pool</p>
                          <p className="text-xs text-muted-foreground">Initial study queue</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Previous</p>
                        <p className="text-xs text-muted-foreground">Jan 15, 08:30</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Associated Files & Documents</CardTitle>
              <CardDescription>DICOM files, reports, and related documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* DICOM Files Section */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    DICOM Files
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: 'CT_CHEST_001.dcm', size: '12.4 MB', series: 'Series 1', images: 3 },
                      { name: 'CT_CHEST_002.dcm', size: '28.7 MB', series: 'Series 2', images: 45 },
                      { name: 'CT_CHEST_003.dcm', size: '15.2 MB', series: 'Series 3', images: 25 },
                      { name: 'CT_CHEST_004.dcm', size: '8.9 MB', series: 'Series 4', images: 15 },
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileImage className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.series} • {file.images} images • {file.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Reports & Documents */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reports & Documents
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Preliminary_Report.pdf', type: 'Report', size: '156 KB', date: '2024-01-15' },
                      { name: 'Prior_Study_Comparison.pdf', type: 'Comparison', size: '89 KB', date: '2024-01-10' },
                      { name: 'Clinical_Notes.txt', type: 'Notes', size: '4 KB', date: '2024-01-15' },
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.type} • {file.size} • {format(new Date(file.date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {files.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Additional Files</h4>
                      <div className="space-y-2">
                        {files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileImage className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{file.filename}</p>
                                <p className="text-xs text-muted-foreground">
                                  {file.type} • {file.size} bytes • {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>


      {/* Reassign Dialog */}
      <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Radiologist</DialogTitle>
            <DialogDescription>
              Select a radiologist to assign this study for review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Radiologist</label>
              <Select value={selectedRadiologistId} onValueChange={setSelectedRadiologistId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a radiologist" />
                </SelectTrigger>
                <SelectContent>
                  {radiologists.map((radiologist) => (
                    <SelectItem key={radiologist.id} value={radiologist.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{radiologist.firstName} {radiologist.lastName}</span>
                        <Badge variant="outline" className="ml-2">
                          {radiologist.specialties?.[0] || 'General'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Assignment Reason</label>
              <Textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Optional: Enter reason for assignment..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReassign}
              disabled={reassignStudy.isPending || !selectedRadiologistId}
            >
              {reassignStudy.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Study'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Initiate radiologist report generation for this study
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <p className="text-sm font-medium text-blue-900 mb-2">Report Generation Options</p>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Preliminary findings will be auto-populated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Template based on modality and body part</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Prior studies will be referenced</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Report Template</label>
              <Select defaultValue="standard">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard CT Chest</SelectItem>
                  <SelectItem value="emergency">Emergency/STAT Template</SelectItem>
                  <SelectItem value="comparison">With Prior Comparison</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}