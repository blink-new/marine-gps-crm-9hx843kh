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
import { MapPin, List, Plus, Navigation, Anchor, Truck, Search } from 'lucide-react'

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
  tilattu: 'Tilattu',
  tehty: 'Tehty',
  laskutetu: 'Laskutetu',
  valmis: 'Valmis'
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
      tilattu: 'bg-red-500',
      tehty: 'bg-yellow-500',
      laskutetu: 'bg-blue-500',
      valmis: 'bg-green-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      buoy: 'bg-emerald-500',
      pier: 'bg-amber-500',
      transport: 'bg-purple-500'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="gradient-header text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Marine GPS CRM</h1>
          <p className="text-blue-100">Track and manage marine operations with precision</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Search and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-600">
            Total Events: <span className="font-semibold text-blue-600">{filteredEvents.length}</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
          </TabsList>

          {/* Map View */}
          <TabsContent value="map" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Interactive Map
                </CardTitle>
                <p className="text-sm text-gray-600">Click anywhere on the map to create a new event</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
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
                          <div className="p-2 min-w-[200px]">
                            <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getTypeColor(event.type)} text-white`}>
                                  {typeLabels[event.type]}
                                </Badge>
                                <Badge className={`${getStatusColor(event.status)} text-white`}>
                                  {statusLabels[event.status]}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                <strong>Coordinates:</strong> {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Created:</strong> {event.createdAt.toLocaleDateString()}
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
          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-4">
              {filteredEvents.map((event) => {
                const TypeIcon = typeIcons[event.type]
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${getTypeColor(event.type)} text-white`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{event.name}</h3>
                            <p className="text-sm text-gray-600">
                              {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {event.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getTypeColor(event.type)} text-white`}>
                            {typeLabels[event.type]}
                          </Badge>
                          <Badge className={`${getStatusColor(event.status)} text-white`}>
                            {statusLabels[event.status]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Create New Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedCoords && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Coordinates:</strong> {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"
                placeholder="Enter event name..."
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={newEventType} onValueChange={(value: 'buoy' | 'pier' | 'transport') => setNewEventType(value)}>
                <SelectTrigger>
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
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateEvent}
                disabled={!newEventName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
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