"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getAssetAgeLabel } from "@/lib/asset-utils"
import { CalendarDays, Package, Search } from "lucide-react"

type ResidentAsset = {
  id: string
  name: string
  category?: string
  description?: string
  location?: string
  condition?: string
  acquisition_date?: string | null
  status?: string
}

const categoryLabels: Record<string, string> = {
  vehicle: "Vehicle",
  equipment: "Equipment",
  furniture: "Furniture",
  electronics: "Electronics",
  infrastructure: "Infrastructure",
}

export default function ResidentAssetsPage() {
  const [assets, setAssets] = useState<ResidentAsset[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await fetch("/api/assets")
        if (!response.ok) throw new Error("Failed to load assets")
        const data = await response.json()
        setAssets(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error loading resident assets:", error)
        setAssets([])
      } finally {
        setLoading(false)
      }
    }

    loadAssets()
  }, [])

  const filteredAssets = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return assets

    return assets.filter((asset) => {
      const haystack = [asset.name, asset.category, asset.description, asset.location, asset.condition]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [assets, query])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Barangay Assets</h1>
        <p className="text-sm text-muted-foreground">View barangay equipment and facilities with their age information.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          className="pl-10"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading ? (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">Loading assets...</div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No assets found</h3>
          <p className="text-muted-foreground">Try another search term or check back later.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{asset.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {categoryLabels[asset.category || ""] || asset.category || "Asset"}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {asset.condition || "Good"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {asset.description ? <p className="text-muted-foreground">{asset.description}</p> : null}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{asset.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>Acquired: {asset.acquisition_date ? new Date(asset.acquisition_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not available"}</span>
                </div>
                <div className="rounded-md bg-muted/70 p-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Asset age</p>
                  <p className="mt-1 font-semibold text-foreground">{getAssetAgeLabel(asset.acquisition_date)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
