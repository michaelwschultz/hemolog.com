import Head from 'next/head'
import NextLink from 'next/link'
import { Text, Divider, Spacer, Link } from '@geist-ui/react'
import styled from 'styled-components'

import Footer from 'components/footer'
import StaticHeader from 'components/staticHeader'
import DescriptionCards from 'components/descriptionCards'

export default function Landing(): JSX.Element {
  return (
    <>
      <Head>
        <title>Hemolog</title>
      </Head>
      <StyledPage>
        <StaticHeader />
        <StyledPageContent>
          <Text h2>Welcome to Hemolog</Text>
          <Text h5>The last treatment tracker you’ll ever need.</Text>
          <Divider />

          <Text>
            Log your treatments and get fantastic insights that help you change
            your habits. What more could you want?
            <br />
            Sign up for free and start using the newest version of Hemolog
            today!
          </Text>

          <Text>
            <NextLink href='/about'>
              <Link color href='/about'>
                Learn more about the Hemolog story...
              </Link>
            </NextLink>
          </Text>
          <Spacer h={3} />
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

const StyledPageContent = styled.main`
  padding: 40px 24px 0 24px;
`
