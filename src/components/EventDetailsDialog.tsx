import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { MapPin, Calendar, Navigation, Edit, Trash2 } from 'lucide-react'
import { MarineEvent } from '../types/marine'

interface EventDetailsDialogProps {
  event: MarineEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (event: MarineEvent) => void
  onDelete: (eventId: string) => void
}

const statusLabels = {
  tilattu: 'Tilattu (Ordered)',
  tehty: 'Tehty (Done)',
  laskutetu: 'Laskutetu (Invoiced)',
  valmis: 'Valmis (Ready)'
}

const statusColors = {
  tilattu: 'bg-red-500',
  tehty: 'bg-amber-500',
  laskutetu: 'bg-blue-500',
  valmis: 'bg-green-500'
}

const pinTypeLabels = {
  buoy: 'Buoy',
  pier: 'Pier',
  transport: 'Transport'
}

const pinTypeColors = {
  buoy: 'bg-emerald-500',
  pier: 'bg-amber-500',
  transport: 'bg-purple-500'
}

export function EventDetailsDialog({ event, open, onOpenChange, onEdit, onDelete }: EventDetailsDialogProps) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {event.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${pinTypeColors[event.pinType]} text-white`}
            >
              {pinTypeLabels[event.pinType]}
            </Badge>
            <Badge 
              variant="secondary"
              className={`${statusColors[event.status]} text-white`}
            >
              {statusLabels[event.status]}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Coordinates</p>
                <p className="text-muted-foreground">{event.coordinates}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Precise Location</p>
                <p className="text-muted-foreground">
                  Lat: {event.latitude.toFixed(6)}, Lng: {event.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">
                  {new Date(event.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onEdit(event)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(event.id)
                onOpenChange(false)
              }}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}