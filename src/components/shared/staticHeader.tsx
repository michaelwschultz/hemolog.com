'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '@/components/shared/button'
import Logo from '@/components/shared/logo'
import { useAuth } from '@/lib/auth'

const StaticHeader = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use consistent "Loading..." state during SSR and initial hydration
  const isLoading = !mounted || loading

  const buttonText = isLoading ? 'Loading...' : user ? 'Dashboard' : 'Register'

  return (
    <header className='p-6'>
      <div className='flex justify-between items-center'>
        <Logo />
        <Button
          variant='primary'
          onClick={() => router.push(user ? '/home' : '/signin')}
          disabled={isLoading}
          isLoading={isLoading}
        >
          {buttonText}
        </Button>
      </div>
    </header>
  )
}

export default StaticHeader
