'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Organization } from '@/types/organization'
import { Building, User, Mail, Phone, MapPin, AlertTriangle, FileText, DollarSign } from 'lucide-react'

interface EditOrganizationDialogProps {
  organization: Organization
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditOrganizationDialog({ organization, open, onOpenChange }: EditOrganizationDialogProps) {
  const [formData, setFormData] = useState({
    name: organization.name,
    contactName: organization.contact.name,
    contactEmail: organization.contact.email,
    contactPhone: organization.contact.phone,
    street: organization.address.street,
    city: organization.address.city,
    state: organization.address.state,
    zip: organization.address.zip,
  })

  const handleSave = () => {
    console.log('Saving organization data:', formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Update the organization&apos;s information
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input
                  id="contact-name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input
                id="contact-phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Address</h4>
            <div className="grid gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface AddUserDialogProps {
  organization: Organization
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ organization, open, onOpenChange }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Physician',
    department: '',
  })

  const handleAdd = () => {
    console.log('Adding user to organization:', organization.name, formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User to {organization.name}</DialogTitle>
          <DialogDescription>
            Create a new user account for this organization
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Physician">Physician</option>
              <option value="Technician">Technician</option>
              <option value="Administrator">Administrator</option>
              <option value="Nurse">Nurse</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g., Radiology, Emergency"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ContractDialogProps {
  organization: Organization
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContractDialog({ organization, open, onOpenChange }: ContractDialogProps) {
  const [contractData, setContractData] = useState({
    status: organization.contractStatus,
    startDate: '2024-01-01',
    endDate: organization.contractExpiry || '2025-01-01',
    monthlyFee: '5000',
    studyRate: '25',
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contract Management - {organization.name}</DialogTitle>
          <DialogDescription>
            View and manage contract details
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contract Status</Label>
              <Badge variant={organization.contractStatus === 'Active' ? 'success' : 'secondary'}>
                {organization.contractStatus}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Contract ID</Label>
              <p className="text-sm font-mono">CTR-{organization.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={contractData.startDate}
                onChange={(e) => setContractData({ ...contractData, startDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={contractData.endDate}
                onChange={(e) => setContractData({ ...contractData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Pricing Structure</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="monthly-fee">Monthly Base Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="monthly-fee"
                    type="number"
                    value={contractData.monthlyFee}
                    onChange={(e) => setContractData({ ...contractData, monthlyFee: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="study-rate">Per Study Rate</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="study-rate"
                    type="number"
                    value={contractData.studyRate}
                    onChange={(e) => setContractData({ ...contractData, studyRate: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium">Contract Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Studies This Month:</span>
                <span className="font-medium">{organization.monthlyVolume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Monthly Revenue:</span>
                <span className="font-medium">
                  ${(parseInt(contractData.monthlyFee) + (organization.monthlyVolume * parseInt(contractData.studyRate))).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button>Update Contract</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ReportDialogProps {
  organization: Organization
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDialog({ organization, open, onOpenChange }: ReportDialogProps) {
  const [reportType, setReportType] = useState('usage')
  const [dateRange, setDateRange] = useState('last30days')

  const handleGenerate = () => {
    console.log('Generating report:', { organization: organization.name, reportType, dateRange })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Generate reports for {organization.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="report-type">Report Type</Label>
            <select
              id="report-type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="usage">Usage Summary</option>
              <option value="billing">Billing Statement</option>
              <option value="performance">Performance Metrics</option>
              <option value="compliance">Compliance Report</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date-range">Date Range</Label>
            <select
              id="date-range"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="yeartodate">Year to Date</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Report Preview
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Organization: {organization.name}</p>
              <p>• Type: {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</p>
              <p>• Period: {dateRange === 'last30days' ? 'Last 30 Days' : dateRange}</p>
              <p>• Format: PDF</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleGenerate}>Generate Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SuspendOrganizationDialogProps {
  organization: Organization
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void | Promise<void>
}

export function SuspendOrganizationDialog({ organization, open, onOpenChange, onConfirm }: SuspendOrganizationDialogProps) {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm()
    } else {
      console.log('Suspending organization:', organization.name)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend Organization</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to suspend <strong>{organization.name}</strong>?</p>
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 mt-3">
              <p className="text-sm text-orange-800">
                <strong>Warning:</strong> This action will:
              </p>
              <ul className="text-sm text-orange-700 mt-1 ml-4 list-disc">
                <li>Disable access for all {organization.userCount} users</li>
                <li>Prevent submission of new studies</li>
                <li>Pause all billing activities</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-orange-600 hover:bg-orange-700">
            Suspend Organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface DeleteOrganizationDialogProps {
  organization: Organization
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void | Promise<void>
}

export function DeleteOrganizationDialog({ organization, open, onOpenChange, onConfirm }: DeleteOrganizationDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const expectedText = 'DELETE'

  const handleConfirm = async () => {
    if (confirmText === expectedText) {
      if (onConfirm) {
        await onConfirm()
      } else {
        console.log('Deleting organization:', organization.name)
        onOpenChange(false)
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>This action cannot be undone. This will permanently delete <strong>{organization.name}</strong> and all associated data.</p>
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">This will permanently delete:</p>
                  <ul className="mt-1 ml-4 list-disc text-red-700">
                    <li>All {organization.userCount} user accounts</li>
                    <li>{organization.studyCount} historical studies</li>
                    <li>All billing and contract records</li>
                    <li>All associated reports and data</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-delete">
                Type <strong>{expectedText}</strong> to confirm deletion:
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={confirmText !== expectedText}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}