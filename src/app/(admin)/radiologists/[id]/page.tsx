'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  useRadiologist, 
  useRadiologistPerformance, 
  useRadiologistStudies, 
  useRadiologistOrganizations,
  useUpdateRadiologist,
  useSuspendRadiologist,
  useActivateRadiologist
} from '@/lib/api/hooks/use-radiologists'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Stethoscope, 
  FileText, 
  Building, 
  Calendar,
  Edit,
  Ban,
  CheckCircle,
  Activity,
  Award,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Download,
  Eye,
  XCircle
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ResumeViewer } from '@/components/radiologist/resume-viewer'
import { Progress } from '@/components/ui/progress'

export default function RadiologistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const radiologistId = params.id as string
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch radiologist data
  const { data: radiologistResponse, isLoading } = useRadiologist(radiologistId)
  const { data: performanceResponse } = useRadiologistPerformance(radiologistId)
  const { data: studiesResponse } = useRadiologistStudies(radiologistId)
  const { data: organizationsResponse } = useRadiologistOrganizations(radiologistId)
  
  // Mutations
  const updateRadiologist = useUpdateRadiologist(radiologistId)
  const suspendRadiologist = useSuspendRadiologist()
  const activateRadiologist = useActivateRadiologist()

  const radiologist = radiologistResponse?.data
  const performance = performanceResponse?.data
  const studies = studiesResponse?.data || []
  const organizations = organizationsResponse?.data || []

  const handleToggleStatus = async () => {
    try {
      if (radiologist?.status === 'active') {
        await suspendRadiologist.mutateAsync(radiologistId)
      } else {
        await activateRadiologist.mutateAsync(radiologistId)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update radiologist status',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[600px]" />
      </div>
    )
  }

  if (!radiologist) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Radiologist not found</p>
        <Button
          variant="outline"
          onClick={() => router.push('/radiologists')}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Radiologists
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLicenseBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'expiring':
        return <Badge variant="warning">Expiring Soon</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/radiologists')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{radiologist.name}</h1>
              <p className="text-muted-foreground">{radiologist.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {radiologist.resumeUrl && (
            <ResumeViewer resumeUrl={radiologist.resumeUrl} />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/radiologists/${radiologistId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={suspendRadiologist.isPending || activateRadiologist.isPending}
          >
            {radiologist.status === 'active' ? (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Suspend
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(radiologist.status)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">License Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getLicenseBadge(radiologist.licenseStatus)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Studies Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{radiologist.studiesReviewed || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold">{radiologist.accuracyRate || 'N/A'}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="studies">Studies</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="mt-1">{radiologist.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${radiologist.email}`} className="text-sm text-blue-600 hover:underline">
                      {radiologist.email}
                    </a>
                  </div>
                </div>
                {radiologist.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{radiologist.phone}</span>
                    </div>
                  </div>
                )}
                {radiologist.location && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{radiologist.location}</span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{format(new Date(radiologist.created), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Specialties</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {radiologist.specialties?.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="mt-1">{radiologist.yearsOfExperience} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Availability</p>
                  <div className="flex items-center gap-2 mt-1">
                    {radiologist.isAvailable ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Unavailable</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{format(new Date(radiologist.lastActive), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Credentials</CardTitle>
              <CardDescription>License and certification information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {radiologist.credentials?.map((credential, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{credential.type}</h4>
                        <p className="text-sm text-muted-foreground">{credential.number}</p>
                        <p className="text-sm text-muted-foreground">Issued by: {credential.issuingBody}</p>
                      </div>
                      <Badge variant={credential.status === 'active' ? 'success' : 'destructive'}>
                        {credential.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Expires: </span>
                      <span>{format(new Date(credential.expiryDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Quality and efficiency indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {performance ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
                      <div className="mt-2">
                        <Progress value={performance.accuracyRate} className="h-2" />
                        <p className="text-2xl font-bold mt-2">{performance.accuracyRate}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average TAT</p>
                      <p className="text-2xl font-bold mt-2">{performance.averageTat} mins</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Studies/Day</p>
                      <p className="text-2xl font-bold mt-2">{performance.studiesPerDay}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No performance data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="studies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Studies</CardTitle>
              <CardDescription>Studies reviewed by this radiologist</CardDescription>
            </CardHeader>
            <CardContent>
              {studies.length > 0 ? (
                <div className="space-y-4">
                  {studies.slice(0, 10).map((study) => (
                    <div key={study.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{study.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {study.modality} • {study.bodyPart}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={study.status === 'completed' ? 'success' : 'secondary'}>
                          {study.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(study.completedAt), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No studies found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Associated Organizations</CardTitle>
              <CardDescription>Organizations this radiologist is credentialed with</CardDescription>
            </CardHeader>
            <CardContent>
              {organizations.length > 0 ? (
                <div className="space-y-4">
                  {organizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">{org.type}</p>
                        </div>
                      </div>
                      <Badge variant={org.credentialingStatus === 'active' ? 'success' : 'secondary'}>
                        {org.credentialingStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No associated organizations</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}