'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOrganizations } from '@/lib/api/hooks/use-organizations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Calendar,
  Building,
  Users,
  Cable,
  FileCheck,
  Rocket,
  ArrowRight,
  Filter,
} from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  // Fetch organizations from API
  const { data: organizationsData, isLoading } = useOrganizations()
  const organizations = organizationsData?.data || []
  
  // Filter organizations that have onboarding status (not live)
  const onboardingOrgs = organizations.filter(org => 
    org.status !== 'active' || org.contractStatus !== 'Active'
  )
  
  const filteredOrgs = filterStatus === 'all' 
    ? onboardingOrgs 
    : onboardingOrgs.filter(org => {
        // Map organization status to onboarding status
        const onboardingStatus = getOnboardingStatus(org)
        return onboardingStatus === filterStatus
      })
  
  // Helper function to derive onboarding status from organization data
  function getOnboardingStatus(org: any) {
    if (org.status === 'suspended') return 'suspended'
    if (org.status === 'active' && org.contractStatus === 'Active') return 'live'
    if (org.status === 'pending') return 'pending'
    if (org.contractStatus === 'Pending') return 'credentialing'
    if (org.hl7InterfaceEnabled === false) return 'technical-setup'
    return 'testing'
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 20
      case 'credentialing': return 40
      case 'technical-setup': return 60
      case 'testing': return 80
      case 'live': return 100
      case 'suspended': return 0
      default: return 0
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-500'
      case 'credentialing': return 'text-yellow-500'
      case 'technical-setup': return 'text-blue-500'
      case 'testing': return 'text-orange-500'
      case 'live': return 'text-green-500'
      case 'suspended': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'pending': 'secondary',
      'credentialing': 'warning',
      'technical-setup': 'info',
      'testing': 'warning',
      'live': 'success',
      'suspended': 'destructive'
    }
    return <Badge variant={variants[status]}>{status.replace('-', ' ').toUpperCase()}</Badge>
  }

  const stats = [
    {
      title: 'Active Onboardings',
      value: onboardingOrgs.filter(org => {
        const status = getOnboardingStatus(org)
        return status !== 'live' && status !== 'suspended'
      }).length,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'In Credentialing',
      value: onboardingOrgs.filter(org => getOnboardingStatus(org) === 'credentialing').length,
      icon: FileCheck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Testing Phase',
      value: onboardingOrgs.filter(org => getOnboardingStatus(org) === 'testing').length,
      icon: Cable,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Live Organizations',
      value: onboardingOrgs.filter(org => getOnboardingStatus(org) === 'live').length,
      icon: Rocket,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hospital Onboarding</h1>
          <p className="text-muted-foreground">
            Track and manage the onboarding process for new organizations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="credentialing">Credentialing</SelectItem>
              <SelectItem value="technical-setup">Technical Setup</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-md`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Timeline Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Onboarding Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="font-medium text-sm">Day 0</div>
              <div className="text-xs text-muted-foreground">Contract Signed</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">Days 1-5</div>
              <div className="text-xs text-muted-foreground">Credentialing</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">Days 3-7</div>
              <div className="text-xs text-muted-foreground">Technical Setup</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">Days 7-8</div>
              <div className="text-xs text-muted-foreground">Testing</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">Day 10+</div>
              <div className="text-xs text-muted-foreground">Go Live</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Organizations */}
      <Card>
        <CardHeader>
          <CardTitle>Organizations in Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {isLoading ? (
              <div className="p-8">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              </div>
            ) : filteredOrgs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No organizations match the selected filter
              </div>
            ) : (
              filteredOrgs.map((org) => {
                const onboardingStatus = getOnboardingStatus(org)
                const progress = getProgressPercentage(onboardingStatus)
                const daysInOnboarding = org.createdAt 
                  ? Math.floor((new Date().getTime() - new Date(org.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                  : 0

                return (
                  <div key={org.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{org.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {org.type} • {org.city}, {org.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(onboardingStatus)}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/organizations/${org.id}`)}
                        >
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle className={`h-5 w-5 ${progress >= 20 ? 'text-green-500' : 'text-gray-300'}`} />
                          <span className="text-xs text-center">Contract</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {progress >= 40 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : progress >= 20 ? (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                          <span className="text-xs text-center">Credentialing</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {progress >= 60 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : progress >= 40 ? (
                            <Clock className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                          <span className="text-xs text-center">Technical</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {progress >= 80 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : progress >= 60 ? (
                            <Clock className="h-5 w-5 text-orange-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                          <span className="text-xs text-center">Testing</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {progress >= 100 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                          <span className="text-xs text-center">Live</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mt-4">
                        <div className="flex items-center gap-4">
                          {org.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Started {new Date(org.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <span className="text-muted-foreground">
                            Day {daysInOnboarding} of onboarding
                          </span>
                        </div>
                        {onboardingStatus === 'testing' && org.updatedAt && (
                          <div className="flex items-center gap-1">
                            <Cable className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Last updated: {new Date(org.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Items */}
                      {onboardingStatus === 'credentialing' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-yellow-900">Action Required</p>
                              <p className="text-yellow-700">Waiting for ModioHealth verification</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {onboardingStatus === 'technical-setup' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-900">Next Steps</p>
                              <p className="text-blue-700">Configure HL7 interface and test PACS connection</p>
                            </div>
                          </div>
                        </div>
                      )}
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