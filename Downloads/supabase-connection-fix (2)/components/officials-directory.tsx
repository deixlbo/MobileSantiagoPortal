'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Loader } from 'lucide-react'

interface Official {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  image: string | null
  address: string
  officeHours: {
    start: string
    end: string
    days: string
  }
  isAvailable: boolean
}

export default function OfficialsDirectory() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const response = await fetch('/api/officials/public?limit=12')
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
        const result = await response.json()
        if (result.success) {
          setOfficials(result.data)
        } else {
          setError('Failed to load officials')
        }
      } catch (err) {
        console.error('[v0] Officials fetch error:', err)
        setError('Error loading officials')
      } finally {
        setLoading(false)
      }
    }
    fetchOfficials()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <section className="space-y-8 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Barangay Officials</h2>
        <p className="text-muted-foreground">Meet our dedicated officials serving the community</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {officials.map(official => (
          <div
            key={official.id}
            className="group rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden">
              {official.image ? (
                <Image
                  src={official.image}
                  alt={official.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-4xl font-bold text-emerald-200">
                    {official.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              {official.isAvailable && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Available
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{official.name}</h3>
                <p className="text-sm text-emerald-600 font-medium">{official.position}</p>
                {official.department && (
                  <p className="text-xs text-muted-foreground">{official.department}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 border-t border-border pt-3">
                {official.email && (
                  <a
                    href={`mailto:${official.email}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-600 transition-colors"
                  >
                    <Mail size={14} />
                    <span className="truncate">{official.email}</span>
                  </a>
                )}
                {official.phone && (
                  <a
                    href={`tel:${official.phone}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-600 transition-colors"
                  >
                    <Phone size={14} />
                    <span>{official.phone}</span>
                  </a>
                )}
                {official.address && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{official.address}</span>
                  </div>
                )}
              </div>

              {/* Office Hours */}
              {official.officeHours?.start && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground">Office Hours</p>
                  <p className="text-xs text-muted-foreground">
                    {official.officeHours.start} - {official.officeHours.end}
                  </p>
                  <p className="text-xs text-muted-foreground">{official.officeHours.days}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {officials.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No officials available
        </div>
      )}
    </section>
  )
}
