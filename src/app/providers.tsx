'use client'

import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { AuthProvider } from '@/lib/auth'
import { QueryProvider } from '@/lib/providers/query-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position='top-right'
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
            }}
          />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
