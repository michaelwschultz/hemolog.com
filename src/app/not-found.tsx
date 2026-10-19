'use client'

import { useRouter } from 'next/navigation'
import { type ReactElement, useEffect } from 'react'
import LoadingScreen from '@/components/shared/loadingScreen'
import { useAuth } from '@/lib/auth'

function Custom404(): ReactElement {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // If user is authenticated, redirect to home
      // If not authenticated, redirect to signin
      router.replace(user ? '/app' : '/signin')
    }
  }, [router, user, loading])

  return <LoadingScreen />
}

export default Custom404
