'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateUser } from '@/lib/api/hooks/use-users'
import { useOrganizations } from '@/lib/api/hooks/use-organizations'
import { useSettings } from '@/lib/api/hooks/use-settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

// Define the schema dynamically based on security settings
const createDynamicUserSchema = (passwordPolicy?: {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSymbols: boolean
}) => {
  let passwordSchema = z.string()
  
  if (passwordPolicy) {
    passwordSchema = passwordSchema.min(
      passwordPolicy.minLength,
      `Password must be at least ${passwordPolicy.minLength} characters`
    )
    
    if (passwordPolicy.requireUppercase) {
      passwordSchema = passwordSchema.regex(
        /[A-Z]/,
        'Password must contain at least one uppercase letter'
      )
    }
    
    if (passwordPolicy.requireLowercase) {
      passwordSchema = passwordSchema.regex(
        /[a-z]/,
        'Password must contain at least one lowercase letter'
      )
    }
    
    if (passwordPolicy.requireNumbers) {
      passwordSchema = passwordSchema.regex(
        /[0-9]/,
        'Password must contain at least one number'
      )
    }
    
    if (passwordPolicy.requireSymbols) {
      passwordSchema = passwordSchema.regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character'
      )
    }
  }
  
  return z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'RAD', 'CLINIC', 'BILLING']),
    organizationId: z.string().optional(),
    password: passwordSchema.optional(),
    twoFactorEnabled: z.boolean().default(false),
    sendInvitationEmail: z.boolean().default(true),
  })
}

type CreateUserFormData = z.infer<ReturnType<typeof createDynamicUserSchema>>

export default function CreateUserPage() {
  const router = useRouter()
  const createUser = useCreateUser()
  const { data: orgsResponse, isLoading: orgsLoading } = useOrganizations()
  const { data: settings, isLoading: settingsLoading } = useSettings()
  const organizations = orgsResponse?.data || []
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Create schema based on security settings
  const userSchema = createDynamicUserSchema(settings?.security.passwordPolicy)
  
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      name: '',
      phone: '',
      role: 'CLINIC',
      organizationId: undefined,
      password: '',
      twoFactorEnabled: false,
      sendInvitationEmail: true,
    },
  })
  
  // Update schema when settings change
  useEffect(() => {
    if (settings) {
      const newSchema = createDynamicUserSchema(settings.security.passwordPolicy)
      form.clearErrors()
    }
  }, [settings, form])
  
  // Auto-enable 2FA for admin users if required by policy
  const watchedRole = form.watch('role')
  useEffect(() => {
    if (settings?.security.twoFactorAuth.requireForAdmin && 
        (watchedRole === 'SUPER_ADMIN' || watchedRole === 'ADMIN')) {
      form.setValue('twoFactorEnabled', true)
    }
  }, [watchedRole, settings, form])

  const onSubmit = async (data: CreateUserFormData) => {
    setIsSubmitting(true)
    try {
      await createUser.mutateAsync(data)
      toast({
        title: 'Success',
        description: `User created successfully${data.sendInvitationEmail ? ' and invitation email sent' : ''}.`,
      })
      router.push('/users')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Show loading state while fetching settings
  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/users')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Create User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Create a new user account. Fill in the required information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      User will receive login credentials at this email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormDescription>
                      Contact phone number (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="RAD">Radiologist</SelectItem>
                        <SelectItem value="CLINIC">Clinic User</SelectItem>
                        <SelectItem value="BILLING">Billing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      User&apos;s access level within the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={orgsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={orgsLoading ? "Loading organizations..." : "Select an organization"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No organization</SelectItem>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Assign user to a specific organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      {settings?.security.passwordPolicy && (
                        <div className="space-y-1 text-xs">
                          <p>Password must:</p>
                          <ul className="list-disc list-inside ml-2">
                            <li>Be at least {settings.security.passwordPolicy.minLength} characters long</li>
                            {settings.security.passwordPolicy.requireUppercase && <li>Contain at least one uppercase letter</li>}
                            {settings.security.passwordPolicy.requireLowercase && <li>Contain at least one lowercase letter</li>}
                            {settings.security.passwordPolicy.requireNumbers && <li>Contain at least one number</li>}
                            {settings.security.passwordPolicy.requireSymbols && <li>Contain at least one special character</li>}
                          </ul>
                        </div>
                      )}
                      {!field.value && (
                        <p className="mt-2 text-muted-foreground">
                          Leave blank to require user to set password on first login
                        </p>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Two-Factor Authentication
                      </FormLabel>
                      <FormDescription>
                        Require this user to set up 2FA on their account
                        {settings?.security.twoFactorAuth.requireForAdmin && 
                         (watchedRole === 'SUPER_ADMIN' || watchedRole === 'ADMIN') && (
                          <span className="block text-yellow-600 dark:text-yellow-500 mt-1">
                            Required for admin users by security policy
                          </span>
                        )}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={settings?.security.twoFactorAuth.requireForAdmin && 
                                 (watchedRole === 'SUPER_ADMIN' || watchedRole === 'ADMIN')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendInvitationEmail"
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
                        Send invitation email
                      </FormLabel>
                      <FormDescription>
                        Send the user an email with their login credentials and setup instructions
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || createUser.isPending}
                >
                  {isSubmitting || createUser.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/users')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}