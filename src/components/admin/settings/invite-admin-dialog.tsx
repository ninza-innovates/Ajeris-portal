'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { UserPlus, Shield, Eye, Users } from 'lucide-react'

interface InviteAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteAdminDialog({ open, onOpenChange }: InviteAdminDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'VIEWER' as 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Admin Invited Successfully",
        description: `Invitation sent to ${formData.email} with ${formData.role} role.`,
      })
      
      // Reset form and close dialog
      setFormData({ name: '', email: '', role: 'VIEWER' })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleDescriptions = {
    SUPER_ADMIN: {
      icon: Shield,
      title: 'Super Admin',
      description: 'Full system access, can manage other admins',
      color: 'text-red-600',
    },
    ADMIN: {
      icon: Users,
      title: 'Admin',
      description: 'Full access to manage platform, cannot manage admins',
      color: 'text-blue-600',
    },
    VIEWER: {
      icon: Eye,
      title: 'Viewer',
      description: 'Read-only access to admin portal',
      color: 'text-gray-600',
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New Admin User
          </DialogTitle>
          <DialogDescription>
            Send an invitation to add a new internal admin to the Ajeris platform.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@ajeris.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              An invitation email will be sent to this address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Admin Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER') => 
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleDescriptions).map(([key, role]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-start gap-3">
                      <role.icon className={`h-4 w-4 mt-0.5 ${role.color}`} />
                      <div>
                        <div className="font-medium">{role.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> The invited user will receive an email with instructions 
              to set up their account and create a password. They will have access to the 
              admin portal based on the role you assign.
            </p>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}