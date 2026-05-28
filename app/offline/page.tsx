'use client'

import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Walang Internet Connection</CardTitle>
          <CardDescription className="text-base">
            Hindi ka naka-connect sa internet. Pakicheck ang iyong WiFi o mobile data at subukang muli.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Habang offline, maaari mo pa ring:</p>
            <ul className="text-left space-y-1">
              <li>- Tingnan ang mga naka-cache na dokumento</li>
              <li>- Mag-draft ng mga request (i-submit kapag online)</li>
              <li>- I-access ang iyong profile information</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Subukang Muli
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
