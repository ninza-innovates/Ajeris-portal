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
import { Calendar } from '@/components/ui/calendar'
import { Radiologist } from '@/types/radiologist'
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, Award } from 'lucide-react'
import { useUpdateRadiologist } from '@/lib/api/hooks/use-radiologists'
import { useStudies } from '@/lib/api/hooks/use-studies'
import { StudiesService } from '@/lib/api/services'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'

interface EditRadiologistDialogProps {
  radiologist: Radiologist
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditRadiologistDialog({ radiologist, open, onOpenChange }: EditRadiologistDialogProps) {
  const [formData, setFormData] = useState({
    name: radiologist.name,
    email: radiologist.email,
    phone: radiologist.phone,
    specialties: radiologist.specialties.join(', '),
  })

  const updateRadiologist = useUpdateRadiologist()

  const handleSave = async () => {
    try {
      await updateRadiologist.mutateAsync({
        id: radiologist.id,
        data: {
          ...formData,
          specialties: formData.specialties.split(',').map(s => s.trim()),
        },
      })
      toast({
        title: 'Success',
        description: 'Radiologist information updated successfully',
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update radiologist information',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Radiologist Information</DialogTitle>
          <DialogDescription>
            Update the radiologist&apos;s basic information
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="specialties">Specialties (comma-separated)</Label>
            <Input
              id="specialties"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              placeholder="e.g., Neuroradiology, Musculoskeletal"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={updateRadiologist.isPending}>
            {updateRadiologist.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ScheduleDialogProps {
  radiologist: Radiologist
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleDialog({ radiologist, open, onOpenChange }: ScheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Schedule - {radiologist.name}</DialogTitle>
          <DialogDescription>
            View and manage the radiologist&apos;s schedule
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Current Availability</h4>
                <Badge variant={radiologist.availability.status === 'Available' ? 'success' : 'secondary'}>
                  {radiologist.availability.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Working Hours</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {Object.entries(radiologist.availability.schedule)
                      .filter(([_, time]) => time !== null)
                      .map(([day, time]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${time?.start}-${time?.end}`)
                      .join(', ')}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Next Available</h4>
                <p className="text-sm text-muted-foreground">{radiologist.availability.nextAvailable}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button>Update Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface AssignStudiesDialogProps {
  radiologist: Radiologist
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignStudiesDialog({ radiologist, open, onOpenChange }: AssignStudiesDialogProps) {
  const [selectedStudies, setSelectedStudies] = useState<string[]>([])
  
  // Fetch unassigned studies
  const { data: studiesData, isLoading } = useStudies({ status: 'unassigned' })
  const availableStudies = studiesData?.data || []

  const handleAssign = async () => {
    try {
      // Assign each selected study to the radiologist
      await Promise.all(
        selectedStudies.map((studyId) =>
          StudiesService.reassignStudy(studyId, {
            radiologistId: radiologist.id,
            reason: 'Assigned from admin portal',
          })
        )
      )
      
      toast({
        title: 'Success',
        description: `${selectedStudies.length} studies assigned to ${radiologist.name}`,
      })
      setSelectedStudies([])
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign studies',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Studies to {radiologist.name}</DialogTitle>
          <DialogDescription>
            Select studies to assign to this radiologist
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Current Workload</p>
                <p className="text-2xl font-bold">{radiologist.workload.currentQueue}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-medium">Priority Studies</p>
                <p className="text-2xl font-bold text-orange-600">{radiologist.workload.priorityStudies}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Available Studies</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : availableStudies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No unassigned studies available
                  </div>
                ) : (
                  availableStudies.map((study: any) => (
                    <div key={study.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={study.id}
                        checked={selectedStudies.includes(study.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudies([...selectedStudies, study.id])
                          } else {
                            setSelectedStudies(selectedStudies.filter(id => id !== study.id))
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <label htmlFor={study.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{study.description || study.studyDescription}</p>
                            <p className="text-sm text-muted-foreground">
                              Patient: {study.patientName} ({study.patientId || study.mrn}) • {study.modality}
                            </p>
                          </div>
                          <Badge variant={study.priority === 'STAT' ? 'destructive' : study.priority === 'Urgent' ? 'warning' : 'secondary'}>
                            {study.priority}
                          </Badge>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAssign} disabled={selectedStudies.length === 0}>
            Assign {selectedStudies.length} {selectedStudies.length === 1 ? 'Study' : 'Studies'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface AccountStatusDialogProps {
  radiologist: Radiologist
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountStatusDialog({ radiologist, open, onOpenChange }: AccountStatusDialogProps) {
  const isActive = radiologist.status === 'Active'
  const action = isActive ? 'suspend' : 'activate'

  const handleConfirm = () => {
    console.log(`${action} account for:`, radiologist.name)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Suspend' : 'Activate'} Radiologist Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action} the account for <strong>{radiologist.name}</strong>?
            {isActive && ' This will prevent them from accessing the system and receiving new study assignments.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={isActive ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            {isActive ? 'Suspend Account' : 'Activate Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}