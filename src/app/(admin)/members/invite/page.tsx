'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useInviteMember } from '@/lib/api/hooks/use-members'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { ArrowLeft, UserPlus, Mail, Shield, Info, ShieldAlert, ShieldCheck, Eye, Edit2, Users, FileText, DollarSign, Activity, Settings } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']),
  permissions: z.array(z.string()).optional(),
  customMessage: z.string().optional(),
  sendImmediately: z.boolean().default(true),
})

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>

// Define available permissions
const PERMISSIONS = {
  users: {
    label: 'Users',
    icon: Users,
    permissions: [
      { id: 'users.view', label: 'View Users', description: 'View user profiles and details' },
      { id: 'users.edit', label: 'Edit Users', description: 'Modify user information and settings' },
      { id: 'users.create', label: 'Create Users', description: 'Add new users to organizations' },
      { id: 'users.delete', label: 'Delete Users', description: 'Remove users from the system' },
    ]
  },
  studies: {
    label: 'Studies',
    icon: FileText,
    permissions: [
      { id: 'studies.view', label: 'View Studies', description: 'Access study information and reports' },
      { id: 'studies.edit', label: 'Edit Studies', description: 'Modify study details and assignments' },
      { id: 'studies.assign', label: 'Assign Studies', description: 'Assign studies to radiologists' },
      { id: 'studies.download', label: 'Download Studies', description: 'Download study images and reports' },
    ]
  },
  organizations: {
    label: 'Organizations',
    icon: Shield,
    permissions: [
      { id: 'organizations.view', label: 'View Organizations', description: 'View organization profiles' },
      { id: 'organizations.edit', label: 'Edit Organizations', description: 'Modify organization settings' },
      { id: 'organizations.create', label: 'Create Organizations', description: 'Onboard new organizations' },
      { id: 'organizations.delete', label: 'Delete Organizations', description: 'Remove organizations' },
    ]
  },
  billing: {
    label: 'Billing',
    icon: DollarSign,
    permissions: [
      { id: 'billing.view', label: 'View Billing', description: 'Access billing information and invoices' },
      { id: 'billing.edit', label: 'Edit Billing', description: 'Modify billing details and rates' },
      { id: 'billing.process', label: 'Process Payments', description: 'Process payments and refunds' },
    ]
  },
  reports: {
    label: 'Reports & Analytics',
    icon: Activity,
    permissions: [
      { id: 'reports.view', label: 'View Reports', description: 'Access system reports and analytics' },
      { id: 'reports.create', label: 'Create Reports', description: 'Generate custom reports' },
      { id: 'reports.export', label: 'Export Reports', description: 'Export reports in various formats' },
    ]
  },
  system: {
    label: 'System Settings',
    icon: Settings,
    permissions: [
      { id: 'system.view', label: 'View Settings', description: 'View system configuration' },
      { id: 'system.edit', label: 'Edit Settings', description: 'Modify system configuration' },
      { id: 'system.audit', label: 'View Audit Logs', description: 'Access system audit logs' },
    ]
  }
}

// Define permissions by role
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS).flatMap(group => group.permissions.map(p => p.id)),
  ADMIN: [
    'users.view', 'users.edit', 'users.create',
    'studies.view', 'studies.edit', 'studies.assign',
    'organizations.view', 'organizations.edit',
    'billing.view',
    'reports.view', 'reports.create',
    'system.view'
  ],
  VIEWER: [
    'users.view',
    'studies.view',
    'organizations.view',
    'billing.view',
    'reports.view'
  ]
}

export default function InviteMemberPage() {
  const router = useRouter()
  const inviteMember = useInviteMember()
  const [selectedRole, setSelectedRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'>('ADMIN')

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      name: '',
      role: 'ADMIN',
      permissions: ROLE_PERMISSIONS.ADMIN,
      customMessage: '',
      sendImmediately: true,
    },
  })

  // Update permissions when role changes
  useEffect(() => {
    form.setValue('permissions', ROLE_PERMISSIONS[selectedRole])
  }, [selectedRole, form])

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      await inviteMember.mutateAsync(data)
      toast({
        title: 'Invitation sent successfully',
        description: `Admin invitation has been sent to ${data.email}`,
      })
      router.push('/members')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role as 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER')
    form.setValue('role', role as 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER')
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = form.getValues('permissions') || []
    if (checked) {
      form.setValue('permissions', [...currentPermissions, permissionId])
    } else {
      form.setValue('permissions', currentPermissions.filter(p => p !== permissionId))
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <ShieldAlert className="h-4 w-4 text-purple-600" />
      case 'ADMIN':
        return <ShieldCheck className="h-4 w-4 text-blue-600" />
      case 'VIEWER':
        return <Eye className="h-4 w-4 text-gray-600" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/members')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Invite Admin Member</h1>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Invitation Process:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• The invited member will receive an email with a secure link to set up their account</li>
            <li>• They must accept the invitation within 7 days before it expires</li>
            <li>• Upon acceptance, they'll be prompted to create a password and enable two-factor authentication</li>
            <li>• You can track the invitation status from the members list</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
              <CardDescription>
                Enter the details of the person you want to invite to the admin portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>
                      The member's full name as it will appear in the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Invitation will be sent to this email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
              <CardDescription>
                Select the role and customize permissions for this member.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select onValueChange={handleRoleChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">
                          <div className="flex items-center gap-2">
                            {getRoleIcon('SUPER_ADMIN')}
                            <div>
                              <p className="font-medium">Super Admin</p>
                              <p className="text-xs text-muted-foreground">Full system access and control</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex items-center gap-2">
                            {getRoleIcon('ADMIN')}
                            <div>
                              <p className="font-medium">Admin</p>
                              <p className="text-xs text-muted-foreground">Manage organizations and users</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="VIEWER">
                          <div className="flex items-center gap-2">
                            {getRoleIcon('VIEWER')}
                            <div>
                              <p className="font-medium">Viewer</p>
                              <p className="text-xs text-muted-foreground">Read-only access</p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Determines the member's base access level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permissions Grid */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Permissions</h4>
                  {selectedRole === 'SUPER_ADMIN' && (
                    <Alert className="mb-4">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>
                        Super Admins have all permissions by default. These cannot be modified.
                      </AlertDescription>
                    </Alert>
                  )}
                  {selectedRole === 'VIEWER' && (
                    <Alert className="mb-4">
                      <Eye className="h-4 w-4" />
                      <AlertDescription>
                        Viewers have read-only access to selected modules. Write permissions are disabled.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-6">
                  {Object.entries(PERMISSIONS).map(([groupKey, group]) => (
                    <Card key={groupKey} className="border-muted">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <group.icon className="h-4 w-4 text-muted-foreground" />
                          <h5 className="font-medium">{group.label}</h5>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {group.permissions.map((permission) => {
                            const isChecked = form.watch('permissions')?.includes(permission.id) || false
                            const isDisabled = selectedRole === 'SUPER_ADMIN' || 
                              (selectedRole === 'VIEWER' && !permission.id.includes('.view'))
                            
                            return (
                              <div key={permission.id} className="flex items-start space-x-3">
                                <Checkbox
                                  id={permission.id}
                                  checked={isChecked}
                                  disabled={isDisabled}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(permission.id, checked as boolean)
                                  }
                                />
                                <div className="space-y-1">
                                  <label
                                    htmlFor={permission.id}
                                    className={`text-sm font-medium leading-none ${
                                      isDisabled ? 'text-muted-foreground' : 'cursor-pointer'
                                    }`}
                                  >
                                    {permission.label}
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invitation Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Invitation Settings</CardTitle>
              <CardDescription>
                Customize the invitation email and delivery options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="customMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a personal message to include in the invitation email..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This message will be included in the invitation email sent to the member
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendImmediately"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Send invitation immediately
                      </FormLabel>
                      <FormDescription>
                        If unchecked, the invitation will be saved as a draft and can be sent later
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Permission Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Permission Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getRoleIcon(selectedRole)}
                  <span className="font-medium">{selectedRole.replace('_', ' ')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">This member will have:</p>
                  <ul className="space-y-1">
                    {selectedRole === 'SUPER_ADMIN' && (
                      <>
                        <li>• Complete control over all system features and settings</li>
                        <li>• Ability to manage other admin members and their permissions</li>
                        <li>• Access to all organizations, users, and sensitive data</li>
                        <li>• Permission to modify system configuration and integrations</li>
                      </>
                    )}
                    {selectedRole === 'ADMIN' && (
                      <>
                        <li>• Access to {form.watch('permissions')?.length || 0} specific permissions</li>
                        <li>• Ability to manage organizations and their users</li>
                        <li>• View and process studies based on assigned permissions</li>
                        <li>• Limited access to system settings and configuration</li>
                      </>
                    )}
                    {selectedRole === 'VIEWER' && (
                      <>
                        <li>• Read-only access to selected modules</li>
                        <li>• Cannot make any modifications to data</li>
                        <li>• Limited access to sensitive information</li>
                        <li>• Ideal for auditors or external stakeholders</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={inviteMember.isPending}>
              {inviteMember.isPending ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/members')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}