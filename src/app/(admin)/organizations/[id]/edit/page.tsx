'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useOrganization, useUpdateOrganization } from '@/lib/api/hooks/use-organizations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { ArrowLeft, Building } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect } from 'react'

const updateOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  type: z.enum(['hospital', 'clinic', 'imaging_center', 'private_practice']).optional(),
  primaryContact: z.string().min(2, 'Primary contact is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State must be 2 characters'),
    zip: z.string().min(5, 'ZIP code must be at least 5 digits'),
  }).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  // Technical Configuration
  aeTitle: z.string().min(1, 'AE Title is required').regex(/^[A-Z0-9_]+$/, 'AE Title must contain only uppercase letters, numbers, and underscores').optional(),
  datastoreId: z.string().min(1, 'Datastore ID is required').optional(),
  // HL7 Configuration (optional)
  hl7Enabled: z.boolean().optional(),
  hl7Endpoint: z.string().optional(),
  hl7Port: z.string().optional(),
  hl7Version: z.string().optional(),
  pacsSystem: z.string().optional(),
})

type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>

export default function EditOrganizationPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = params.id as string
  
  const { data: orgResponse, isLoading } = useOrganization(organizationId)
  const updateOrganization = useUpdateOrganization(organizationId)
  
  const organization = orgResponse?.data

  const form = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: '',
      type: 'hospital',
      primaryContact: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
      },
      status: 'active',
      aeTitle: '',
      datastoreId: '',
      hl7Enabled: false,
      hl7Endpoint: '',
      hl7Port: '7001',
      hl7Version: '2.5',
      pacsSystem: '',
    },
  })

  const hl7Enabled = form.watch('hl7Enabled')

  // Update form when organization data is loaded
  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        type: organization.type,
        primaryContact: organization.primaryContact,
        email: organization.email,
        phone: organization.phone || '',
        address: organization.address || {
          street: '',
          city: '',
          state: '',
          zip: '',
        },
        status: organization.status,
        aeTitle: organization.aeTitle || '',
        datastoreId: organization.datastoreId || '',
        hl7Enabled: organization.hl7Enabled || false,
        hl7Endpoint: organization.hl7Endpoint || '',
        hl7Port: organization.hl7Port || '7001',
        hl7Version: organization.hl7Version || '2.5',
        pacsSystem: organization.pacsSystem || '',
      })
    }
  }, [organization, form])

  const onSubmit = async (data: UpdateOrganizationFormData) => {
    try {
      // Clean up HL7 fields if not enabled
      if (!data.hl7Enabled) {
        delete data.hl7Endpoint
        delete data.hl7Port
        delete data.hl7Version
        delete data.pacsSystem
      }

      await updateOrganization.mutateAsync(data)
      router.push(`/organizations/${organizationId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update organization. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[800px]" />
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Organization not found</p>
        <Button
          variant="outline"
          onClick={() => router.push('/organizations')}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/organizations/${organizationId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Edit Organization</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the organization&apos;s basic details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="St. Mary's Hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="clinic">Clinic</SelectItem>
                          <SelectItem value="imaging_center">Imaging Center</SelectItem>
                          <SelectItem value="private_practice">Private Practice</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="primaryContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact</FormLabel>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@hospital.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="CA" maxLength={2} {...field} />
                      </FormControl>
                      <FormDescription>2-letter state code</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="94105" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Configuration</CardTitle>
              <CardDescription>
                Configure DICOM and integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="aeTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AE Title</FormLabel>
                      <FormControl>
                        <Input placeholder="HOSPITAL_PACS" {...field} />
                      </FormControl>
                      <FormDescription>
                        Application Entity Title for DICOM communication
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="datastoreId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datastore ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ds-hospital-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for data storage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="hl7Enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div>
                      <FormLabel>Enable HL7 Integration</FormLabel>
                      <FormDescription>
                        Configure HL7 interface for order intake
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {hl7Enabled && (
                <div className="space-y-6 rounded-lg border p-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="hl7Endpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HL7 Endpoint</FormLabel>
                          <FormControl>
                            <Input placeholder="hl7.hospital.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hl7Port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HL7 Port</FormLabel>
                          <FormControl>
                            <Input placeholder="7001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hl7Version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HL7 Version</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select HL7 version" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2.3">2.3</SelectItem>
                              <SelectItem value="2.4">2.4</SelectItem>
                              <SelectItem value="2.5">2.5</SelectItem>
                              <SelectItem value="2.6">2.6</SelectItem>
                              <SelectItem value="2.7">2.7</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pacsSystem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PACS System</FormLabel>
                          <FormControl>
                            <Input placeholder="GE PACS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={updateOrganization.isPending}>
              {updateOrganization.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/organizations/${organizationId}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}