'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUser, useUserLoginHistory } from '@/lib/api/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Download,
  Filter,
  Calendar
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

interface LoginHistory {
  id: string
  timestamp: string
  status: 'success' | 'failed' | 'blocked'
  ipAddress: string
  location: string
  device: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  sessionDuration?: string
  failureReason?: string
}

export default function LoginHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  // Fetch user and login history
  const { data: user, isLoading: userLoading } = useUser(userId)
  const { data: loginHistoryData, isLoading: historyLoading } = useUserLoginHistory(userId)

  // Transform API data to match our interface
  const loginHistory: LoginHistory[] = loginHistoryData?.data?.map((entry: any) => ({
    id: entry.id,
    timestamp: new Date(entry.timestamp).toLocaleString(),
    status: entry.success ? 'success' : entry.blocked ? 'blocked' : 'failed',
    ipAddress: entry.ipAddress || 'Unknown',
    location: entry.location || 'Unknown Location',
    device: entry.userAgent || 'Unknown Device',
    deviceType: entry.deviceType || 'desktop',
    browser: entry.browser || 'Unknown',
    os: entry.os || 'Unknown',
    sessionDuration: entry.sessionDuration,
    failureReason: entry.failureReason
  })) || []

  if (userLoading || historyLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
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

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return Monitor
      case 'mobile': return Smartphone
      case 'tablet': return Tablet
      default: return Monitor
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle
      case 'failed': return XCircle
      case 'blocked': return AlertCircle
      default: return AlertCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'blocked': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const successfulLogins = loginHistory.filter(l => l.status === 'success').length
  const failedLogins = loginHistory.filter(l => l.status === 'failed').length
  const blockedLogins = loginHistory.filter(l => l.status === 'blocked').length
  const uniqueLocations = new Set(loginHistory.map(l => l.location)).size

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Login History</h1>
            <p className="text-muted-foreground">{user.name} - {user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.loginCount || loginHistory.length}</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulLogins}</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Failed/Blocked</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedLogins + blockedLogins}</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueLocations}</div>
            <p className="text-xs text-gray-500">Unique locations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Login Attempts</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="w-40"
                placeholder="Start date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                className="w-40"
                placeholder="End date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Timestamp</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">IP Address</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Device</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Browser & OS</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No login history available
                    </td>
                  </tr>
                ) : (
                  loginHistory.map((login) => {
                    const StatusIcon = getStatusIcon(login.status)
                    const DeviceIcon = getDeviceIcon(login.deviceType)
                    const statusColor = getStatusColor(login.status)
                    
                    return (
                      <tr key={login.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm">{login.timestamp}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                            <span className={`text-sm font-medium ${statusColor}`}>
                              {login.status.charAt(0).toUpperCase() + login.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-sm font-mono text-gray-600">{login.ipAddress}</td>
                        <td className="p-3 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {login.location}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{login.device}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {login.browser} / {login.os}
                        </td>
                        <td className="p-3 text-sm">
                          {login.sessionDuration ? (
                            <Badge variant="secondary">{login.sessionDuration}</Badge>
                          ) : login.failureReason ? (
                            <span className="text-xs text-red-600">{login.failureReason}</span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {(failedLogins > 0 || blockedLogins > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Security Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              This user has {failedLogins} failed login attempts and {blockedLogins} blocked attempts in the last 30 days.
              {user.accountLocked && ' The account is currently locked due to multiple failed attempts.'}
            </p>
            {!user.twoFactorEnabled && (
              <p className="text-sm text-orange-700 mt-2">
                Two-factor authentication is not enabled for this account. Consider enabling it for better security.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}