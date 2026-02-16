'use client'

import { useEffect } from 'react'
import Header from '@/components/home/header'
import { PageNav } from '@/components/home/pageNav'
import ProfilePageComponent from '@/components/home/profilePage'
import Footer from '@/components/shared/footer'
import { withAuth } from '@/components/shared/withAuth'
import { ProtectRoute, useAuth } from '@/lib/auth'
import { track } from '@/lib/helpers'

const Profile = (): JSX.Element => {
  const { user } = useAuth()
  const version = process.env.npm_package_version

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
      <div className='h-full flex flex-col max-w-[80rem] w-full mx-auto'>
        <header className='p-6'>
          <Header version={version} />
        </header>
        <main className='px-6'>
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
