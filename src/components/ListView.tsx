import { MarineEvent } from '../types/marine'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { MapPin, Calendar, Navigation } from 'lucide-react'

interface ListViewProps {
  events: MarineEvent[]
  onEventClick: (event: MarineEvent) => void
}

const statusLabels = {
  tilattu: 'Ordered',
  tehty: 'Done',
  laskutetu: 'Invoiced',
  valmis: 'Ready'
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

export function ListView({ events, onEventClick }: ListViewProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <MapPin className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No marine events found</p>
        <p className="text-sm">Add your first event to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card 
          key={event.id} 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => onEventClick(event)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`${pinTypeColors[event.pinType]} text-white`}
                  >
                    {pinTypeLabels[event.pinType]}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Navigation className="h-4 w-4" />
                    <span>{event.coordinates}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Lat: {event.latitude.toFixed(6)}, Lng: {event.longitude.toFixed(6)}
                </div>
              </div>
              
              <Badge 
                variant="secondary"
                className={`${statusColors[event.status]} text-white ml-4`}
              >
                {statusLabels[event.status]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}