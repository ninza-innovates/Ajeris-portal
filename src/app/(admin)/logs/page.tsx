'use client'

import { useState } from 'react'
import { useAuditLogs, useExportAuditLogs } from '@/lib/api/hooks/use-compliance'
import { useSystemHealth } from '@/hooks/use-settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  User,
  Shield,
  Activity,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function SystemLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  
  // Fetch audit logs with filters
  const { data: logsData, isLoading: logsLoading } = useAuditLogs({
    startDate: dateRange.from,
    endDate: dateRange.to,
    category: filterType !== 'all' ? filterType : undefined,
    page,
    limit: 20,
  })
  
  // System health for stats
  const { data: systemHealth } = useSystemHealth()
  
  // Export mutation
  const exportLogs = useExportAuditLogs()
  
  const handleExport = () => {
    exportLogs.mutate({
      format: 'csv',
      filters: {
        startDate: dateRange.from,
        endDate: dateRange.to,
        category: filterType !== 'all' ? filterType : undefined,
      },
    })
  }
  
  // Filter logs based on search and level
  const filteredLogs = logsData?.data?.filter((log) => {
    const matchesSearch = !searchQuery || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLevel = filterLevel === 'all' || 
      getLogLevel(log.action) === filterLevel
    
    return matchesSearch && matchesLevel
  }) || []
  
  // Helper function to determine log level from action
  const getLogLevel = (action: string): string => {
    if (action.toLowerCase().includes('error') || action.toLowerCase().includes('failed')) {
      return 'ERROR'
    } else if (action.toLowerCase().includes('warning') || action.toLowerCase().includes('attempt')) {
      return 'WARNING'
    } else {
      return 'INFO'
    }
  }
  
  // Helper function to get icon based on resource type
  const getLogIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'auth':
      case 'authentication':
        return Shield
      case 'study':
        return Activity
      case 'user':
        return User
      case 'system':
        return Info
      default:
        return ScrollText
    }
  }
  
  const stats = [
    {
      title: 'Total Events Today',
      value: systemHealth?.metrics?.requestsPerMinute 
        ? (systemHealth.metrics.requestsPerMinute * 60 * 24).toLocaleString()
        : '0',
      icon: ScrollText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Error Events',
      value: filteredLogs.filter(log => getLogLevel(log.action) === 'ERROR').length.toString(),
      subtitle: `${((filteredLogs.filter(log => getLogLevel(log.action) === 'ERROR').length / filteredLogs.length) * 100).toFixed(1)}% of total`,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Security Events',
      value: filteredLogs.filter(log => log.resource.toLowerCase().includes('auth')).length.toString(),
      subtitle: 'Auth & access',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Users',
      value: systemHealth?.metrics?.activeUsers?.toString() || '0',
      subtitle: 'Currently online',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]
  
  const getLevelBadge = (level: string) => {
    const variants: Record<string, any> = {
      'INFO': 'info',
      'WARNING': 'warning',
      'ERROR': 'destructive',
      'DEBUG': 'secondary'
    }
    return <Badge variant={variants[level] || 'secondary'}>{level}</Badge>
  }
  
  const getTypeBadge = (type: string) => {
    return <Badge variant="outline">{type}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor system events and audit trails
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={exportLogs.isPending}
          >
            {exportLogs.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Logs
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd')} - {format(dateRange.to, 'LLL dd')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  'Pick a date'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn(stat.bgColor, 'p-2 rounded-md')}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="AUTH">Authentication</option>
              <option value="STUDY">Study</option>
              <option value="USER">User</option>
              <option value="BILLING">Billing</option>
              <option value="SYSTEM">System</option>
              <option value="ERROR">Error</option>
              <option value="COMPLIANCE">Compliance</option>
            </select>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="DEBUG">Debug</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No logs found matching your filters
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {filteredLogs.map((log) => {
                  const level = getLogLevel(log.action)
                  const Icon = getLogIcon(log.resource)
                  
                  return (
                    <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className={cn(
                        'p-2 rounded-md',
                        level === 'ERROR' ? 'bg-red-100' :
                        level === 'WARNING' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      )}>
                        <Icon className={cn(
                          'h-4 w-4',
                          level === 'ERROR' ? 'text-red-600' :
                          level === 'WARNING' ? 'text-yellow-600' :
                          'text-gray-600'
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          {getTypeBadge(log.resource)}
                          {getLevelBadge(level)}
                          <span className="text-sm text-gray-600">• {log.userName}</span>
                        </div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-sm text-gray-600">
                          {log.resourceId && `Resource ID: ${log.resourceId}`}
                          {log.ipAddress && ` • IP: ${log.ipAddress}`}
                        </p>
                        {log.details && (
                          <p className="text-sm text-gray-500 mt-1">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, logsData?.meta?.total || 0)} of {logsData?.meta?.total || 0} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!logsData?.meta?.hasMore}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}