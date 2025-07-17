import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MarineEvent } from '../types/marine'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom pin icons
const createCustomIcon = (type: string, status: string) => {
  const pinColors = {
    buoy: '#10b981',
    pier: '#f59e0b',
    transport: '#8b5cf6'
  }
  
  const statusColors = {
    tilattu: '#ef4444',
    tehty: '#f59e0b',
    laskutetu: '#3b82f6',
    valmis: '#10b981'
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center" 
             style="background-color: ${pinColors[type as keyof typeof pinColors]}">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${statusColors[status as keyof typeof statusColors]}">
          </div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

interface MapViewProps {
  events: MarineEvent[]
  onEventClick: (event: MarineEvent) => void
}

function MapController({ events }: { events: MarineEvent[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (events.length > 0) {
      const group = new L.FeatureGroup(
        events.map(event => 
          L.marker([event.latitude, event.longitude])
        )
      )
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }, [events, map])
  
  return null
}

export function MapView({ events, onEventClick }: MapViewProps) {
  const mapRef = useRef<L.Map>(null)

  // Default center (Helsinki, Finland)
  const defaultCenter: [number, number] = [60.1699, 24.9384]

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController events={events} />
        
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={createCustomIcon(event.pinType, event.status)}
            eventHandlers={{
              click: () => onEventClick(event)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{event.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Type: {event.pinType}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: {event.status}
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.coordinates}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}