import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Tabs, TabsItem } from 'components/Tabs'

import Header from 'components/header'
import Footer from 'components/footer'
import { withAuth } from 'components/withAuth'
import { useAuth, ProtectRoute } from 'lib/auth'
import HomePage from 'components/homePage'
import ProfilePage from 'components/profilePage'
import FeedbackPage from 'components/feedbackPage'
import { track } from 'lib/helpers'

export async function getStaticProps() {
  return {
    props: {
      version: process.env.npm_package_version,
    },
  }
}

const Home = (props: { version: string }): JSX.Element => {
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
  const router = useRouter()
  const { version } = props

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
      <Head>
        <title>Hemolog</title>
      </Head>
      <div className='h-full flex flex-col max-w-2xl w-full mx-auto'>
        <header className='p-6'>
          <Header version={version} />
        </header>
        <main className='px-6'>
          <Tabs initialValue={router.route}>
            <TabsItem label='home' value='/home'>
              <section className='pt-10'>
                <HomePage />
              </section>
            </TabsItem>

            <TabsItem label='Profile' value='/profile'>
              <section className='pt-10'>
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
                <section className='pt-10'>
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
