'use client'

import { useRouter } from 'next/navigation'
import { type ReactElement, useEffect } from 'react'
import FeedbackPage from '@/components/home/feedbackPage'
import { useAuth } from '@/lib/auth'

export default function AppFeedbackPage(): ReactElement | null {
  const { user } = useAuth()
  const router = useRouter()
  const isAdmin = Boolean(user?.isAdmin)

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace('/app')
    }
  }, [user, isAdmin, router])

  if (!isAdmin) {
    return null
  }

  return (
    <section className='pt-6 sm:pt-10'>
      <FeedbackPage />
    </section>
  )
}
