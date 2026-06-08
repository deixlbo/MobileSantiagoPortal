'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'

interface OfflineRequest {
  id: string
  url: string
  method: string
  headers: Record<string, string>
  body: string
  timestamp: number
  type: string
}

interface OfflineDataContextType {
  isOnline: boolean
  pendingRequests: OfflineRequest[]
  cacheData: <T>(key: string, data: T) => Promise<void>
  getCachedData: <T>(key: string) => Promise<T | null>
  queueRequest: (request: Omit<OfflineRequest, 'id' | 'timestamp'>) => Promise<void>
  syncPendingRequests: () => Promise<void>
  clearCache: () => Promise<void>
}

const OfflineDataContext = createContext<OfflineDataContextType>({
  isOnline: true,
  pendingRequests: [],
  cacheData: async () => {},
  getCachedData: async () => null,
  queueRequest: async () => {},
  syncPendingRequests: async () => {},
  clearCache: async () => {},
})

export const useOfflineData = () => useContext(OfflineDataContext)

const DB_NAME = 'BrgySantiagoDB'
const DB_VERSION = 1
const CACHE_STORE = 'cachedData'
const REQUESTS_STORE = 'pendingRequests'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE, { keyPath: 'key' })
      }
      
      if (!db.objectStoreNames.contains(REQUESTS_STORE)) {
        db.createObjectStore(REQUESTS_STORE, { keyPath: 'id' })
      }
    }
  })
}

export function OfflineDataProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingRequests, setPendingRequests] = useState<OfflineRequest[]>([])
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      // Auto-sync when coming back online
      syncPendingRequests()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initialize IndexedDB
    openDB().then((database) => {
      setDb(database)
      loadPendingRequests(database)
    }).catch((error) => {
      console.error('[OfflineData] Failed to open database:', error)
    })

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadPendingRequests = async (database: IDBDatabase) => {
    try {
      const transaction = database.transaction(REQUESTS_STORE, 'readonly')
      const store = transaction.objectStore(REQUESTS_STORE)
      const request = store.getAll()
      
      request.onsuccess = () => {
        setPendingRequests(request.result)
      }
    } catch (error) {
      console.error('[OfflineData] Failed to load pending requests:', error)
    }
  }

  const cacheData = useCallback(async <T,>(key: string, data: T) => {
    if (!db) return

    try {
      const transaction = db.transaction(CACHE_STORE, 'readwrite')
      const store = transaction.objectStore(CACHE_STORE)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put({ key, data, timestamp: Date.now() })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[OfflineData] Cache error:', error)
    }
  }, [db])

  const getCachedData = useCallback(async <T,>(key: string): Promise<T | null> => {
    if (!db) return null

    try {
      const transaction = db.transaction(CACHE_STORE, 'readonly')
      const store = transaction.objectStore(CACHE_STORE)
      
      return new Promise((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => {
          resolve(request.result?.data ?? null)
        }
        request.onerror = () => resolve(null)
      })
    } catch (error) {
      console.error('[OfflineData] Get cache error:', error)
      return null
    }
  }, [db])

  const queueRequest = useCallback(async (request: Omit<OfflineRequest, 'id' | 'timestamp'>) => {
    if (!db) return

    const offlineRequest: OfflineRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    try {
      const transaction = db.transaction(REQUESTS_STORE, 'readwrite')
      const store = transaction.objectStore(REQUESTS_STORE)
      
      await new Promise<void>((resolve, reject) => {
        const req = store.add(offlineRequest)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })

      setPendingRequests((prev) => [...prev, offlineRequest])

      // Request background sync if available
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready
        await (registration as any).sync.register('sync-requests')
      }
    } catch (error) {
      console.error('[OfflineData] Queue request error:', error)
    }
  }, [db])

  const syncPendingRequests = useCallback(async () => {
    if (!db || !isOnline || pendingRequests.length === 0) return

    const results: string[] = []

    for (const request of pendingRequests) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        })

        if (response.ok) {
          // Remove from IndexedDB
          const transaction = db.transaction(REQUESTS_STORE, 'readwrite')
          const store = transaction.objectStore(REQUESTS_STORE)
          store.delete(request.id)
          
          results.push(request.id)
        }
      } catch (error) {
        console.error('[OfflineData] Sync failed for request:', request.id, error)
      }
    }

    // Update state
    setPendingRequests((prev) => prev.filter((r) => !results.includes(r.id)))
  }, [db, isOnline, pendingRequests])

  const clearCache = useCallback(async () => {
    if (!db) return

    try {
      const transaction = db.transaction(CACHE_STORE, 'readwrite')
      const store = transaction.objectStore(CACHE_STORE)
      store.clear()
    } catch (error) {
      console.error('[OfflineData] Clear cache error:', error)
    }
  }, [db])

  return (
    <OfflineDataContext.Provider
      value={{
        isOnline,
        pendingRequests,
        cacheData,
        getCachedData,
        queueRequest,
        syncPendingRequests,
        clearCache,
      }}
    >
      {children}
    </OfflineDataContext.Provider>
  )
}

// Offline-aware fetch wrapper
export async function offlineFetch(
  url: string,
  options: RequestInit = {},
  offlineContext?: OfflineDataContextType
): Promise<Response> {
  try {
    const response = await fetch(url, options)
    return response
  } catch (error) {
    // If offline and we have context, queue the request
    if (offlineContext && !navigator.onLine && options.method !== 'GET') {
      await offlineContext.queueRequest({
        url,
        method: options.method || 'GET',
        headers: options.headers as Record<string, string> || {},
        body: typeof options.body === 'string' ? options.body : JSON.stringify(options.body),
        type: 'api-request',
      })
      
      // Return a fake response indicating offline
      return new Response(
        JSON.stringify({ queued: true, message: 'Request queued for sync' }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    throw error
  }
}
