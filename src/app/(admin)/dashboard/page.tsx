'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Users, FileText, Building, TrendingUp, AlertCircle, RefreshCw, Loader2 } from 'lucide-react'
import { useDashboardStats } from '@/lib/api/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { DashboardStats } from '@/lib/api/types'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { data, isLoading, error, refetch, isRefetching } = useDashboardStats()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {error.message || 'Unknown error'}
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  // Extract stats from API response
  const statsData = data?.data as DashboardStats || {} as DashboardStats
  
  const stats = [
    {
      title: 'Total Studies',
      value: statsData.totalStudies?.toLocaleString() || '0',
      change: statsData.studiesChangePercent || '+0%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Radiologists',
      value: statsData.activeRadiologists?.toString() || '0',
      change: statsData.radiologistsChangePercent || '+0%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Reports',
      value: statsData.pendingReports?.toString() || '0',
      change: statsData.reportsChangePercent || '+0%',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Critical Findings',
      value: statsData.criticalFindings?.toString() || '0',
      change: statsData.criticalChangePercent || '+0%',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  // Process recent activity
  const recentActivities = statsData.recentActivity || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm"
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={cn(stat.bgColor, 'p-2 rounded-md')}>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity: any, index: number) => (
                <div key={activity.id || index} className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-md">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message || activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.details || activity.description}</p>
                    <p className="text-xs text-gray-400">
                      {activity.timestamp 
                        ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                        : activity.time || 'Recently'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-2 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'user':
      return <Users className="h-4 w-4 text-gray-600" />
    case 'study':
      return <FileText className="h-4 w-4 text-gray-600" />
    case 'organization':
      return <Building className="h-4 w-4 text-gray-600" />
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-gray-600" />
    default:
      return <Activity className="h-4 w-4 text-gray-600" />
  }
}