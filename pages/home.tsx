import Head from 'next/head'
import { useRouter } from 'next/router'
import { Page, Tabs } from '@geist-ui/react'

import Header from 'components/header'
import Footer from 'components/footer'
import { useAuth } from 'lib/auth'
import HomePage from 'components/homePage'
import ProfilePage from 'components/profilePage'
import FeedbackPage from 'components/feedbackPage'

const Home = (): JSX.Element => {
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

  return (
    <>
      <Head>
        <title>Hemolog</title>
      </Head>
      <Page size='large'>
        <Header />
        <Tabs initialValue={router.route}>
          <Tabs.Item label='home' value='/home'>
            <Page.Content>
              <HomePage />
            </Page.Content>
          </Tabs.Item>

          <Tabs.Item label='profile' value='/profile'>
            <Page.Content>
              <ProfilePage />
            </Page.Content>
          </Tabs.Item>

          <Tabs.Item
            label='emergency'
            value={`/emergency/${user && user.alertId}`}
          />

          {user && user.isAdmin && (
            <Tabs.Item label='feedback' value='/feedback'>
              <Page.Content>
                <FeedbackPage />
              </Page.Content>
            </Tabs.Item>
          )}
        </Tabs>
        <Page.Footer>
          <Footer />
        </Page.Footer>
      </Page>
    </>
  )
}

export default Home
