"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface LocationMapProps {
  center: { lat: number; lng: number }
  markerPosition: { lat: number; lng: number } | null
  onMapClick: (lat: number, lng: number) => void
  zoom?: number
}

export default function LocationMap({ center, markerPosition, onMapClick, zoom = 14 }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize the map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom)
    mapInstanceRef.current = map

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Custom marker icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #16a34a;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    // Add marker if position exists
    if (markerPosition) {
      markerRef.current = L.marker([markerPosition.lat, markerPosition.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup("Lokasyon ng insidente")
    }

    // Handle map clicks
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      
      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup("Lokasyon ng insidente")
      }
      
      onMapClick(lat, lng)
    })

    // Cleanup
    return () => {
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom)
    }
  }, [center, zoom])

  // Update marker position when it changes
  useEffect(() => {
    if (mapInstanceRef.current && markerPosition) {
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #16a34a;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })

      if (markerRef.current) {
        markerRef.current.setLatLng([markerPosition.lat, markerPosition.lng])
      } else {
        markerRef.current = L.marker([markerPosition.lat, markerPosition.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup("Lokasyon ng insidente")
      }
    }
  }, [markerPosition])

  return (
    <div 
      ref={mapRef} 
      className="h-[300px] w-full"
      style={{ zIndex: 1 }}
    />
  )
}
