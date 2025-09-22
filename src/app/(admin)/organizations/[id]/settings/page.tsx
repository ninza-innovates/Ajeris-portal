'use client'

import { useParams, useRouter } from 'next/navigation'
import { useOrganization, useUpdateOrganization, useTestHL7 } from '@/lib/api/hooks/use-organizations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Building,
  Save,
  Globe,
  Shield,
  Key,
  Bell,
  DollarSign,
  FileText,
  AlertCircle,
  Cable,
  Database,
  Settings2,
  Loader2,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export default function OrganizationSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = params.id as string
  const [activeTab, setActiveTab] = useState('general')
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  
  // Fetch organization data
  const { data: organization, isLoading } = useOrganization(organizationId)
  const updateOrganization = useUpdateOrganization()
  const testHL7 = useTestHL7()

  // Initialize form data when organization loads
  useEffect(() => {
    if (organization && !formData) {
      setFormData({
        name: organization.name,
        type: organization.type,
        status: organization.status || 'active',
        contactName: organization.contact?.name || '',
        contactEmail: organization.email || organization.contact?.email || '',
        contactPhone: organization.phone || organization.contact?.phone || '',
        street: organization.address?.street || '',
        city: organization.address?.city || '',
        state: organization.address?.state || '',
        zip: organization.address?.zip || '',
        aeTitle: organization.aeTitle || '',
        datastoreId: organization.datastoreId || '',
        hl7InterfaceEnabled: organization.hl7InterfaceEnabled || false,
        hl7Endpoint: organization.hl7Settings?.endpoint || '',
        hl7Port: organization.hl7Settings?.port || '',
        hl7Version: organization.hl7Settings?.version || '2.5',
        pacsSystem: organization.pacsSystem || '',
        pacsAETitle: organization.pacsAETitle || '',
      })
    }
  }, [organization])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!organization || !formData) {
    return null
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'technical', label: 'Technical', icon: Cable },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const handleSave = async () => {
    const updateData: any = {
      name: formData.name,
      type: formData.type,
      email: formData.contactEmail,
      phone: formData.contactPhone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
      aeTitle: formData.aeTitle,
      datastoreId: formData.datastoreId,
      hl7InterfaceEnabled: formData.hl7InterfaceEnabled,
    }

    if (formData.hl7InterfaceEnabled) {
      updateData.hl7Settings = {
        endpoint: formData.hl7Endpoint,
        port: formData.hl7Port,
        version: formData.hl7Version,
      }
    }

    await updateOrganization.mutateAsync({
      id: organizationId,
      data: updateData,
    })
    
    setConfirmSaveOpen(false)
  }

  const handleTestHL7 = async () => {
    await testHL7.mutateAsync(organizationId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Organization Settings
            </h1>
            <p className="text-muted-foreground">
              Configure settings for {organization.name}
            </p>
          </div>
        </div>
        <Button onClick={() => setConfirmSaveOpen(true)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === tab.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Basic organization details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input 
                      id="org-name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="org-id">Organization ID</Label>
                    <Input id="org-id" value={organization.id} disabled className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="org-type">Type</Label>
                    <select 
                      className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Hospital">Hospital</option>
                      <option value="Imaging Center">Imaging Center</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="org-status">Status</Label>
                    <select 
                      className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Primary Contact</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="contact-name">Name</Label>
                      <Input 
                        id="contact-name" 
                        value={formData.contactName} 
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input 
                        id="contact-email" 
                        type="email" 
                        value={formData.contactEmail} 
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone</Label>
                      <Input 
                        id="contact-phone" 
                        type="tel" 
                        value={formData.contactPhone} 
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="mt-1" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Address</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address-street">Street Address</Label>
                      <Input 
                        id="address-street" 
                        value={formData.street} 
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="mt-1" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="address-city">City</Label>
                        <Input 
                          id="address-city" 
                          value={formData.city} 
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="address-state">State</Label>
                        <Input 
                          id="address-state" 
                          value={formData.state} 
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="address-zip">ZIP Code</Label>
                        <Input 
                          id="address-zip" 
                          value={formData.zip} 
                          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                          className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'technical' && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Configuration</CardTitle>
                <CardDescription>
                  DICOM, HL7, and integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">DICOM Settings</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="ae-title">AE Title</Label>
                      <Input 
                        id="ae-title" 
                        value={formData.aeTitle} 
                        onChange={(e) => setFormData({ ...formData, aeTitle: e.target.value })}
                        className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="datastore-id">Datastore ID</Label>
                      <Input 
                        id="datastore-id" 
                        value={formData.datastoreId} 
                        onChange={(e) => setFormData({ ...formData, datastoreId: e.target.value })}
                        className="mt-1" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">HL7 Interface Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="hl7-enabled" 
                        checked={formData.hl7InterfaceEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, hl7InterfaceEnabled: checked })}
                      />
                      <Label htmlFor="hl7-enabled" className="cursor-pointer">
                        Enable HL7 Interface for Order Intake
                      </Label>
                    </div>
                    {formData.hl7InterfaceEnabled && (
                      <div className="grid gap-4 md:grid-cols-2 pl-6">
                        <div>
                          <Label htmlFor="hl7-endpoint">HL7 Endpoint</Label>
                          <Input 
                            id="hl7-endpoint" 
                            value={formData.hl7Endpoint} 
                            onChange={(e) => setFormData({ ...formData, hl7Endpoint: e.target.value })}
                            className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="hl7-port">HL7 Port</Label>
                          <Input 
                            id="hl7-port" 
                            type="number" 
                            value={formData.hl7Port} 
                            onChange={(e) => setFormData({ ...formData, hl7Port: e.target.value })}
                            className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="hl7-version">HL7 Version</Label>
                          <select 
                            className="w-full px-3 py-2 border rounded-lg text-sm mt-1" 
                            value={formData.hl7Version}
                            onChange={(e) => setFormData({ ...formData, hl7Version: e.target.value })}
                          >
                            <option value="2.3">2.3</option>
                            <option value="2.3.1">2.3.1</option>
                            <option value="2.4">2.4</option>
                            <option value="2.5">2.5</option>
                            <option value="2.5.1">2.5.1</option>
                            <option value="2.6">2.6</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="pacs-system">PACS System</Label>
                          <Input 
                            id="pacs-system" 
                            value={formData.pacsSystem} 
                            onChange={(e) => setFormData({ ...formData, pacsSystem: e.target.value })}
                            className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="pacs-ae-title">PACS AE Title</Label>
                          <Input 
                            id="pacs-ae-title" 
                            value={formData.pacsAETitle} 
                            onChange={(e) => setFormData({ ...formData, pacsAETitle: e.target.value })}
                            className="mt-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  {formData.hl7InterfaceEnabled && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleTestHL7}
                        disabled={testHL7.isPending}
                      >
                        {testHL7.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Cable className="mr-2 h-4 w-4" />
                        )}
                        Test HL7 Connection
                      </Button>
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900">HL7 Result Delivery</p>
                        <p className="text-purple-700 mt-1">
                          Automated HL7 result delivery will be available in a future update.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing Configuration</CardTitle>
                <CardDescription>
                  Payment methods and billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Billing Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="billing-email">Billing Email</Label>
                      <Input 
                        id="billing-email" 
                        type="email" 
                        value={formData.contactEmail} 
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="billing-phone">Billing Phone</Label>
                      <Input 
                        id="billing-phone" 
                        type="tel" 
                        value={formData.contactPhone} 
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="mt-1" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Payment Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="auto-pay" />
                      <Label htmlFor="auto-pay" className="cursor-pointer">
                        Enable automatic payments
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="invoice-email" defaultChecked />
                      <Label htmlFor="invoice-email" className="cursor-pointer">
                        Send invoices via email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="payment-reminders" defaultChecked />
                      <Label htmlFor="payment-reminders" className="cursor-pointer">
                        Send payment reminders
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Current Balance</span>
                    <span className="text-2xl font-bold">${(organization.outstandingBalance || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Billing Status</span>
                    <Badge variant={(organization.billingStatus || 'Current') === 'Current' ? 'success' : 'destructive'}>
                      {organization.billingStatus || 'Current'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how your organization receives notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="notify-new-studies" defaultChecked />
                      <Label htmlFor="notify-new-studies" className="cursor-pointer">
                        New study assignments
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="notify-completed" defaultChecked />
                      <Label htmlFor="notify-completed" className="cursor-pointer">
                        Study completions
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="notify-errors" defaultChecked />
                      <Label htmlFor="notify-errors" className="cursor-pointer">
                        Study errors or issues
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="notify-tat" defaultChecked />
                      <Label htmlFor="notify-tat" className="cursor-pointer">
                        TAT alerts and warnings
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="notify-billing" defaultChecked />
                      <Label htmlFor="notify-billing" className="cursor-pointer">
                        Billing and payment updates
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Notification Recipients</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notify-emails">Email Addresses (comma-separated)</Label>
                      <Textarea 
                        id="notify-emails" 
                        placeholder="admin@hospital.com, manager@hospital.com"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Access control and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Access Control</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="require-2fa" />
                      <Label htmlFor="require-2fa" className="cursor-pointer">
                        Require two-factor authentication for all users
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="sso-enabled" />
                      <Label htmlFor="sso-enabled" className="cursor-pointer">
                        Enable Single Sign-On (SSO)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="ip-whitelist" />
                      <Label htmlFor="ip-whitelist" className="cursor-pointer">
                        Enable IP address whitelist
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Session Management</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
                      <Input id="max-sessions" type="number" defaultValue="3" className="mt-1" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Password Policy</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="password-complexity" defaultChecked />
                      <Label htmlFor="password-complexity" className="cursor-pointer">
                        Enforce password complexity requirements
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="password-rotation" defaultChecked />
                      <Label htmlFor="password-rotation" className="cursor-pointer">
                        Require password changes every 90 days
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog open={confirmSaveOpen} onOpenChange={setConfirmSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Organization Settings</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes? This will update the settings for {organization.name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSaveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateOrganization.isPending}>
              {updateOrganization.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}