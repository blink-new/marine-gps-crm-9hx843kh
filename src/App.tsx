import { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon, LatLng } from 'leaflet'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { MapPin, List, Plus, Navigation, Anchor, Truck, Search, Filter } from 'lucide-react'

interface MarineEvent {
  id: string
  name: string
  type: 'buoy' | 'pier' | 'transport'
  status: 'tilattu' | 'tehty' | 'laskutetu' | 'valmis'
  latitude: number
  longitude: number
  createdAt: Date
}

const statusLabels = {
  tilattu: 'Ordered',
  tehty: 'Completed',
  laskutetu: 'Invoiced',
  valmis: 'Ready'
}

const typeLabels = {
  buoy: 'Buoy',
  pier: 'Pier',
  transport: 'Transport'
}

const typeIcons = {
  buoy: Anchor,
  pier: Navigation,
  transport: Truck
}

// Sample data
const initialEvents: MarineEvent[] = [
  {
    id: '1',
    name: 'Harbor Buoy A1',
    type: 'buoy',
    status: 'valmis',
    latitude: 60.1699,
    longitude: 24.9384,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Main Pier',
    type: 'pier',
    status: 'tehty',
    latitude: 60.1609,
    longitude: 24.9484,
    createdAt: new Date('2024-01-16')
  },
  {
    id: '3',
    name: 'Supply Transport',
    type: 'transport',
    status: 'tilattu',
    latitude: 60.1799,
    longitude: 24.9284,
    createdAt: new Date('2024-01-17')
  }
]

function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    }
  })
  return null
}

function App() {
  const [events, setEvents] = useState<MarineEvent[]>(initialEvents)
  const [activeTab, setActiveTab] = useState('map')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCoords, setSelectedCoords] = useState<LatLng | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newEventName, setNewEventName] = useState('')
  const [newEventType, setNewEventType] = useState<'buoy' | 'pier' | 'transport'>('buoy')

  const mapRef = useRef<any>(null)

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    typeLabels[event.type].toLowerCase().includes(searchTerm.toLowerCase()) ||
    statusLabels[event.status].toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMapClick = (latlng: LatLng) => {
    setSelectedCoords(latlng)
    setIsCreateModalOpen(true)
  }

  const handleCreateEvent = () => {
    if (!selectedCoords || !newEventName.trim()) return

    const newEvent: MarineEvent = {
      id: Date.now().toString(),
      name: newEventName.trim(),
      type: newEventType,
      status: 'tilattu',
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng,
      createdAt: new Date()
    }

    setEvents(prev => [...prev, newEvent])
    setIsCreateModalOpen(false)
    setNewEventName('')
    setNewEventType('buoy')
    setSelectedCoords(null)
  }

  const createCustomIcon = (type: string, status: string) => {
    const colors = {
      buoy: '#059669',
      pier: '#d97706',
      transport: '#7c3aed'
    }

    const statusColors = {
      tilattu: '#dc2626',
      tehty: '#d97706', 
      laskutetu: '#2563eb',
      valmis: '#059669'
    }

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 12 12 20 12 20s12-8 12-20c0-6.6-5.4-12-12-12z" fill="${colors[type as keyof typeof colors]}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="${statusColors[status as keyof typeof statusColors]}"/>
        </svg>
      `)}`,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32]
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      tilattu: 'bg-red-500 text-white',
      tehty: 'bg-amber-500 text-white',
      laskutetu: 'bg-blue-500 text-white',
      valmis: 'bg-emerald-500 text-white'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500 text-white'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      buoy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pier: 'bg-amber-100 text-amber-700 border-amber-200',
      transport: 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Marine GPS CRM</h1>
              <p className="text-sm text-muted-foreground mt-1">Track and manage marine operations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                {filteredEvents.length} events
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 border-0 bg-muted/50 focus:bg-background"
            />
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm h-9 p-1 bg-muted/50">
            <TabsTrigger value="map" className="flex items-center gap-2 h-7 text-sm">
              <MapPin className="w-4 h-4" />
              Map
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2 h-7 text-sm">
              <List className="w-4 h-4" />
              List
            </TabsTrigger>
          </TabsList>

          {/* Map View */}
          <TabsContent value="map" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="h-[600px] w-full rounded-lg overflow-hidden">
                  <MapContainer
                    center={[60.1699, 24.9384]}
                    zoom={13}
                    className="h-full w-full"
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {filteredEvents.map((event) => (
                      <Marker
                        key={event.id}
                        position={[event.latitude, event.longitude]}
                        icon={createCustomIcon(event.type, event.status)}
                      >
                        <Popup>
                          <div className="p-3 min-w-[200px]">
                            <h3 className="font-medium text-base mb-3">{event.name}</h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getTypeColor(event.type)}>
                                  {typeLabels[event.type]}
                                </Badge>
                                <Badge className={getStatusColor(event.status)}>
                                  {statusLabels[event.status]}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {event.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="mt-6">
            <div className="space-y-3">
              {filteredEvents.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium text-lg mb-2">No events found</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      {searchTerm ? 'Try adjusting your search terms' : 'Click "Add Event" to create your first marine event'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredEvents.map((event) => {
                  const TypeIcon = typeIcons[event.type]
                  return (
                    <Card key={event.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-lg ${getTypeColor(event.type)} border`}>
                              <TypeIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-medium text-base">{event.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(event.type)}>
                              {typeLabels[event.type]}
                            </Badge>
                            <Badge className={getStatusColor(event.status)}>
                              {statusLabels[event.status]}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {selectedCoords && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Location:</span> {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="event-name" className="text-sm font-medium">Event Name</Label>
              <Input
                id="event-name"
                placeholder="Enter event name..."
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type" className="text-sm font-medium">Event Type</Label>
              <Select value={newEventType} onValueChange={(value: 'buoy' | 'pier' | 'transport') => setNewEventType(value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buoy">
                    <div className="flex items-center gap-2">
                      <Anchor className="w-4 h-4" />
                      Buoy
                    </div>
                  </SelectItem>
                  <SelectItem value="pier">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      Pier
                    </div>
                  </SelectItem>
                  <SelectItem value="transport">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Transport
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 h-9"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateEvent}
                disabled={!newEventName.trim()}
                className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App