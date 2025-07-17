export interface MarineEvent {
  id: string
  name: string
  coordinates: string
  latitude: number
  longitude: number
  pinType: 'buoy' | 'pier' | 'transport'
  status: 'tilattu' | 'tehty' | 'laskutetu' | 'valmis'
  createdAt: string
  userId: string
}

export type ViewMode = 'map' | 'list'

export interface MapPin {
  id: string
  position: [number, number]
  type: 'buoy' | 'pier' | 'transport'
  status: 'tilattu' | 'tehty' | 'laskutetu' | 'valmis'
  name: string
}