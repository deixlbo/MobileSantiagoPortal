import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import ChatbotWidget from './components/chatbot-widget'
import PWAHandler from './components/pwa-handler'
import SkipLinks from './components/skip-links'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Barangay Santiago Portal - Document Requests & Services',
  description: 'AI-Assisted Barangay Santiago Portal with accessible design for all ages. Request documents, track status, file complaints, and book appointments easily.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  applicationName: 'Santiago Portal',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Santiago Portal',
    startupImage: '/icons/icon-192x192.png',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: 'Barangay Santiago Portal',
    description: 'AI-Assisted Barangay management system with accessible design',
    url: 'https://santiago-portal.vercel.app',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#2d6a4f',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Santiago" />
        <meta name="msapplication-TileColor" content="#2d6a4f" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#2d6a4f" />
        <meta name="description" content="Accessible barangay portal for all ages" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <link rel="alternate icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <SkipLinks />
        <main id="main-content">
          {children}
        </main>
        <ChatbotWidget />
        <PWAHandler />
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          expand
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '2px solid hsl(var(--primary))',
              fontSize: '16px',
              padding: '16px',
            },
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

