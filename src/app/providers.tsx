'use client'

import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth'
import { QueryProvider } from '@/lib/providers/query-provider'

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
      <AuthProvider>
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              background: '#161A20',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 14px',
            },
          }}
        />
        <AgentErrorBoundary>{children}</AgentErrorBoundary>
      </AuthProvider>
    </QueryProvider>
  )
}
