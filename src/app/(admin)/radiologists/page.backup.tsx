'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { mockRadiologists } from '@/lib/mock-data/radiologists'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Search,
  MoreVertical,
  Download,
  UserPlus,
  Filter,
  Users,
  UserCheck,
  Clock,
  FileText,
  Eye,
  Edit,
  Ban,
  Power,
  ClipboardList,
  History,
  Calendar,
  BarChart3,
  ArrowUpDown,
  ChevronDown,
  Phone,
  Mail,
  Star,
  Info,
} from 'lucide-react'
import { Radiologist } from '@/types/radiologist'
import {
  EditRadiologistDialog,
  ScheduleDialog,
  AssignStudiesDialog,
  AccountStatusDialog,
} from '@/components/dialogs/radiologist-dialogs'

type SortField = 'name' | 'availability' | 'studiesCompletedToday' | 'averageTAT' | 'accuracyRate' | 'qualityScore'
type SortOrder = 'asc' | 'desc'

export default function RadiologistsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [assignStudiesDialogOpen, setAssignStudiesDialogOpen] = useState(false)
  const [accountStatusDialogOpen, setAccountStatusDialogOpen] = useState(false)
  const [selectedRadiologist, setSelectedRadiologist] = useState<Radiologist | null>(null)

  // Get unique specialties for filter
  const allSpecialties = Array.from(
    new Set(mockRadiologists.flatMap(r => r.specialties))
  ).sort()

  // Filter and sort radiologists
  const filteredRadiologists = useMemo(() => {
    let filtered = mockRadiologists.filter(radiologist => {
      const matchesSearch = 
        radiologist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        radiologist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        radiologist.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesSpecialty = filterSpecialty === 'all' || 
        radiologist.specialties.includes(filterSpecialty)
      
      const matchesStatus = filterStatus === 'all' || 
        radiologist.status === filterStatus
      
      const matchesAvailability = filterAvailability === 'all' || 
        radiologist.availability.status === filterAvailability

      return matchesSearch && matchesSpecialty && matchesStatus && matchesAvailability
    })

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField as keyof Radiologist]
      let bVal: any = b[sortField as keyof Radiologist]
      
      // Handle nested fields
      if (sortField === 'studiesCompletedToday' || sortField === 'averageTAT' || sortField === 'accuracyRate') {
        aVal = a.performance[sortField as keyof typeof a.performance]
        bVal = b.performance[sortField as keyof typeof b.performance]
      } else if (sortField === 'availability') {
        aVal = a.availability.status
        bVal = b.availability.status
      }
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [searchQuery, filterSpecialty, filterStatus, filterAvailability, sortField, sortOrder])

  // Calculate stats
  const totalRadiologists = mockRadiologists.length
  const activeRadiologists = mockRadiologists.filter(r => 
    r.availability.status === 'Available' || r.availability.status === 'On Call'
  ).length
  const studiesCompletedToday = mockRadiologists.reduce((sum, r) => 
    sum + r.performance.studiesCompletedToday, 0
  )
  const averageTAT = mockRadiologists.reduce((sum, r) => 
    sum + r.performance.averageTAT, 0
  ) / mockRadiologists.length

  const stats = [
    {
      title: 'Total Radiologists',
      value: totalRadiologists.toString(),
      subtitle: 'Licensed professionals',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active/On-Call',
      value: activeRadiologists.toString(),
      subtitle: 'Currently available',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Studies Today',
      value: studiesCompletedToday.toString(),
      subtitle: 'Completed readings',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Average TAT',
      value: `${Math.round(averageTAT)} min`,
      subtitle: 'Turnaround time',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRadiologists.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredRadiologists.map(r => r.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const getAvailabilityBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Available': 'success',
      'On Call': 'info',
      'Busy': 'warning',
      'Off Duty': 'secondary',
      'On Leave': 'outline'
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Suspended': 'destructive',
      'On Leave': 'warning'
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expert Radiologists</h1>
          <p className="text-muted-foreground">
            Manage radiologist profiles, performance, and assignments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Radiologist
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
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
                placeholder="Search by name, email, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
            >
              <option value="all">All Specialties</option>
              {allSpecialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="On Leave">On Leave</option>
            </select>
            <select 
              className="px-3 py-2 border rounded-lg text-sm"
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
            >
              <option value="all">All Availability</option>
              <option value="Available">Available</option>
              <option value="On Call">On Call</option>
              <option value="Busy">Busy</option>
              <option value="Off Duty">Off Duty</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedIds.length} radiologist{selectedIds.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="bg-white">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Assign Studies
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Update Schedule
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button size="sm" variant="outline" className="bg-white" onClick={() => setSelectedIds([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Radiologists Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left w-10">
                    <Checkbox 
                      checked={selectedIds.length === filteredRadiologists.length && filteredRadiologists.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left">
                    <button 
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      Radiologist
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Specialties</th>
                  <th className="p-3 text-center">
                    <button 
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                      onClick={() => handleSort('availability')}
                    >
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Performance</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Workload</th>
                  <th className="p-3 text-center">
                    <button 
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                      onClick={() => handleSort('qualityScore')}
                    >
                      Quality
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">License</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Contact</th>
                  <th className="p-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRadiologists.map((radiologist) => (
                  <tr key={radiologist.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <Checkbox 
                        checked={selectedIds.includes(radiologist.id)}
                        onCheckedChange={() => toggleSelect(radiologist.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-600">
                            {radiologist.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{radiologist.name}, {radiologist.credentials.degree}</p>
                          <p className="text-sm text-gray-500">{radiologist.yearsOfExperience} years experience</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {radiologist.specialties.slice(0, 2).map((specialty, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {radiologist.specialties.length > 2 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-xs">
                                  +{radiologist.specialties.length - 2}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{radiologist.specialties.slice(2).join(', ')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col items-center gap-1">
                        {getAvailabilityBadge(radiologist.availability.status)}
                        {getStatusBadge(radiologist.status)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-center">
                                <p className="font-medium">{radiologist.performance.studiesCompletedToday}</p>
                                <p className="text-xs text-gray-500">Today</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Studies completed today</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-center">
                                <p className="font-medium">{radiologist.performance.averageTAT}m</p>
                                <p className="text-xs text-gray-500">TAT</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Average turnaround time</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-center">
                                <p className="font-medium">{radiologist.performance.accuracyRate}%</p>
                                <p className="text-xs text-gray-500">Accuracy</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Diagnostic accuracy rate</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-center">
                        <p className="font-medium">{radiologist.workload.currentQueue}</p>
                        <p className="text-xs text-gray-500">
                          {radiologist.workload.priorityStudies > 0 && (
                            <span className="text-orange-600">{radiologist.workload.priorityStudies} priority</span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{radiologist.qualityScore}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <p>{radiologist.credentials.licenseState}</p>
                        <p className="text-xs text-gray-500">Exp: {radiologist.credentials.licenseExpiry}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{radiologist.email}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{radiologist.phone}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/radiologists/${radiologist.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Detailed Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRadiologist(radiologist)
                            setEditDialogOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Information
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Reports & Analytics</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/radiologists/${radiologist.id}/performance`)}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Performance Reports
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/radiologists/${radiologist.id}/studies`)}>
                            <History className="mr-2 h-4 w-4" />
                            View Study History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Management</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRadiologist(radiologist)
                            setScheduleDialogOpen(true)
                          }}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Manage Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRadiologist(radiologist)
                            setAssignStudiesDialogOpen(true)
                          }}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Assign Studies
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {radiologist.status === 'Active' ? (
                            <DropdownMenuItem 
                              className="text-orange-600"
                              onClick={() => {
                                setSelectedRadiologist(radiologist)
                                setAccountStatusDialogOpen(true)
                              }}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => {
                                setSelectedRadiologist(radiologist)
                                setAccountStatusDialogOpen(true)
                              }}
                            >
                              <Power className="mr-2 h-4 w-4" />
                              Activate Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRadiologists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No radiologists found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedRadiologist && (
        <>
          <EditRadiologistDialog
            radiologist={selectedRadiologist}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <ScheduleDialog
            radiologist={selectedRadiologist}
            open={scheduleDialogOpen}
            onOpenChange={setScheduleDialogOpen}
          />
          <AssignStudiesDialog
            radiologist={selectedRadiologist}
            open={assignStudiesDialogOpen}
            onOpenChange={setAssignStudiesDialogOpen}
          />
          <AccountStatusDialog
            radiologist={selectedRadiologist}
            open={accountStatusDialogOpen}
            onOpenChange={setAccountStatusDialogOpen}
          />
        </>
      )}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}