'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { usePWA } from './pwa-provider'

interface NotificationPreferences {
  documentUpdates: boolean
  announcements: boolean
  reminders: boolean
  emergencyAlerts: boolean
}

export function PushNotificationManager() {
  const { swRegistration } = usePWA()
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    documentUpdates: true,
    announcements: true,
    reminders: true,
    emergencyAlerts: true,
  })

  useEffect(() => {
    // Check notification support
    if ('Notification' in window && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }

    // Check existing subscription
    if (swRegistration) {
      swRegistration.pushManager.getSubscription().then((subscription) => {
        setIsSubscribed(!!subscription)
      })
    }
  }, [swRegistration])

  const requestPermission = async () => {
    setIsLoading(true)
    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted' && swRegistration) {
        await subscribeUser()
      }
    } catch (error) {
      console.error('[Notifications] Permission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeUser = async () => {
    if (!swRegistration) return

    try {
      // In production, get this from your server
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey || undefined,
      })

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, preferences }),
      })

      setIsSubscribed(true)
    } catch (error) {
      console.error('[Notifications] Subscribe error:', error)
    }
  }

  const unsubscribeUser = async () => {
    if (!swRegistration) return

    setIsLoading(true)
    try {
      const subscription = await swRegistration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()

        // Notify server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
      }
      setIsSubscribed(false)
    } catch (error) {
      console.error('[Notifications] Unsubscribe error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value }
      
      // Save to server if subscribed
      if (isSubscribed) {
        fetch('/api/notifications/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
      }

      return updated
    })
  }

  const sendTestNotification = async () => {
    if (permission !== 'granted') return

    new Notification('Barangay Santiago', {
      body: 'Ito ay test notification. Gumagana ang notifications!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
    })
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Hindi supported ang push notifications sa browser na ito.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Makatanggap ng real-time updates tungkol sa iyong mga request at announcements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission === 'denied' ? (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">Notifications Blocked</p>
            <p className="mt-1 text-muted-foreground">
              I-enable ang notifications sa browser settings para makatanggap ng updates.
            </p>
          </div>
        ) : permission === 'default' ? (
          <Button onClick={requestPermission} disabled={isLoading} className="w-full gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            I-enable ang Notifications
          </Button>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isSubscribed ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                  {isSubscribed ? 'Naka-enable ang Notifications' : 'Naka-disable ang Notifications'}
                </span>
              </div>
              <Button
                variant={isSubscribed ? 'destructive' : 'default'}
                size="sm"
                onClick={isSubscribed ? unsubscribeUser : subscribeUser}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isSubscribed ? 'I-disable' : 'I-enable'}
              </Button>
            </div>

            {isSubscribed && (
              <>
                <div className="border-t pt-4 space-y-4">
                  <p className="text-sm font-medium">Notification Preferences</p>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="doc-updates" className="text-sm">
                      Document Updates
                    </Label>
                    <Switch
                      id="doc-updates"
                      checked={preferences.documentUpdates}
                      onCheckedChange={(v) => updatePreference('documentUpdates', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="announcements" className="text-sm">
                      Barangay Announcements
                    </Label>
                    <Switch
                      id="announcements"
                      checked={preferences.announcements}
                      onCheckedChange={(v) => updatePreference('announcements', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminders" className="text-sm">
                      Reminders
                    </Label>
                    <Switch
                      id="reminders"
                      checked={preferences.reminders}
                      onCheckedChange={(v) => updatePreference('reminders', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="emergency" className="text-sm">
                      Emergency Alerts
                    </Label>
                    <Switch
                      id="emergency"
                      checked={preferences.emergencyAlerts}
                      onCheckedChange={(v) => updatePreference('emergencyAlerts', v)}
                    />
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={sendTestNotification} className="w-full">
                  Send Test Notification
                </Button>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
