'use client'

import { useState } from 'react'
import { Download, Smartphone, Share2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePWA } from './pwa-provider'

export function InstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)

  if (isInstalled || isDismissed || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-50 md:bottom-4 md:left-4 md:right-auto md:p-0 md:bg-none">
      <Card className="w-full md:max-w-sm shadow-lg border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">I-install ang App</CardTitle>
                <CardDescription className="text-xs">
                  Mas mabilis at mas madaling gamitin
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mt-1 -mr-2"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-xs text-muted-foreground space-y-1 mb-3">
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-primary" />
              Offline access
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-primary" />
              Push notifications
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-primary" />
              Faster loading
            </li>
          </ul>
          <div className="flex gap-2">
            <Button onClick={installApp} size="sm" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Install
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDismissed(true)}
            >
              Hindi ngayon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function OfflineBanner() {
  const { isOnline, pendingRequests } = usePWA() as any

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-warning text-warning-foreground px-4 py-2 text-center text-sm z-50">
      <span className="font-medium">Offline Mode</span>
      {pendingRequests?.length > 0 && (
        <span className="ml-2">
          ({pendingRequests.length} pending {pendingRequests.length === 1 ? 'request' : 'requests'})
        </span>
      )}
    </div>
  )
}

export function ShareButton({ title, text, url }: { title: string; text: string; url?: string }) {
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: url || window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('[Share] Error:', error)
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
      {shared ? (
        <>
          <Check className="h-4 w-4" />
          Shared!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  )
}
