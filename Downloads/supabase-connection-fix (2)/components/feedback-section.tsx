'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Loader } from 'lucide-react'

interface Feedback {
  id: string
  rating: number
  message: string
  residentName: string
  residentImage: string | null
  date: string
}

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback/public?limit=6')
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
        const result = await response.json()
        if (result.success) {
          setFeedback(result.data)
        } else {
          setError('Failed to load feedback')
        }
      } catch (err) {
        console.error('[v0] Feedback fetch error:', err)
        setError('Error loading feedback')
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
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
        <h2 className="text-3xl font-bold text-foreground">Resident Feedback</h2>
        <p className="text-muted-foreground">What residents say about our services</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedback.map(item => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>

            {/* Message */}
            <p className="text-sm text-foreground mb-4 line-clamp-3">{item.message}</p>

            {/* Resident Info */}
            <div className="flex items-center gap-3">
              {item.residentImage ? (
                <Image
                  src={item.residentImage}
                  alt={item.residentName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover h-10 w-10"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-emerald-700">
                    {item.residentName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.residentName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedback.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No feedback available yet
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/resident/feedback"
          className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View your resident feedback
        </Link>
      </div>
    </section>
  )
}
