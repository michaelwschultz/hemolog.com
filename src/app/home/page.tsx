'use client'

import { useEffect } from 'react'
import Header from '@/components/home/header'
import HomePage from '@/components/home/homePage'
import { PageNav } from '@/components/home/pageNav'
import Footer from '@/components/shared/footer'
import { withAuth } from '@/components/shared/withAuth'
import { ProtectRoute, useAuth } from '@/lib/auth'
import { track } from '@/lib/helpers'

const Home = () => {
  // TODO(michael) add welcome message by checking to see if this is the users
  // first time logging in. Still not sure how to accomplish this.
  //
  // const [toasts, setToast] = useToasts()

  // // displays welcome message on first login
  // useEffect(() => {
  //   if (user && !toasts.length) {
  //     setToast({
  //       text: '👋 Welcome to Hemolog 2!',
  //       delay: 12000,
  //       type: 'success',
  //       actions: [
  //         {
  //           name: 'thanks',
  //           passive: true,
  //           handler: (_event, cancel) => cancel(),
  //         },
  //       ],
  //     })
  //   }
  // }, [user, toasts])

  // TODO(michael): Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

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
      <div className='h-full flex flex-col max-w-[80rem] w-full mx-auto'>
        <header className='p-6'>
          <Header version={version} />
        </header>
        <main className='px-6'>
          <PageNav />
          <section className='pt-6'>
            <HomePage />
          </section>
        </main>
        <Footer />
      </div>
    </ProtectRoute>
  )
}

export default withAuth(Home)
