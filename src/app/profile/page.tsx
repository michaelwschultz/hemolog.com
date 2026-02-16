'use client'

import { useEffect } from 'react'
import Header from '@/components/home/header'
import { PageNav } from '@/components/home/pageNav'
import ProfilePageComponent from '@/components/home/profilePage'
import Footer from '@/components/shared/footer'
import { withAuth } from '@/components/shared/withAuth'
import { ProtectRoute, useAuth } from '@/lib/auth'
import { track } from '@/lib/helpers'

const Profile = () => {
  const { user } = useAuth()
  const version = process.env.APP_VERSION || 'unknown'

  useEffect(() => {
    if (user) {
      track('Logged In', {
        uid: user.uid,
        email: user.email,
        appVersion: version,
      })
    }
  }, [user, version])

  return (
    <ProtectRoute>
      <div className='min-h-screen flex flex-col max-w-[80rem] w-full mx-auto'>
        <header className='p-6'>
          <Header version={version} />
        </header>
        <main className='flex-1 px-6 pb-8'>
          <PageNav />
          <section className='pt-6'>
            <ProfilePageComponent />
          </section>
        </main>
        <Footer />
      </div>
    </ProtectRoute>
  )
}

export default withAuth(Profile)
