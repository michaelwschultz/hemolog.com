'use client'

import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { QueryProvider } from '@/lib/providers/query-provider'
import { SheetProvider } from '@/lib/providers/sheet-provider'

class AgentErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(_error: unknown) {
    // Error logged by React error boundary
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='text-red-800 font-semibold mb-1'>
            Something went wrong
          </div>
          <div className='text-red-700'>Refresh the page to recover.</div>
        </div>
      )
    }
    return this.props.children
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.setAttribute('data-hydrated', 'true')
  }, [])

  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <SheetProvider>
            <Toaster
              position='top-right'
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
            <AgentErrorBoundary>{children}</AgentErrorBoundary>
          </SheetProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
