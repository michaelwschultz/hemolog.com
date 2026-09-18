'use client'

import { usePathname } from 'next/navigation'
import { type ReactElement, useEffect } from 'react'
import FeedbackPage from '@/components/home/feedbackPage'

import Header from '@/components/home/header'
import HomePage from '@/components/home/homePage'
import ProfilePage from '@/components/home/profilePage'
import { Tabs, TabsItem } from '@/components/home/Tabs'
import Footer from '@/components/shared/footer'
import { withAuth } from '@/components/shared/withAuth'
import { ProtectRoute, useAuth } from '@/lib/auth'
import { track } from '@/lib/helpers'

const Home = (): ReactElement => {
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
  // }, [user])

  // TODO(michael): Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

  const { user } = useAuth()
  const pathname = usePathname()
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
        <header className='p-4 sm:p-6'>
          <Header version={version} />
        </header>
        <main className='px-4 sm:px-6'>
          <Tabs initialValue={pathname}>
            <TabsItem label='home' value='/home'>
              <section className='pt-6 sm:pt-10'>
                <HomePage />
              </section>
            </TabsItem>

            <TabsItem label='Profile' value='/profile'>
              <section className='pt-6 sm:pt-10'>
                <ProfilePage />
              </section>
            </TabsItem>
            {/* 
            <Tabs.Item
              label='emergency'
              value={`/emergency/${user && user.alertId}`}
            /> */}

            {user?.isAdmin && (
              <TabsItem label='feedback' value='/feedback'>
                <section className='pt-6 sm:pt-10'>
                  <FeedbackPage />
                </section>
              </TabsItem>
            )}
          </Tabs>
        </main>
        <Footer />
      </div>
    </ProtectRoute>
  )
}

export default withAuth(Home)
