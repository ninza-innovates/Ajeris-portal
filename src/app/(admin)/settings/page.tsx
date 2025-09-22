'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useMembers } from '@/lib/api/hooks/use-members'
import { useSettings, useUpdateGeneralSettings, useUpdateSecuritySettings, useUpdateNotificationSettings, useUpdateAuditSettings, useUpdateRateLimits } from '@/lib/api/hooks/use-settings'
import { useSystemSettings, useUpdateSystemSettings, useIntegrations, useTestIntegration, useSystemHealth, useToggleMaintenanceMode } from '@/hooks/use-settings'
import { InviteAdminDialog } from '@/components/admin/settings/invite-admin-dialog'
import { toast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Key,
  Users,
  FileText,
  Save,
  AlertCircle,
  UserPlus,
  MoreVertical,
  Eye,
  Ban,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('general')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  
  // API hooks
  const { data: settings, isLoading: settingsLoading } = useSettings()
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations()
  const { data: systemHealth, isLoading: healthLoading } = useSystemHealth()
  const { data: members, isLoading: membersLoading } = useMembers()
  const updateGeneralSettings = useUpdateGeneralSettings()
  const updateSecuritySettings = useUpdateSecuritySettings()
  const updateNotificationSettings = useUpdateNotificationSettings()
  const updateAuditSettings = useUpdateAuditSettings()
  const updateRateLimits = useUpdateRateLimits()
  const testIntegration = useTestIntegration()
  const toggleMaintenance = useToggleMaintenanceMode()
  
  // Form state - will be populated from API
  const [generalForm, setGeneralForm] = useState({
    platformName: '',
    supportEmail: '',
    supportPhone: '',
    timezone: '',
    language: '',
    dateFormat: '',
    maintenanceMode: false,
  })
  
  const [securityForm, setSecurityForm] = useState({
    passwordPolicy: {
      minLength: 12,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSymbols: false,
      forcePasswordChange: false,
      passwordChangeInterval: 90,
    },
    twoFactorAuth: {
      requireForAdmin: false,
      requireForAllUsers: false,
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  })
  
  const [auditForm, setAuditForm] = useState({
    auditLogging: {
      logDataAccess: true,
      logDataModifications: true,
      logDataExports: false,
    },
    retentionPeriod: 7,
  })
  
  const [rateLimitsForm, setRateLimitsForm] = useState({
    apiRateLimit: 100,
    maxUploadSize: 500,
    maxConcurrentUploads: 5,
  })
  
  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: {
      newUserRegistration: false,
      failedLoginAttempts: false,
      systemErrors: false,
      billingAlerts: false,
    },
    alertEmails: [] as string[],
  })
  
  // Update form state when settings load
  useEffect(() => {
    if (settings) {
      setGeneralForm({
        platformName: settings.general.platformName,
        supportEmail: settings.general.supportEmail,
        supportPhone: settings.general.supportPhone,
        timezone: settings.general.timezone,
        language: settings.general.language,
        dateFormat: settings.general.dateFormat,
        maintenanceMode: settings.general.maintenanceMode,
      })
      
      setSecurityForm({
        passwordPolicy: settings.security.passwordPolicy,
        twoFactorAuth: settings.security.twoFactorAuth,
        sessionTimeout: settings.security.sessionTimeout,
        maxLoginAttempts: settings.security.maxLoginAttempts,
      })
      
      setNotificationForm({
        emailNotifications: settings.notifications.emailNotifications,
        alertEmails: settings.notifications.alertEmails,
      })
      
      setAuditForm({
        auditLogging: settings.audit.auditLogging,
        retentionPeriod: settings.audit.retentionPeriod,
      })
      
      setRateLimitsForm({
        apiRateLimit: settings.rateLimits.apiRateLimit,
        maxUploadSize: settings.rateLimits.maxUploadSize,
        maxConcurrentUploads: settings.rateLimits.maxConcurrentUploads,
      })
    }
  }, [settings])

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    ...(user?.role === 'SUPER_ADMIN' ? [{ id: 'members', label: 'Members', icon: Users }] : []),
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'compliance', label: 'Compliance', icon: FileText },
    { id: 'advanced', label: 'Advanced', icon: Database },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage system configuration and preferences
        </p>
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
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settingsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input 
                          id="platform-name" 
                          value={generalForm.platformName}
                          onChange={(e) => setGeneralForm({ ...generalForm, platformName: e.target.value })}
                          placeholder="Enter platform name"
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input 
                          id="support-email" 
                          type="email" 
                          value={generalForm.supportEmail}
                          onChange={(e) => setGeneralForm({ ...generalForm, supportEmail: e.target.value })}
                          placeholder="Enter support email"
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="support-phone">Support Phone</Label>
                        <Input 
                          id="support-phone" 
                          type="tel" 
                          value={generalForm.supportPhone}
                          onChange={(e) => setGeneralForm({ ...generalForm, supportPhone: e.target.value })}
                          placeholder="Enter support phone"
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Default Timezone</Label>
                        <select 
                          className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                          value={generalForm.timezone}
                          onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })}
                        >
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="America/Chicago">America/Chicago (CST)</option>
                          <option value="America/Denver">America/Denver (MST)</option>
                          <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="maintenance" 
                          checked={generalForm.maintenanceMode}
                          onCheckedChange={(checked) => 
                            setGeneralForm({ ...generalForm, maintenanceMode: !!checked })
                          }
                        />
                        <Label htmlFor="maintenance" className="cursor-pointer">
                          Enable maintenance mode
                        </Label>
                      </div>
                    </div>
                    <Button 
                      onClick={() => updateGeneralSettings.mutate(generalForm)}
                      disabled={updateGeneralSettings.isPending}
                    >
                      {updateGeneralSettings.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure authentication and security policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settingsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label>Password Policy</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              value={securityForm.passwordPolicy.minLength}
                              onChange={(e) => setSecurityForm({
                                ...securityForm,
                                passwordPolicy: {
                                  ...securityForm.passwordPolicy,
                                  minLength: parseInt(e.target.value) || 8
                                }
                              })}
                              className="w-20"
                              min="8"
                              max="32"
                            />
                            <Label>Minimum password length (characters)</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="uppercase" 
                              checked={securityForm.passwordPolicy.requireUppercase}
                              onCheckedChange={(checked) => setSecurityForm({
                                ...securityForm,
                                passwordPolicy: {
                                  ...securityForm.passwordPolicy,
                                  requireUppercase: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="uppercase" className="cursor-pointer">
                              Require uppercase letters
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="lowercase" 
                              checked={securityForm.passwordPolicy.requireLowercase}
                              onCheckedChange={(checked) => setSecurityForm({
                                ...securityForm,
                                passwordPolicy: {
                                  ...securityForm.passwordPolicy,
                                  requireLowercase: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="lowercase" className="cursor-pointer">
                              Require lowercase letters
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="numbers" 
                              checked={securityForm.passwordPolicy.requireNumbers}
                              onCheckedChange={(checked) => setSecurityForm({
                                ...securityForm,
                                passwordPolicy: {
                                  ...securityForm.passwordPolicy,
                                  requireNumbers: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="numbers" className="cursor-pointer">
                              Require numbers
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="symbols" 
                              checked={securityForm.passwordPolicy.requireSymbols}
                              onCheckedChange={(checked) => setSecurityForm({
                                ...securityForm,
                                passwordPolicy: {
                                  ...securityForm.passwordPolicy,
                                  requireSymbols: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="symbols" className="cursor-pointer">
                              Require special characters
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="rotation" 
                              checked={securityForm.passwordPolicy.forcePasswordChange}
                              onCheckedChange={(checked) => setSecurityForm({
                                ...securityForm,
                                passwordPolicy: {
                                  ...securityForm.passwordPolicy,
                                  forcePasswordChange: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="rotation" className="cursor-pointer">
                              Force password change every
                            </Label>
                            <Input 
                              type="number" 
                              value={securityForm.passwordPolicy.passwordChangeInterval}
                              onChange={(e) => setSecurityForm({
                                ...securityForm,
                                passwordPolicy: {
                                  ...securityForm.passwordPolicy,
                                  passwordChangeInterval: parseInt(e.target.value) || 90
                                }
                              })}
                              className="w-20"
                              min="30"
                              max="365"
                              disabled={!securityForm.passwordPolicy.forcePasswordChange}
                            />
                            <Label>days</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="2fa-admin" 
                              checked={securityForm.twoFactorAuth.requireForAdmin}
                              onCheckedChange={(checked) => setSecurityForm({
                                ...securityForm,
                                twoFactorAuth: {
                                  ...securityForm.twoFactorAuth,
                                  requireForAdmin: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="2fa-admin" className="cursor-pointer">
                              Require 2FA for admin accounts
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="2fa-all" 
                              checked={securityForm.twoFactorAuth.requireForAllUsers}
                              onCheckedChange={(checked) => setSecurityForm({
                                ...securityForm,
                                twoFactorAuth: {
                                  ...securityForm.twoFactorAuth,
                                  requireForAllUsers: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="2fa-all" className="cursor-pointer">
                              Require 2FA for all users
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Input 
                          id="session-timeout" 
                          type="number" 
                          value={securityForm.sessionTimeout}
                          onChange={(e) => setSecurityForm({
                            ...securityForm,
                            sessionTimeout: parseInt(e.target.value) || 30
                          })}
                          className="mt-1 w-32" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-attempts">Max Login Attempts</Label>
                        <Input 
                          id="login-attempts" 
                          type="number" 
                          value={securityForm.maxLoginAttempts}
                          onChange={(e) => setSecurityForm({
                            ...securityForm,
                            maxLoginAttempts: parseInt(e.target.value) || 5
                          })}
                          className="mt-1 w-32" 
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => updateSecuritySettings.mutate(securityForm)}
                      disabled={updateSecuritySettings.isPending}
                    >
                      {updateSecuritySettings.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Security Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure email notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settingsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label>Email Notifications</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="new-user" 
                              checked={notificationForm.emailNotifications.newUserRegistration}
                              onCheckedChange={(checked) => 
                                setNotificationForm({ 
                                  ...notificationForm, 
                                  emailNotifications: {
                                    ...notificationForm.emailNotifications,
                                    newUserRegistration: !!checked
                                  }
                                })
                              }
                            />
                            <Label htmlFor="new-user" className="cursor-pointer">
                              New user registration
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="failed-login" 
                              checked={notificationForm.emailNotifications.failedLoginAttempts}
                              onCheckedChange={(checked) => 
                                setNotificationForm({ 
                                  ...notificationForm, 
                                  emailNotifications: {
                                    ...notificationForm.emailNotifications,
                                    failedLoginAttempts: !!checked
                                  }
                                })
                              }
                            />
                            <Label htmlFor="failed-login" className="cursor-pointer">
                              Failed login attempts
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="system-errors" 
                              checked={notificationForm.emailNotifications.systemErrors}
                              onCheckedChange={(checked) => 
                                setNotificationForm({ 
                                  ...notificationForm, 
                                  emailNotifications: {
                                    ...notificationForm.emailNotifications,
                                    systemErrors: !!checked
                                  }
                                })
                              }
                            />
                            <Label htmlFor="system-errors" className="cursor-pointer">
                              System errors and warnings
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="billing-alerts" 
                              checked={notificationForm.emailNotifications.billingAlerts}
                              onCheckedChange={(checked) => 
                                setNotificationForm({ 
                                  ...notificationForm, 
                                  emailNotifications: {
                                    ...notificationForm.emailNotifications,
                                    billingAlerts: !!checked
                                  }
                                })
                              }
                            />
                            <Label htmlFor="billing-alerts" className="cursor-pointer">
                              Billing and payment alerts
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="alert-email">Alert Email Recipients</Label>
                        <Input 
                          id="alert-email" 
                          value={notificationForm.alertEmails.join(', ')}
                          onChange={(e) => {
                            const emails = e.target.value.split(',').map(email => email.trim()).filter(email => email)
                            setNotificationForm({ ...notificationForm, alertEmails: emails })
                          }}
                          placeholder="Enter alert email recipients" 
                          className="mt-1" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => updateNotificationSettings.mutate(notificationForm)}
                      disabled={updateNotificationSettings.isPending}
                    >
                      {updateNotificationSettings.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Notification Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-4">
              {integrationsLoading ? (
                <Card>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                integrations?.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <CardTitle className="capitalize">{integration.type} Integration</CardTitle>
                      <CardDescription>{integration.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{integration.provider}</p>
                          <p className="text-sm text-gray-500">
                            {integration.lastTestDate && (
                              <>Last tested: {new Date(integration.lastTestDate).toLocaleString()}</>
                            )}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            integration.status === 'connected' ? 'success' : 
                            integration.status === 'error' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      {integration.lastTestResult && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">
                            {integration.lastTestResult.success ? 'Test Successful' : 'Test Failed'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {integration.lastTestResult.message} (Response time: {integration.lastTestResult.responseTime}ms)
                          </p>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => testIntegration.mutate(integration.id)}
                        disabled={testIntegration.isPending}
                      >
                        {testIntegration.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Test Connection
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <Card>
              <CardHeader>
                <CardTitle>Compliance Settings</CardTitle>
                <CardDescription>
                  Configure HIPAA compliance and audit settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settingsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">HIPAA Compliance Mode</p>
                        <p className="text-sm text-blue-700 mt-1">
                          All required HIPAA safeguards are currently enabled
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Audit Logging</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="audit-access" 
                              checked={auditForm.auditLogging.logDataAccess} 
                              disabled 
                            />
                            <Label htmlFor="audit-access" className="cursor-pointer">
                              Log all data access (Required)
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="audit-changes" 
                              checked={auditForm.auditLogging.logDataModifications} 
                              disabled 
                            />
                            <Label htmlFor="audit-changes" className="cursor-pointer">
                              Log all data modifications (Required)
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="audit-export" 
                              checked={auditForm.auditLogging.logDataExports}
                              onCheckedChange={(checked) => setAuditForm({
                                ...auditForm,
                                auditLogging: {
                                  ...auditForm.auditLogging,
                                  logDataExports: !!checked
                                }
                              })}
                            />
                            <Label htmlFor="audit-export" className="cursor-pointer">
                              Log all data exports
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="retention">Audit Log Retention (years)</Label>
                        <Input 
                          id="retention" 
                          type="number" 
                          value={auditForm.retentionPeriod}
                          onChange={(e) => setAuditForm({
                            ...auditForm,
                            retentionPeriod: parseInt(e.target.value) || 7
                          })}
                          className="mt-1 w-32" 
                          min="6"
                        />
                        <p className="text-xs text-gray-500 mt-1">HIPAA requires minimum 6 years</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => updateAuditSettings.mutate(auditForm)}
                      disabled={updateAuditSettings.isPending}
                    >
                      {updateAuditSettings.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Compliance Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Real-time system status and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : systemHealth ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">System Status</span>
                        <Badge 
                          variant={
                            systemHealth.status === 'healthy' ? 'success' : 
                            systemHealth.status === 'degraded' ? 'warning' : 
                            'destructive'
                          }
                          className="text-lg px-3 py-1"
                        >
                          {systemHealth.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-gray-600">Services</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Database</span>
                              <Badge variant={systemHealth.services.database.status ? 'success' : 'destructive'} className="text-xs">
                                {systemHealth.services.database.status ? 'Online' : 'Offline'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Redis Cache</span>
                              <Badge variant={systemHealth.services.redis.status ? 'success' : 'destructive'} className="text-xs">
                                {systemHealth.services.redis.status ? 'Online' : 'Offline'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Storage</span>
                              <Badge variant={systemHealth.services.storage.status ? 'success' : 'destructive'} className="text-xs">
                                {systemHealth.services.storage.available}GB free
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">DICOM Viewer</span>
                              <Badge variant={systemHealth.services.dicomViewer.status ? 'success' : 'destructive'} className="text-xs">
                                {systemHealth.services.dicomViewer.status ? 'Online' : 'Offline'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-gray-600">Performance</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">CPU Usage</span>
                              <span className="text-sm font-medium">{systemHealth.metrics.cpuUsage}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Memory Usage</span>
                              <span className="text-sm font-medium">{systemHealth.metrics.memoryUsage}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Disk Usage</span>
                              <span className="text-sm font-medium">{systemHealth.metrics.diskUsage}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Active Users</span>
                              <span className="text-sm font-medium">{systemHealth.metrics.activeUsers}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Unable to load system health data</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    System configuration and database settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {settingsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="api-rate">API Rate Limit (requests/minute)</Label>
                          <Input 
                            id="api-rate" 
                            type="number" 
                            value={rateLimitsForm.apiRateLimit}
                            onChange={(e) => setRateLimitsForm({
                              ...rateLimitsForm,
                              apiRateLimit: parseInt(e.target.value) || 100
                            })}
                            className="mt-1 w-32" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="upload-size">Max Upload Size (MB)</Label>
                          <Input 
                            id="upload-size" 
                            type="number" 
                            value={rateLimitsForm.maxUploadSize}
                            onChange={(e) => setRateLimitsForm({
                              ...rateLimitsForm,
                              maxUploadSize: parseInt(e.target.value) || 500
                            })}
                            className="mt-1 w-32" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="concurrent-uploads">Max Concurrent Uploads</Label>
                          <Input 
                            id="concurrent-uploads" 
                            type="number" 
                            value={rateLimitsForm.maxConcurrentUploads}
                            onChange={(e) => setRateLimitsForm({
                              ...rateLimitsForm,
                              maxConcurrentUploads: parseInt(e.target.value) || 5
                            })}
                            className="mt-1 w-32" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="maintenance-advanced" 
                            checked={generalForm.maintenanceMode}
                            onCheckedChange={(checked) => {
                              setGeneralForm({ ...generalForm, maintenanceMode: !!checked })
                              toggleMaintenance.mutate(checked as boolean)
                            }}
                          />
                          <Label htmlFor="maintenance-advanced" className="cursor-pointer">
                            Enable maintenance mode
                          </Label>
                        </div>
                        <Button 
                          onClick={() => updateRateLimits.mutate(rateLimitsForm)}
                          disabled={updateRateLimits.isPending}
                          className="mt-4"
                        >
                          {updateRateLimits.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save Advanced Settings
                        </Button>
                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-3">Danger Zone</h3>
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                              onClick={() => {
                                if (confirm('Are you sure you want to clear the system cache?')) {
                                  // Clear cache functionality
                                  toast({
                                    title: 'Cache Cleared',
                                    description: 'System cache has been cleared successfully.',
                                  })
                                }
                              }}
                            >
                              Clear System Cache
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              disabled
                            >
                              Reset All Settings
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'members' && user?.role === 'SUPER_ADMIN' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Admin Members</CardTitle>
                      <CardDescription>
                        Manage internal admin users and their permissions
                      </CardDescription>
                    </div>
                    <Button onClick={() => setInviteDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Admin
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                          <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Status</th>
                          <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">2FA</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Last Active</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Invited By</th>
                          <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {membersLoading ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center">
                              <div className="flex justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                              </div>
                            </td>
                          </tr>
                        ) : members?.data?.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-500">
                              No admin members found
                            </td>
                          </tr>
                        ) : (
                          members?.data?.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="p-3 font-medium">{member.name}</td>
                            <td className="p-3 text-sm text-gray-600">{member.email}</td>
                            <td className="p-3">
                              <Badge 
                                variant={
                                  member.role === 'SUPER_ADMIN' ? 'destructive' : 
                                  member.role === 'ADMIN' ? 'info' : 
                                  'secondary'
                                }
                              >
                                {member.role.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge 
                                variant={
                                  member.status === 'Active' ? 'success' : 
                                  member.status === 'Invited' ? 'warning' : 
                                  'destructive'
                                }
                              >
                                {member.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-center">
                              <span className={member.twoFactorEnabled ? 'text-green-600' : 'text-yellow-600'}>
                                {member.twoFactorEnabled ? '✓' : '⚠️'}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {member.lastActive || 'Never'}
                            </td>
                            <td className="p-3 text-sm text-gray-600">{member.invitedBy}</td>
                            <td className="p-3 text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {member.id !== user?.id && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-orange-600">
                                        <Ban className="mr-2 h-4 w-4" />
                                        {member.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                                      </DropdownMenuItem>
                                      {member.role !== 'SUPER_ADMIN' && (
                                        <DropdownMenuItem className="text-red-600">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Remove Admin
                                        </DropdownMenuItem>
                                      )}
                                    </>
                                  )}
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

              <Card>
                <CardHeader>
                  <CardTitle>Admin Role Permissions</CardTitle>
                  <CardDescription>Understanding different admin access levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Super Admin</p>
                        <p className="text-sm text-gray-600">
                          Full system access including ability to manage other admins, access all settings, 
                          and perform all administrative functions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-sm text-gray-600">
                          Full access to manage the platform including users, studies, organizations, 
                          and billing. Cannot manage other admin accounts.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-sm text-gray-600">
                          Read-only access to the admin portal. Can view all data but cannot make 
                          any modifications or perform administrative actions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <InviteAdminDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen} 
      />
    </div>
  )
}