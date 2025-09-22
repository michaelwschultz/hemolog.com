import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'lib/auth'
import LoadingScreen from 'components/loadingScreen'

export default function Custom404(): JSX.Element {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // If user is authenticated, redirect to home
      // If not authenticated, redirect to signin
      router.replace(user ? '/home' : '/signin')
    }
  }, [router, user, loading])

  return <LoadingScreen />
}
