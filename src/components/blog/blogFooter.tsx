'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type ReactElement, useEffect, useState } from 'react'

import { useAuth } from '@/lib/auth'

export default function BlogFooter(): ReactElement {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use consistent state during SSR and initial hydration
  const isLoading = !mounted || loading
  const showUserContent = mounted && !loading && user

  return (
    <div className='flex flex-col sm:flex-row items-center gap-6'>
      <div className='flex-1 flex flex-col'>
        <h4 className='text-lg font-semibold mb-2'>
          Designed and developed by Michael Schultz in Oakland, California.
        </h4>
        {showUserContent ? (
          <p className='text-gray-600'>
            Thanks for being part of the Hemolog community!
          </p>
        ) : (
          <>
            <p className='text-gray-600 mb-3'>Start using Hemolog for free.</p>
            <button
              type='button'
              onClick={() => router.push('/signin')}
              disabled={isLoading}
              className='btn btn-primary w-fit'
            >
              {isLoading && (
                <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              )}
              Register
            </button>
          </>
        )}
      </div>

      <div className='flex-shrink-0'>
        <Image
          width={60}
          height={60}
          src='/images/michael-schultz.jpg'
          alt='Michael Schultz'
          className='rounded-full'
        />
      </div>
    </div>
  )
}
