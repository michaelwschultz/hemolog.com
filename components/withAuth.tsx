import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import LoadingScreen from 'components/loadingScreen'

// Dynamically import AuthProvider to avoid loading Firebase on public pages
const AuthProvider = dynamic(
  () => import('lib/auth').then((mod) => mod.AuthProvider),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  }
)

// HOC that wraps a page component with AuthProvider
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const WithAuthComponent = (props: P) => {
    return (
      <AuthProvider>
        <WrappedComponent {...props} />
      </AuthProvider>
    )
  }

  // Copy display name for debugging
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithAuthComponent.displayName = `withAuth(${displayName})`

  return WithAuthComponent
}

// Wrapper component for use with getLayout pattern
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
