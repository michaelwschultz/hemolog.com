'use client'

import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { AppNav } from '@/components/home/AppNav'
import Header from '@/components/home/header'
import { track } from '@/components/shared/analytics'
import Footer from '@/components/shared/footer'
import { appVersion } from '@/lib/appVersion'
import { ProtectRoute, useAuth } from '@/lib/auth'

export default function AppLayout({
  children,
}: {
  children: ReactNode
}): ReactElement {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      track('Logged In', {
        uid: user.uid,
        email: user.email,
        appVersion,
      })
    }
  }, [user])

  return (
    <ProtectRoute>
      <div className='h-full flex flex-col max-w-[80rem] w-full mx-auto'>
        <header className='p-4 sm:p-6'>
          <Header />
        </header>
        <main className='px-4 sm:px-6'>
          <AppNav />
          {children}
        </main>
        <Footer />
      </div>
    </ProtectRoute>
  )
}
