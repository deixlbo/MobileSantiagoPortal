import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Loader2 } from "lucide-react";

interface MapPickerProps {
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [hint, setHint] = useState("Click on the map to set incident location");

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    import("leaflet").then(L => {
      // Fix default marker icon for Vite
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [15.4308, 120.0534],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      leafletMap.current = map;

      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }

        setGeocoding(true);
        setHint("Getting address...");

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          onChange(addr, lat, lng);
          setHint(`Location set: ${addr.split(",").slice(0, 3).join(", ")}`);
        } catch {
          const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          onChange(fallback, lat, lng);
          setHint(`Coordinates: ${fallback}`);
        } finally {
          setGeocoding(false);
        }
      });
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="w-full h-56 rounded-xl border border-border overflow-hidden z-0 relative"
        style={{ zIndex: 0 }}
      />
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        {geocoding
          ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          : <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
        }
        <span className={value ? "text-foreground font-medium" : ""}>{hint}</span>
      </div>
      {value && (
        <div className="px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-xs text-foreground">
          <span className="text-muted-foreground">Selected: </span>{value.split(",").slice(0, 4).join(", ")}
        </div>
      )}
    </div>
  );
}
