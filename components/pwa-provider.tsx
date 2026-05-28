'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'

interface PWAContextType {
  isOnline: boolean
  isInstalled: boolean
  isInstallable: boolean
  installApp: () => Promise<void>
  swRegistration: ServiceWorkerRegistration | null
}

const PWAContext = createContext<PWAContextType>({
  isOnline: true,
  isInstalled: false,
  isInstallable: false,
  installApp: async () => {},
  swRegistration: null,
})

export const usePWA = () => useContext(PWAContext)

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          setSwRegistration(registration)
          console.log('[PWA] Service worker registered')
        })
        .catch((error) => {
          console.error('[PWA] Service worker registration failed:', error)
        })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
    }

    setDeferredPrompt(null)
  }

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        isInstalled,
        isInstallable,
        installApp,
        swRegistration,
      }}
    >
      {children}
    </PWAContext.Provider>
  )
}
