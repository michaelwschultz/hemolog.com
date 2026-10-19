'use client'

import Link from 'next/link'
import { type ReactElement, useEffect, useState } from 'react'
import EmergencySnippet from '@/components/shared/emergencySnippet'
import { useAuth } from '@/lib/auth'
import { CONFIG } from '@/lib/helpers'

const linkClass = 'text-sm text-ink hover:text-primary-600'

export default function Footer(): ReactElement {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use a consistent default during SSR and initial hydration to avoid mismatch
  const alertId = () => {
    if (!mounted || loading) {
      return 'example'
    }
    if (user?.alertId) {
      return user.alertId
    }
    return 'example'
  }

  return (
    <footer className='px-6 py-12'>
      <div className='mb-10 h-px bg-line' />
      <div className='grid gap-10 sm:grid-cols-2'>
        <div>
          <p className='mb-3 text-xs font-medium tracking-[0.14em] text-slate uppercase'>
            Hemolog
          </p>
          <nav aria-label='Hemolog' className='flex flex-col gap-2'>
            <Link className={linkClass} href='/about'>
              The story so far
            </Link>
            <Link className={linkClass} href='/changelog'>
              Development blog
            </Link>
            <Link className={linkClass} href='/docs'>
              API docs
            </Link>
          </nav>
          <p className='mt-8 mb-3 text-xs font-medium tracking-[0.14em] text-slate uppercase'>
            Follow
          </p>
          <nav aria-label='Follow' className='flex flex-col gap-2'>
            <a className={linkClass} href='https://twitter.com/hemolog'>
              @Hemolog
            </a>
            <a className={linkClass} href={CONFIG.blueskyUrl}>
              @MichaelSchultz
            </a>
          </nav>
        </div>
        <div>
          <p className='mb-3 text-xs font-medium tracking-[0.14em] text-slate uppercase'>
            Get involved
          </p>
          <nav aria-label='Get involved' className='flex flex-col gap-2'>
            <a
              className={linkClass}
              href='https://github.com/michaelwschultz/hemolog.com'
            >
              View source
            </a>
            <a
              className={linkClass}
              href='https://github.com/sponsors/michaelwschultz'
            >
              Donate
            </a>
          </nav>
          <p className='mt-8 mb-3 text-xs font-medium tracking-[0.14em] text-slate uppercase'>
            Emergency link
          </p>
          <EmergencySnippet alertId={alertId()} />
        </div>
      </div>
    </footer>
  )
}
