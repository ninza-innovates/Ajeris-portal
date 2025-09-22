'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  Download,
  Eye,
  MoreVertical
} from 'lucide-react'
import { useRadiologist, useRadiologistStudies } from '@/lib/api/hooks/use-radiologists'
import type { Radiologist } from '@/types/radiologist'

export default function RadiologistStudiesPage() {
  const params = useParams()
  const router = useRouter()
  const radiologistId = params.id as string
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModality, setFilterModality] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  // Fetch radiologist and studies data
  const { data: radiologist, isLoading: radiologistLoading } = useRadiologist(radiologistId)
  const { data: studiesData, isLoading: studiesLoading } = useRadiologistStudies(radiologistId)

  const studies = studiesData?.data || []

  if (radiologistLoading || studiesLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!radiologist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Radiologist Not Found</h1>
          <p className="mt-2 text-muted-foreground">The requested radiologist could not be found.</p>
          <Button className="mt-4" onClick={() => router.push('/radiologists')}>
            Go to Radiologists
          </Button>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'STAT': return 'bg-red-100 text-red-800'
      case 'URGENT': return 'bg-orange-100 text-orange-800'
      case 'ROUTINE': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getModalityColor = (modality: string) => {
    switch (modality?.toUpperCase()) {
      case 'CT': return 'bg-purple-100 text-purple-800'
      case 'MRI': return 'bg-green-100 text-green-800'
      case 'X-RAY': 
      case 'XRAY': return 'bg-yellow-100 text-yellow-800'
      case 'US': 
      case 'ULTRASOUND': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredStudies = studies.filter((study: any) => {
    const matchesSearch = searchTerm === '' || 
      study.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModality = filterModality === 'all' || study.modality === filterModality
    const matchesPriority = filterPriority === 'all' || study.priority === filterPriority
    
    // Tab filtering
    let matchesTab = true
    if (activeTab === 'recent') {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      matchesTab = new Date(study.studyDate || study.createdAt) > sevenDaysAgo
    } else if (activeTab === 'critical') {
      matchesTab = study.criticalFindings || study.hasCriticalFindings
    } else if (activeTab === 'amended') {
      matchesTab = study.isAmended || study.amendedAt
    }
    
    return matchesSearch && matchesModality && matchesPriority && matchesTab
  })

  const calculateAverageTAT = () => {
    if (filteredStudies.length === 0) return 0
    const totalTAT = filteredStudies.reduce((acc: number, s: any) => {
      const tat = s.tat || s.turnaroundTime || 0
      return acc + (typeof tat === 'number' ? tat : 0)
    }, 0)
    return Math.round(totalTAT / filteredStudies.length)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/radiologists/${radiologistId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Study History</h1>
            <p className="text-muted-foreground">
              {radiologist.name} - {radiologist.performance?.totalReads?.toLocaleString() || '0'} total studies
            </p>
          </div>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Studies
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Studies</TabsTrigger>
          <TabsTrigger value="recent">Recent (7 days)</TabsTrigger>
          <TabsTrigger value="critical">Critical Findings</TabsTrigger>
          <TabsTrigger value="amended">Amended Reports</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient name, ID, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterModality} onValueChange={setFilterModality}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Modality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modalities</SelectItem>
                    <SelectItem value="CT">CT</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="X-Ray">X-Ray</SelectItem>
                    <SelectItem value="US">Ultrasound</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="STAT">STAT</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Routine">Routine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Study Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Studies</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStudies.length}</div>
                <p className="text-xs text-muted-foreground">Filtered results</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average TAT</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateAverageTAT()}m</div>
                <p className="text-xs text-muted-foreground">For displayed studies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStudies.filter((s: any) => s.criticalFindings || s.hasCriticalFindings).length}
                </div>
                <p className="text-xs text-muted-foreground">Studies with critical findings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">STAT Studies</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStudies.filter((s: any) => s.priority?.toUpperCase() === 'STAT').length}
                </div>
                <p className="text-xs text-muted-foreground">Emergency cases</p>
              </CardContent>
            </Card>
          </div>

          {/* Study List */}
          <Card>
            <CardHeader>
              <CardTitle>Study List</CardTitle>
              <CardDescription>
                Showing {filteredStudies.length} studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredStudies.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>No studies found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredStudies.map((study: any) => (
                    <div key={study.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{study.description || study.studyDescription}</h4>
                            <Badge className={getPriorityColor(study.priority)}>
                              {study.priority}
                            </Badge>
                            <Badge className={getModalityColor(study.modality)}>
                              {study.modality}
                            </Badge>
                            {(study.criticalFindings || study.hasCriticalFindings) && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Critical
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Patient:</span>
                              <span>{study.patientName} ({study.patientId || study.mrn})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(study.studyDate || study.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>TAT: {study.tat || study.turnaroundTime || 0} minutes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>
                                {study.status === 'Completed' ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/studies/${study.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}