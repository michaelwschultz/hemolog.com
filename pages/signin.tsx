import { useAuth } from 'lib/auth'
import Head from 'next/head'
import {
  Text,
  Fieldset,
  Row,
  Spacer,
  Divider,
  Link,
  Button,
  Note,
  Tag,
} from '@geist-ui/react'
import styled from 'styled-components'

import Logo from 'components/logo'
import DescriptionCards from 'components/descriptionCards'
import Footer from 'components/footer'

export async function getStaticProps() {
  return {
    props: {
      version: process.env.npm_package_version,
    },
  }
}

const Signin = (pageProps: { version: string }) => {
  const { version } = pageProps
  const auth = useAuth()

  return (
    <>
      <Head>
        <title>Hemolog - Sign in</title>
      </Head>
      <StyledPage>
        <StyledPageHeader>
          <Row align='middle' justify='space-between'>
            <Logo />
            <Link href='https://github.com/michaelwschultz/hemolog.com'>
              <Tag>v{version}</Tag>
            </Link>
          </Row>
        </StyledPageHeader>
        <StyledPageContent>
          <Note type='default' label='Important'>
            Hemolog is currently in development. Data integrety is not
            guaranteed. Hemolog is{' '}
            <b>
              <i>not</i>
            </b>{' '}
            HIPAA compliant... yada yada yada.
          </Note>
          <Spacer y={2} />
          <Row justify='center'>
            <Fieldset style={{ width: '460px' }}>
              <Text h4>Register or sign in</Text>
              <Text p>
                Signing in will create an account if you don't have one yet.
                Don't worry, Hemolog will always be <i>free</i>.
              </Text>
              <Spacer />
              <Button
                onClick={() => auth.signinWithGoogle('/home')}
                loading={auth.loading}
                type='success'
              >
                Continue with Google
              </Button>
              <Spacer />
            </Fieldset>
          </Row>

          <Spacer />

          <Divider />
          <Spacer y={4} />
          <DescriptionCards />
          <Spacer y={2} />
        </StyledPageContent>
        <Footer />
      </StyledPage>
    </>
  )
}

export default Signin

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
  padding: 40px 24px 0 24px;
`
