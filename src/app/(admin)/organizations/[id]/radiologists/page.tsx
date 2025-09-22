'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOrganization, useOrganizationRadiologists, useAssignRadiologists, useRemoveRadiologist, useUpdateRadiologistCredentialing, useRenewCredentialing } from '@/lib/api/hooks'
import { useRadiologists } from '@/lib/api/hooks/use-radiologists'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import {
  ArrowLeft,
  UserPlus,
  MoreVertical,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
  Search,
  Trash2,
  Edit,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { RadiologistOrganization, CredentialingStatus, ModioHealthStatus } from '@/lib/api/types'

export default function OrganizationRadiologistsPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = params.id as string

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRadiologist, setSelectedRadiologist] = useState<RadiologistOrganization | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRadiologistIds, setSelectedRadiologistIds] = useState<string[]>([])

  // API hooks
  const { data: orgResponse, isLoading: isLoadingOrg } = useOrganization(organizationId)
  const { data: radiologistsResponse, isLoading: isLoadingRadiologists } = useOrganizationRadiologists(organizationId)
  const { data: allRadiologistsResponse } = useRadiologists({ limit: 100 })
  const assignRadiologists = useAssignRadiologists(organizationId)
  const removeRadiologist = useRemoveRadiologist(organizationId)
  const updateCredentialing = useUpdateRadiologistCredentialing(organizationId)
  const renewCredentialing = useRenewCredentialing(organizationId)

  const organization = orgResponse?.data
  const assignedRadiologists = radiologistsResponse?.data || []
  const allRadiologists = allRadiologistsResponse?.data || []

  // Filter available radiologists (not already assigned)
  const assignedIds = assignedRadiologists.map(r => r.radiologistId)
  const availableRadiologists = allRadiologists.filter(r => !assignedIds.includes(r.id))
  const filteredAvailable = availableRadiologists.filter(r => 
    r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAssignRadiologists = async () => {
    if (selectedRadiologistIds.length === 0) {
      toast({
        title: 'No radiologists selected',
        description: 'Please select at least one radiologist to assign.',
        variant: 'destructive',
      })
      return
    }

    try {
      await assignRadiologists.mutateAsync({
        radiologistIds: selectedRadiologistIds,
        assignments: selectedRadiologistIds.map(id => ({
          radiologistId: id,
          privileges: ['read_studies', 'report_studies'],
        })),
      })
      toast({
        title: 'Radiologists assigned',
        description: `${selectedRadiologistIds.length} radiologist(s) assigned successfully.`,
      })
      setIsAssignDialogOpen(false)
      setSelectedRadiologistIds([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign radiologists',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveRadiologist = async () => {
    if (!selectedRadiologist) return

    try {
      await removeRadiologist.mutateAsync(selectedRadiologist.radiologistId)
      toast({
        title: 'Radiologist removed',
        description: 'Radiologist has been removed from this organization.',
      })
      setIsDeleteDialogOpen(false)
      setSelectedRadiologist(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove radiologist',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateCredentialing = async (data: {
    credentialingStatus?: CredentialingStatus
    modioHealthStatus?: ModioHealthStatus
    notes?: string
  }) => {
    if (!selectedRadiologist) return

    try {
      await updateCredentialing.mutateAsync({
        radiologistId: selectedRadiologist.radiologistId,
        ...data,
      })
      toast({
        title: 'Credentialing updated',
        description: 'Credentialing information has been updated.',
      })
      setIsEditDialogOpen(false)
      setSelectedRadiologist(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update credentialing',
        variant: 'destructive',
      })
    }
  }

  const handleRenewCredentialing = async (radiologistId: string) => {
    try {
      await renewCredentialing.mutateAsync(radiologistId)
      toast({
        title: 'Renewal initiated',
        description: 'Credentialing renewal process has been started.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate renewal',
        variant: 'destructive',
      })
    }
  }

  const getCredentialingBadge = (status: CredentialingStatus) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success">Approved</Badge>
      case 'In Progress':
        return <Badge variant="warning">In Progress</Badge>
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'Expired':
        return <Badge variant="destructive">Expired</Badge>
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getModioHealthBadge = (status: ModioHealthStatus) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success">Verified</Badge>
      case 'Submitted':
        return <Badge variant="warning">Submitted</Badge>
      case 'Issues Found':
        return <Badge variant="destructive">Issues Found</Badge>
      case 'Not Started':
        return <Badge variant="secondary">Not Started</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoadingOrg || isLoadingRadiologists) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/organizations/${organizationId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Radiologist Management</h1>
            <p className="text-muted-foreground">{organization?.name}</p>
          </div>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Radiologists
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{assignedRadiologists.length}</p>
            <p className="text-xs text-muted-foreground">Total Radiologists</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {assignedRadiologists.filter(r => r.credentialingStatus === 'Approved').length}
            </p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {assignedRadiologists.filter(r => r.credentialingStatus === 'In Progress').length}
            </p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {assignedRadiologists.filter(r => r.credentialingStatus === 'Expired').length}
            </p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Radiologists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Radiologists</CardTitle>
          <CardDescription>
            Manage radiologist credentialing and permissions for this organization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Radiologist</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Credentialing</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">ModioHealth</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Assigned Date</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Expiry Date</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Requested By</th>
                  <th className="p-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignedRadiologists.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No radiologists assigned to this organization
                    </td>
                  </tr>
                ) : (
                  assignedRadiologists.map((radiologist) => (
                    <tr key={radiologist.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{radiologist.radiologistName}</p>
                          <p className="text-sm text-gray-500">ID: {radiologist.radiologistId}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        {getCredentialingBadge(radiologist.credentialingStatus)}
                      </td>
                      <td className="p-3">
                        {getModioHealthBadge(radiologist.modioHealthStatus)}
                      </td>
                      <td className="p-3">
                        <p className="text-sm">
                          {format(new Date(radiologist.assignedDate), 'MMM d, yyyy')}
                        </p>
                      </td>
                      <td className="p-3">
                        {radiologist.expiryDate ? (
                          <p className="text-sm">
                            {format(new Date(radiologist.expiryDate), 'MMM d, yyyy')}
                          </p>
                        ) : (
                          <span className="text-sm text-gray-500">Not set</span>
                        )}
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{radiologist.requestedBy}</p>
                      </td>
                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRadiologist(radiologist)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Update Credentialing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/radiologists/${radiologist.radiologistId}`)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            {radiologist.credentialingStatus === 'Expired' && (
                              <DropdownMenuItem
                                onClick={() => handleRenewCredentialing(radiologist.radiologistId)}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renew Credentialing
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedRadiologist(radiologist)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from Organization
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Assign Radiologists Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Radiologists</DialogTitle>
            <DialogDescription>
              Select radiologists to assign to {organization?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search radiologists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-2">
              {filteredAvailable.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No available radiologists found
                </p>
              ) : (
                filteredAvailable.map((radiologist) => (
                  <div
                    key={radiologist.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <Checkbox
                      checked={selectedRadiologistIds.includes(radiologist.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRadiologistIds([...selectedRadiologistIds, radiologist.id])
                        } else {
                          setSelectedRadiologistIds(selectedRadiologistIds.filter(id => id !== radiologist.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        Dr. {radiologist.firstName} {radiologist.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{radiologist.specialties.join(', ')}</p>
                    </div>
                    <Badge variant={radiologist.status === 'active' ? 'success' : 'secondary'}>
                      {radiologist.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignRadiologists}
              disabled={selectedRadiologistIds.length === 0 || assignRadiologists.isPending}
            >
              {assignRadiologists.isPending ? 'Assigning...' : `Assign ${selectedRadiologistIds.length} Radiologist(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Credentialing Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Credentialing</DialogTitle>
            <DialogDescription>
              Update credentialing information for {selectedRadiologist?.radiologistName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Credentialing Status</label>
              <Select
                defaultValue={selectedRadiologist?.credentialingStatus}
                onValueChange={(value) => {
                  // Will be used in form submission
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">ModioHealth Status</label>
              <Select
                defaultValue={selectedRadiologist?.modioHealthStatus}
                onValueChange={(value) => {
                  // Will be used in form submission
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Issues Found">Issues Found</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                className="mt-1"
                placeholder="Add any notes about this credentialing..."
                defaultValue={selectedRadiologist?.notes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Get form values and submit
                handleUpdateCredentialing({
                  credentialingStatus: 'In Progress', // Get from form
                  modioHealthStatus: 'Submitted', // Get from form
                  notes: 'Updated via admin portal', // Get from form
                })
              }}
              disabled={updateCredentialing.isPending}
            >
              {updateCredentialing.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Radiologist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedRadiologist?.radiologistName} from {organization?.name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRadiologist(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveRadiologist}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}