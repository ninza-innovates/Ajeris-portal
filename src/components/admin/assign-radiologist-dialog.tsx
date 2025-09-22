'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { UserPlus, Search, Stethoscope, Award, MapPin, Clock } from 'lucide-react'
import { useRadiologists } from '@/lib/api/hooks/use-radiologists'
import { Skeleton } from '@/components/ui/skeleton'

interface AssignRadiologistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationName: string
  organizationId: string
}

export function AssignRadiologistDialog({
  open,
  onOpenChange,
  organizationName,
  organizationId,
}: AssignRadiologistDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRadiologists, setSelectedRadiologists] = useState<Set<string>>(new Set())
  const [privileges, setPrivileges] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch available radiologists from API
  const { data: radiologistsData, isLoading } = useRadiologists({ 
    available: true, 
    excludeOrganization: organizationId 
  })

  const availableRadiologists = radiologistsData?.data || []

  const filteredRadiologists = availableRadiologists.filter((rad: any) =>
    rad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rad.specialties?.some((spec: string) => spec.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleRadiologist = (radId: string) => {
    const newSelection = new Set(selectedRadiologists)
    if (newSelection.has(radId)) {
      newSelection.delete(radId)
      const newPrivileges = { ...privileges }
      delete newPrivileges[radId]
      setPrivileges(newPrivileges)
    } else {
      newSelection.add(radId)
      setPrivileges({
        ...privileges,
        [radId]: ['X-Ray'], // Default privilege
      })
    }
    setSelectedRadiologists(newSelection)
  }

  const togglePrivilege = (radId: string, privilege: string) => {
    const currentPrivileges = privileges[radId] || []
    const newPrivileges = currentPrivileges.includes(privilege)
      ? currentPrivileges.filter(p => p !== privilege)
      : [...currentPrivileges, privilege]
    
    setPrivileges({
      ...privileges,
      [radId]: newPrivileges,
    })
  }

  const handleSubmit = async () => {
    if (selectedRadiologists.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one radiologist",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Radiologists Assigned",
        description: `${selectedRadiologists.size} radiologist(s) assigned to ${organizationName}. Credentialing process initiated.`,
      })
      
      setSelectedRadiologists(new Set())
      setPrivileges({})
      setSearchQuery('')
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign radiologists. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const allPrivileges = ['X-Ray', 'CT', 'MRI', 'Ultrasound', 'Mammography', 'Nuclear Medicine', 'PET']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Radiologists to {organizationName}
          </DialogTitle>
          <DialogDescription>
            Search and select radiologists to assign to this organization. 
            Credentialing will be initiated through ModioHealth.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredRadiologists.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? 'No radiologists found matching your search' : 'No available radiologists found'}
              </div>
            ) : (
              filteredRadiologists.map((radiologist: any) => (
                <div
                  key={radiologist.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedRadiologists.has(radiologist.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleRadiologist(radiologist.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedRadiologists.has(radiologist.id)}
                          onCheckedChange={() => toggleRadiologist(radiologist.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <p className="font-medium">{radiologist.name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" />
                              {radiologist.specialties?.join(', ') || 'General Radiology'}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {radiologist.state || radiologist.location || 'Remote'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {radiologist.availability?.status || 'Available'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 ml-7">
                        <Badge variant={radiologist.modioHealthVerified ? 'success' : 'warning'}>
                          {radiologist.modioHealthVerified ? 'ModioHealth Verified' : 'Verification Pending'}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          <Award className="inline h-3 w-3 mr-1" />
                          {radiologist.qualityScore || radiologist.rating || 4.5}/5 • {(radiologist.performance?.totalReads || 0).toLocaleString()} studies
                        </span>
                      </div>

                    {/* Privileges selection */}
                    {selectedRadiologists.has(radiologist.id) && (
                      <div className="mt-3 ml-7 p-3 bg-white rounded-md border">
                        <Label className="text-sm font-medium">Assign Privileges:</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {allPrivileges.map((privilege) => (
                            <label
                              key={privilege}
                              className="flex items-center gap-1.5 text-sm cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                checked={(privileges[radiologist.id] || []).includes(privilege)}
                                onCheckedChange={() => togglePrivilege(radiologist.id, privilege)}
                              />
                              {privilege}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {selectedRadiologists.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>{selectedRadiologists.size} radiologist(s) selected.</strong> 
                {' '}Upon assignment, ModioHealth will be notified to begin the credentialing process.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || selectedRadiologists.size === 0}
          >
            {isSubmitting ? 'Assigning...' : `Assign ${selectedRadiologists.size} Radiologist(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}