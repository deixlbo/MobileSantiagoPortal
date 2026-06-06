"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Map,
  MapPin,
  Building2,
  AlertTriangle,
  Phone,
  Navigation,
  Search,
  ZoomIn,
  ZoomOut,
  Layers
} from "lucide-react"

interface Location {
  id: string
  name: string
  type: "landmark" | "service" | "hazard" | "facility"
  coordinates: { lat: number; lng: number }
  address: string
  phone?: string
  description: string
  image?: string
}

const locations: Location[] = [
  {
    id: "1",
    name: "Barangay Hall",
    type: "facility",
    coordinates: { lat: 15.4909, lng: 119.9663 },
    address: "San Antonio, Zambales",
    phone: "(047) 123-4567",
    description: "Main office for barangay services and administration",
    image: "🏛️"
  },
  {
    id: "2",
    name: "Health Center",
    type: "service",
    coordinates: { lat: 15.4920, lng: 119.9670 },
    address: "Purok 1, San Antonio",
    phone: "(047) 123-4568",
    description: "Community health services and vaccination center",
    image: "🏥"
  },
  {
    id: "3",
    name: "Community Center",
    type: "facility",
    coordinates: { lat: 15.4900, lng: 119.9650 },
    address: "Purok 2, San Antonio",
    phone: "(047) 123-4569",
    description: "Multi-purpose venue for community events",
    image: "🏢"
  },
  {
    id: "4",
    name: "Main Market",
    type: "landmark",
    coordinates: { lat: 15.4915, lng: 119.9680 },
    address: "Market Street, San Antonio",
    description: "Public market for residents",
    image: "🏬"
  },
  {
    id: "5",
    name: "Broken Street Light",
    type: "hazard",
    coordinates: { lat: 15.4925, lng: 119.9675 },
    address: "Purok 3, Main Road",
    description: "Street light reported broken - Maintenance scheduled",
    image: "⚠️"
  }
]

export function GISBarangayMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [zoomLevel, setZoomLevel] = useState(13)
  const [mapStyle, setMapStyle] = useState<"satellite" | "street" | "terrain">("street")

  const filteredLocations = locations.filter((loc) => {
    const typeMatch = filterType === "all" || loc.type === filterType
    const searchMatch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    return typeMatch && searchMatch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "facility":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "service":
        return "bg-green-100 text-green-800 border-green-300"
      case "landmark":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "hazard":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "facility":
        return <Building2 className="h-4 w-4" />
      case "service":
        return <MapPin className="h-4 w-4" />
      case "hazard":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">GIS Barangay Map</h2>
          <p className="text-muted-foreground">Interactive map of community locations and services</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
          <Map className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">GIS Enabled</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl border border-slate-200/70 overflow-hidden">
              <CardContent className="p-0 relative">
                {/* Simulated Map */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 aspect-video w-full flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 800 600">
                    {/* Map background */}
                    <rect width="800" height="600" fill="#e8f4f8" />
                    
                    {/* Grid */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 100}
                        y1="0"
                        x2={i * 100}
                        y2="600"
                        stroke="#e0e7ff"
                        strokeWidth="1"
                      />
                    ))}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 100}
                        x2="800"
                        y2={i * 100}
                        stroke="#e0e7ff"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Roads */}
                    <line x1="200" y1="0" x2="200" y2="600" stroke="#e2b547" strokeWidth="8" />
                    <line x1="0" y1="250" x2="800" y2="250" stroke="#e2b547" strokeWidth="8" />

                    {/* Locations as markers */}
                    {filteredLocations.map((loc, idx) => {
                      const x = 100 + Math.random() * 600
                      const y = 100 + Math.random() * 400
                      const isSelected = selectedLocation?.id === loc.id
                      const size = isSelected ? 40 : 30

                      return (
                        <g
                          key={loc.id}
                          onClick={() => setSelectedLocation(loc)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Marker circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r={size}
                            fill={isSelected ? "#3b82f6" : "#10b981"}
                            opacity="0.8"
                          />
                          {/* Marker text */}
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dy="0.3em"
                            fontSize="20"
                            fontWeight="bold"
                          >
                            {loc.image}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 rounded-lg"
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 20))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 rounded-lg"
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 5))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0 rounded-lg"
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>

                {/* Map Style Selector */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {(["street", "satellite", "terrain"] as const).map((style) => (
                    <Button
                      key={style}
                      size="sm"
                      variant={mapStyle === style ? "default" : "outline"}
                      onClick={() => setMapStyle(style)}
                      className="rounded-lg"
                    >
                      {style}
                    </Button>
                  ))}
                </div>

                {/* Location Info Popup */}
                {selectedLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg border border-slate-200/70 p-4 w-64"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selectedLocation.image}</span>
                        <div>
                          <p className="font-semibold text-sm">{selectedLocation.name}</p>
                          <Badge variant="outline" className="text-xs capitalize mt-1">
                            {selectedLocation.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedLocation.address}</p>
                      {selectedLocation.phone && (
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3 w-3" />
                          {selectedLocation.phone}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar - Locations List */}
        <div className="space-y-4">
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-lg"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="facility">Facilities</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="landmark">Landmarks</SelectItem>
                  <SelectItem value="hazard">Hazards</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setSelectedLocation(location)}
                      className={`w-full p-3 rounded-2xl border-2 text-left transition-all ${
                        selectedLocation?.id === location.id
                          ? "border-primary bg-primary/5"
                          : `border-slate-200/70 ${getTypeColor(location.type)}`
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{location.image}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm line-clamp-1">{location.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{location.address}</p>
                        </div>
                      </div>
                    </button>
                  </DialogTrigger>

                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{location.image}</span>
                        {location.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">TYPE</p>
                        <Badge className="capitalize">{location.type}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">ADDRESS</p>
                        <p className="text-sm">{location.address}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">DESCRIPTION</p>
                        <p className="text-sm">{location.description}</p>
                      </div>
                      {location.phone && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">CONTACT</p>
                          <a href={`tel:${location.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {location.phone}
                          </a>
                        </div>
                      )}
                      <Button className="w-full rounded-lg">
                        <Navigation className="mr-2 h-4 w-4" /> Get Directions
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
