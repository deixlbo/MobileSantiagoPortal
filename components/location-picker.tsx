"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { MapPin, Navigation, Loader2, X, Check } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./location-map"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  )
})

interface LocationPickerProps {
  value: string
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
}

export function LocationPicker({ value, onChange, placeholder = "e.g., Purok 3, malapit sa chapel" }: LocationPickerProps) {
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [tempLocation, setTempLocation] = useState(value)
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null)

  // AI-Assisted Barangay Santiago Portal approximate center (San Antonio, Zambales)
  const defaultCenter = { lat: 15.1345, lng: 120.0456 }

  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Hindi supported ang geolocation sa iyong browser.")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setSelectedCoords({ lat: latitude, lng: longitude })
        setHasLocationPermission(true)
        
        // Try to reverse geocode the location
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          
          if (data.display_name) {
            // Extract relevant parts of the address
            const address = data.address
            let locationText = ""
            
            if (address.road) locationText += address.road
            if (address.neighbourhood) locationText += locationText ? `, ${address.neighbourhood}` : address.neighbourhood
            if (address.suburb) locationText += locationText ? `, ${address.suburb}` : address.suburb
            if (address.village || address.town) {
              const area = address.village || address.town
              locationText += locationText ? `, ${area}` : area
            }
            
            // If we couldn't extract specific parts, use a shorter version of display_name
            if (!locationText) {
              const parts = data.display_name.split(",").slice(0, 3)
              locationText = parts.join(",")
            }
            
            setTempLocation(locationText || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`)
          } else {
            setTempLocation(`AI-Assisted Barangay Santiago Portal - Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`)
          }
        } catch {
          setTempLocation(`AI-Assisted Barangay Santiago Portal - Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`)
        }
        
        setIsLoadingLocation(false)
        setIsMapOpen(true)
      },
      (error) => {
        setIsLoadingLocation(false)
        setHasLocationPermission(false)
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Hindi na-allow ang access sa lokasyon. Maaari mong i-type ang lokasyon o i-pin sa mapa.")
            setIsMapOpen(true)
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Hindi available ang impormasyon ng lokasyon.")
            setIsMapOpen(true)
            break
          case error.TIMEOUT:
            setLocationError("Nag-timeout ang request para sa lokasyon.")
            setIsMapOpen(true)
            break
          default:
            setLocationError("May error sa pagkuha ng lokasyon.")
            setIsMapOpen(true)
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedCoords({ lat, lng })
    
    // Reverse geocode the clicked location
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    )
      .then(res => res.json())
      .then(data => {
        if (data.display_name) {
          const address = data.address
          let locationText = ""
          
          if (address.road) locationText += address.road
          if (address.neighbourhood) locationText += locationText ? `, ${address.neighbourhood}` : address.neighbourhood
          if (address.suburb) locationText += locationText ? `, ${address.suburb}` : address.suburb
          
          if (!locationText) {
            const parts = data.display_name.split(",").slice(0, 3)
            locationText = parts.join(",")
          }
          
          setTempLocation(locationText || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
        } else {
          setTempLocation(`AI-Assisted Barangay Santiago Portal - Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
        }
      })
      .catch(() => {
        setTempLocation(`AI-Assisted Barangay Santiago Portal - Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
      })
  }, [])

  const handleConfirmLocation = () => {
    onChange(tempLocation, selectedCoords || undefined)
    setIsMapOpen(false)
    setLocationError(null)
  }

  const handleOpenMap = () => {
    setTempLocation(value)
    setLocationError(null)
    getCurrentLocation()
  }

  const handleManualOpen = () => {
    setTempLocation(value)
    setLocationError(null)
    setSelectedCoords(null)
    setIsMapOpen(true)
  }

  return (
    <div className="space-y-2">
      <Label>Lokasyon ng Insidente</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleOpenMap}
          disabled={isLoadingLocation}
          title="Gamitin ang kasalukuyang lokasyon at mapa"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleManualOpen}
          title="Buksan ang mapa para mag-pin"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        I-click ang navigation icon para gamitin ang iyong lokasyon, o ang pin icon para mag-pin sa mapa.
      </p>

      {/* Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Piliin ang Lokasyon ng Insidente
            </DialogTitle>
            <DialogDescription>
              I-click sa mapa para i-pin ang eksaktong lokasyon ng insidente, o i-type ang address sa ibaba.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {locationError && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                {locationError}
              </div>
            )}
            
            {/* Map */}
            <div className="rounded-lg overflow-hidden border">
              <MapComponent
                center={selectedCoords || defaultCenter}
                markerPosition={selectedCoords}
                onMapClick={handleMapClick}
                zoom={selectedCoords ? 17 : 14}
              />
            </div>
            
            {/* Location Input */}
            <div className="space-y-2">
              <Label>Detalye ng Lokasyon</Label>
              <Input
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                placeholder="e.g., Purok 3, malapit sa Santiago Chapel"
              />
              <p className="text-xs text-muted-foreground">
                Maaari mong i-edit ang lokasyon o magdagdag ng mas detalyadong description.
              </p>
            </div>

            {selectedCoords && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Napili ang lokasyon:</span>
                </div>
                <p className="mt-1 text-xs">
                  Coordinates: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMapOpen(false)}
              className="w-full sm:w-auto"
            >
              Kanselahin
            </Button>
            <Button
              type="button"
              onClick={handleConfirmLocation}
              disabled={!tempLocation.trim()}
              className="w-full sm:w-auto"
            >
              <Check className="mr-2 h-4 w-4" />
              Kumpirmahin ang Lokasyon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
