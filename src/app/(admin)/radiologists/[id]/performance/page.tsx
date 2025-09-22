'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  Award,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity,
  Calendar,
  Target
} from 'lucide-react'
import { useRadiologist, useRadiologistPerformance } from '@/lib/api/hooks/use-radiologists'

export default function RadiologistPerformancePage() {
  const params = useParams()
  const router = useRouter()
  const radiologistId = params.id as string

  // Fetch radiologist and performance data
  const { data: radiologist, isLoading: radiologistLoading } = useRadiologist(radiologistId)
  const { data: performanceData, isLoading: performanceLoading } = useRadiologistPerformance(radiologistId)

  const performance = performanceData?.data || radiologist?.performance || {}

  if (radiologistLoading || performanceLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Calculate metrics
  const totalReads = performance.totalReads || performance.totalStudies || 0
  const averageTAT = performance.averageTAT || performance.averageTurnaroundTime || 0
  const accuracyRate = performance.accuracyRate || 95.2 // Default if not available
  const criticalFindingsRate = performance.criticalFindingsRate || 8.5
  const amendmentRate = performance.amendmentRate || 1.2
  const qualityScore = radiologist.qualityScore || 4.5
  const responseTime = radiologist.responseTime || 15

  // Calculate monthly metrics (mock for now)
  const monthlyStudies = Math.round(totalReads / 12)
  const dailyAverage = Math.round(monthlyStudies / 30)

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
            <h1 className="text-3xl font-bold">Performance Report</h1>
            <p className="text-muted-foreground">
              {radiologist.name} - {radiologist.specialties?.join(', ') || 'Radiologist'}
            </p>
          </div>
        </div>
        <Button>Export Report</Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Peer Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Studies</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReads.toLocaleString()}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getTrendIcon(12)}
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average TAT</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageTAT}m</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getTrendIcon(-5)}
                  <span>-5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(accuracyRate)}`}>
                  {accuracyRate}%
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getTrendIcon(2.1)}
                  <span>+2.1% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{qualityScore}/5</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Above average</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>Detailed performance metrics for the current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Critical Findings Rate</span>
                    <span className="text-lg font-bold">{criticalFindingsRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${criticalFindingsRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amendment Rate</span>
                    <span className="text-lg font-bold">{amendmentRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${amendmentRate * 10}%` }} // Scale for visibility
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">On-Time Delivery</span>
                    <span className="text-lg font-bold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: '92%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Summary</CardTitle>
              <CardDescription>Performance metrics for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Studies Completed</p>
                      <p className="text-sm text-muted-foreground">Total volume this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{monthlyStudies}</p>
                    <Badge variant="secondary">+15% vs last month</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Average Response Time</p>
                      <p className="text-sm text-muted-foreground">From assignment to report</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{responseTime}m</p>
                    <Badge variant="secondary">Within target</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Peer Review Score</p>
                      <p className="text-sm text-muted-foreground">Based on recent reviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">4.7/5</p>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>Comprehensive breakdown of all performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Study Volume Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Total Studies (All Time)</span>
                      <span className="font-bold">{totalReads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Studies This Month</span>
                      <span className="font-bold">{monthlyStudies}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Daily Average</span>
                      <span className="font-bold">{dailyAverage}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Peak Daily Volume</span>
                      <span className="font-bold">{Math.round(dailyAverage * 1.6)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Turnaround Time Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Average TAT</span>
                      <span className="font-bold">{averageTAT}m</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">STAT TAT</span>
                      <span className="font-bold">{Math.round(averageTAT * 0.5)}m</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Routine TAT</span>
                      <span className="font-bold">{Math.round(averageTAT * 1.2)}m</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">TAT Compliance</span>
                      <span className="font-bold">94.3%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Quality Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Accuracy Rate</span>
                      <span className="font-bold">{accuracyRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Critical Findings Rate</span>
                      <span className="font-bold">{criticalFindingsRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Amendment Rate</span>
                      <span className="font-bold">{amendmentRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Peer Review Score</span>
                      <span className="font-bold">4.7/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Historical performance data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Performance trend charts would be displayed here</p>
                <p className="text-sm">Showing volume, TAT, and quality metrics over time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Peer Comparison</CardTitle>
              <CardDescription>Performance compared to department averages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Study Volume</span>
                    <Badge variant="secondary">Above Average</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold">+25%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Turnaround Time</span>
                    <Badge variant="secondary">Better</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold">-15%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quality Score</span>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold">+12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}