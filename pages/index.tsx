import Head from 'next/head'
import { useRouter } from 'next/router'
import { Text, Row, Button, Divider, Spacer, Link } from '@geist-ui/react'
import styled from 'styled-components'

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
      <StyledPage>
        <StyledPageHeader>
          <Row justify='space-between' align='middle'>
            <Logo />
            <Button
              type='success'
              onClick={() => router.push(user ? '/home' : '/signin')}
              loading={loading}
            >
              {user ? 'Sign in' : 'Register'}
            </Button>
          </Row>
        </StyledPageHeader>
        <StyledPageContent>
          <Text h2>Welcome to Hemolog</Text>
          <Text h5>The last treatment tracker you'll ever need.</Text>
          <Divider />

          <Text>
            Log your treatments, get fantastic insights that help you change
            your habbits. What more could you want? Sign up for free and start
            using the newest version of Hemolog today!
          </Text>

          <Text>
            <Link color href='/about'>
              Learn more about the Hemolog story...
            </Link>
          </Text>
          <Spacer y={3} />
          <DescriptionCards />
        </StyledPageContent>
        <Footer />
      </StyledPage>
    </>
  )
}

const StyledPage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 750pt;
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
  padding: 40px 24px 0 24px;
`
