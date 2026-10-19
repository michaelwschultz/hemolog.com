'use client'

import { useRouter } from 'next/navigation'
import { type ReactElement, useEffect, useState } from 'react'
import Logo from '@/components/shared/logo'
import { useAuth } from '@/lib/auth'

const StaticHeader = (): ReactElement => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use consistent "Loading..." state during SSR and initial hydration
  const isLoading = !mounted || loading

  return (
    <header className='px-6 py-5'>
      <div className='flex items-center justify-between'>
        <Logo />
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => router.push(user ? '/home' : '/signin')}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              Loading
            </>
          ) : user ? (
            'Dashboard'
          ) : (
            'Register'
          )}
        </button>
      </div>
    </header>
  )
}

export default StaticHeader
