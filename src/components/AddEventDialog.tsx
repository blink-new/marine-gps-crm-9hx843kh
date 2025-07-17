import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus } from 'lucide-react'
import { MarineEvent } from '../types/marine'

interface AddEventDialogProps {
  onAddEvent: (event: Omit<MarineEvent, 'id' | 'userId' | 'createdAt'>) => void
}

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    coordinates: '',
    latitude: '',
    longitude: '',
    pinType: '' as 'buoy' | 'pier' | 'transport' | '',
    status: '' as 'tilattu' | 'tehty' | 'laskutetu' | 'valmis' | ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.coordinates || !formData.latitude || !formData.longitude || !formData.pinType || !formData.status) {
      return
    }

    onAddEvent({
      name: formData.name,
      coordinates: formData.coordinates,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      pinType: formData.pinType,
      status: formData.status
    })

    // Reset form
    setFormData({
      name: '',
      coordinates: '',
      latitude: '',
      longitude: '',
      pinType: '',
      status: ''
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-header text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Marine Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter event name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinates">Coordinates</Label>
            <Input
              id="coordinates"
              value={formData.coordinates}
              onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
              placeholder="e.g., 60.1699, 24.9384"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="60.1699"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="24.9384"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinType">Pin Type</Label>
            <Select value={formData.pinType} onValueChange={(value: 'buoy' | 'pier' | 'transport') => setFormData({ ...formData, pinType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select pin type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buoy">Buoy</SelectItem>
                <SelectItem value="pier">Pier</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'tilattu' | 'tehty' | 'laskutetu' | 'valmis') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tilattu">Tilattu (Ordered)</SelectItem>
                <SelectItem value="tehty">Tehty (Done)</SelectItem>
                <SelectItem value="laskutetu">Laskutetu (Invoiced)</SelectItem>
                <SelectItem value="valmis">Valmis (Ready)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-header text-white">
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}