import Head from 'next/head'
import { useRouter } from 'next/router'
import { Page, Text, Row, Button, Divider } from '@geist-ui/react'

import Logo from 'components/logo'
import Footer from 'components/footer'
import DescriptionCards from 'components/descriptionCards'
import { useAuth } from 'lib/auth'
import { UserType } from 'lib/types/users'

export default function Landing(): JSX.Element {
  const { user, loading }: { user: UserType; loading: boolean } = useAuth()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Hemolog</title>
      </Head>
      <Page size='large'>
        <Page.Header style={{ paddingTop: '24px' }}>
          <Row justify='space-between' align='middle'>
            <Logo />
            <Button
              type='success'
              onClick={() => router.push(user ? '/home' : '/login')}
              loading={loading}
            >
              {user ? 'Sign in' : 'Register'}
            </Button>
          </Row>
        </Page.Header>
        <Page.Content>
          <Text h2>Welcome to Hemolog</Text>
          <Text h5>The last treatment tracker you'll ever need.</Text>
          <Divider />

          <Text>
            Let's face it, there are some exciting developments in the world of
            Hemophilia research. Honestly, it's not <i>just</i> research
            anymore. Clinical trials are happening now across the globe. Gene
            threrapy is definitly going to change things for the better, it's
            just a matter of when it's available to all of us.
          </Text>

          <Text>
            That being said, it's still important to keep track of you
            treatments. Maybe even more now than ever. If getting on a trial is
            something you re interested in, knowing how many bleeds you were
            having before is really important.
          </Text>

          <Text>
            Trial or not, keeping track of your treatment habbits can be hard,
            and the tools we have don't do a great job. Hemolog is simple. You
            track your treatments, and Hemolog gives you instant feedback.
          </Text>

          <Text>
            Stats are something that I always wanted to be apart of Hemolog, and
            now they're here.
          </Text>
          <DescriptionCards />
        </Page.Content>
        <Footer />
      </Page>
    </>
  )
}
