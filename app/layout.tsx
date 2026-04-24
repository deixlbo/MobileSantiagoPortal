import type { Metadata } from 'next';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Barangay Santiago Portal',
  description: 'Official portal for Barangay Santiago residents and officials',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <QueryClientProvider>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
