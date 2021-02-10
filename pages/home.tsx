import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Tabs } from '@geist-ui/react'
import styled from 'styled-components'
import splitbee from '@splitbee/web'

import Header from 'components/header'
import Footer from 'components/footer'
import { useAuth, ProtectRoute } from 'lib/auth'
import { UserType } from 'lib/types/users'
import HomePage from 'components/homePage'
import ProfilePage from 'components/profilePage'
import FeedbackPage from 'components/feedbackPage'

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

  const { user }: { user: UserType } = useAuth()
  const router = useRouter()
  const { version } = props

  useEffect(() => {
    if (user) {
      splitbee.user.set({
        displayName: user.name,
        uid: user.uid,
        appVersion: version,
      })
    }
  }, [user])

  return (
    <ProtectRoute>
      <Head>
        <title>Hemolog</title>
      </Head>
      <StyledPage>
        <StyledPageHeader>
          <Header version={version} />
        </StyledPageHeader>
        <StyledPageContent>
          <Tabs initialValue={router.route}>
            <Tabs.Item label='home' value='/home'>
              <StyledPageSection>
                <HomePage />
              </StyledPageSection>
            </Tabs.Item>

            <Tabs.Item label='Profile' value='/profile'>
              <StyledPageSection>
                <ProfilePage />
              </StyledPageSection>
            </Tabs.Item>
            {/* 
            <Tabs.Item
              label='emergency'
              value={`/emergency/${user && user.alertId}`}
            /> */}

            {user && user.isAdmin && (
              <Tabs.Item label='feedback' value='/feedback'>
                <StyledPageSection>
                  <FeedbackPage />
                </StyledPageSection>
              </Tabs.Item>
            )}
          </Tabs>
        </StyledPageContent>
        <Footer />
      </StyledPage>
    </ProtectRoute>
  )
}

export default Home

const StyledPage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 850pt;
  width: 100%;
  margin: 0 auto;

  main {
    flex: 1 0 auto;
  }
  footer {
    flex-shrink: 0;
  }
`

const StyledPageHeader = styled.header`
  padding: 24px;
`

const StyledPageContent = styled.main`
  padding: 0 24px;
`

const StyledPageSection = styled.section`
  padding: 40px 0 0 0;
`
