import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import type { Organization } from '@/lib/api/types'

interface DeleteOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: Organization | null
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteOrganizationDialog({
  open,
  onOpenChange,
  organization,
  onConfirm,
  isDeleting = false,
}: DeleteOrganizationDialogProps) {
  if (!organization) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Delete Organization</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            Are you sure you want to delete <strong>{organization.name}</strong>? 
            This action cannot be undone and will:
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Remove all users associated with this organization</li>
            <li>Delete all historical data and reports</li>
            <li>Cancel any active integrations</li>
            <li>Remove billing information</li>
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}