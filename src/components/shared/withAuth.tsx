'use client'

import type { ComponentType } from 'react'

// HOC that marks a page as needing auth
// Note: AuthProvider is now provided at the root layout level via Providers
// This HOC is kept for backward compatibility and can be used for additional auth logic
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const WithAuthComponent = (props: P) => {
    // Simply render the wrapped component - AuthProvider is already at root level
    return <WrappedComponent {...props} />
  }

  // Copy display name for debugging
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithAuthComponent.displayName = `withAuth(${displayName})`

  return WithAuthComponent
}
