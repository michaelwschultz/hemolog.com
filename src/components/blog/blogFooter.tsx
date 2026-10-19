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
    <div className='mt-16 flex flex-col items-center gap-6 sm:flex-row'>
      <div className='flex flex-1 flex-col'>
        <p className='mb-2 text-lg font-medium tracking-tight text-ink'>
          Designed and developed by Michael Schultz in Oakland, California.
        </p>
        {showUserContent ? (
          <p className='text-slate'>
            Thanks for being part of the Hemolog community.
          </p>
        ) : (
          <>
            <p className='mb-3 text-slate'>Start using Hemolog for free.</p>
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
