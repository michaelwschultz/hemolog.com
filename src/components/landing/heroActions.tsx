'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function HeroActions() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const href = mounted && !loading && user ? '/app' : '/signin'

  return (
    <div className='mt-8 flex flex-wrap items-center gap-x-5 gap-y-3'>
      <Link href={href} className='btn btn-primary'>
        Start logging
      </Link>
      <Link
        href='/about'
        className='text-sm font-medium text-ink underline decoration-primary-500 decoration-2 underline-offset-4'
      >
        Read the Hemolog story
      </Link>
    </div>
  )
}
