'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUser, useUserActivity } from '@/lib/api/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  AlertCircle,
  FileText,
  Download,
  Edit,
  Shield,
  Mail,
  Key,
  UserCheck,
  Building,
  Clock,
  Filter,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

interface ActivityLog {
  id: string
  timestamp: string
  action: string
  category: 'account' | 'security' | 'study' | 'admin'
  details: string
  ipAddress?: string
  userAgent?: string
  performedBy?: string
}

export default function UserActivityPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch user and activity data
  const { data: user, isLoading: userLoading } = useUser(userId)
  const { data: activityData, isLoading: activityLoading } = useUserActivity(userId)

  // Transform API data to match our interface
  const activities: ActivityLog[] = activityData?.data?.map((entry: any) => ({
    id: entry.id,
    timestamp: new Date(entry.timestamp).toLocaleString(),
    action: entry.action,
    category: entry.category || 'account',
    details: entry.details || entry.description || '',
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
    performedBy: entry.performedBy || entry.performedByName
  })) || []

  // Filter activities based on search
  const filteredActivities = activities.filter(activity => 
    searchQuery === '' ||
    activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.details.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (userLoading || activityLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Button onClick={() => router.back()} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">User Not Found</h2>
            <p className="text-gray-500 mt-2">The requested user could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'account': return UserCheck
      case 'security': return Shield
      case 'study': return FileText
      case 'admin': return Building
      default: return Clock
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'account': return 'text-blue-600 bg-blue-100'
      case 'security': return 'text-purple-600 bg-purple-100'
      case 'study': return 'text-green-600 bg-green-100'
      case 'admin': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Calculate activity stats
  const accountActivities = activities.filter(a => a.category === 'account').length
  const securityActivities = activities.filter(a => a.category === 'security').length
  const studyActivities = activities.filter(a => a.category === 'study').length
  const adminActivities = activities.filter(a => a.category === 'admin').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
            <p className="text-muted-foreground">{user.name} - {user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Log
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{accountActivities}</div>
              <div className="text-sm text-gray-500">Account Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{securityActivities}</div>
              <div className="text-sm text-gray-500">Security Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{studyActivities}</div>
              <div className="text-sm text-gray-500">Study Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{adminActivities}</div>
              <div className="text-sm text-gray-500">Admin Actions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredActivities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchQuery ? 'No activities found matching your search' : 'No activity recorded yet'}
              </div>
            ) : (
              filteredActivities.map((activity) => {
                const Icon = getCategoryIcon(activity.category)
                const colorClass = getCategoryColor(activity.category)
                
                return (
                  <div key={activity.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{activity.action}</h4>
                            <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                            {activity.performedBy && (
                              <p className="text-xs text-gray-500 mt-1">
                                Performed by: {activity.performedBy}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{activity.timestamp}</div>
                            {activity.ipAddress && (
                              <div className="text-xs text-gray-400 mt-1">IP: {activity.ipAddress}</div>
                            )}
                          </div>
                        </div>
                        {activity.userAgent && (
                          <div className="text-xs text-gray-400 mt-2">
                            Device: {activity.userAgent}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}