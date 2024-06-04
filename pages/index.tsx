import Head from 'next/head'
import NextLink from 'next/link'
import Image from 'next/image'
import { Text, Spacer, Grid } from '@geist-ui/react'
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
      <StyledPage style={{ position: 'relative' }}>
        <StaticHeader />
        <StyledPageContent>
          <StyledImage>
            <Image
              alt='logging infusion illustration'
              src='/images/logging-infusion-illustration.png'
              width={925 / 2}
              height={989 / 2}
              className=''
            />
          </StyledImage>
          <span style={{ position: 'relative', zIndex: 2 }}>
            <Text
              h1
              style={{
                fontFamily: 'Nanum Pen Script, cursive',
                fontSize: 100,
                width: '75%',
                lineHeight: '80px',
              }}
            >
              TREATMENT INSIGHTS <br />
              THAT MATTER
            </Text>
            <Text h5>The last treatment log you’ll ever need.</Text>

            <Spacer h={3} />
            <Text>
              Log your treatments and get fantastic insights that help you
              change your habits.
              <br />
              Sign up for free and start using the newest version of Hemolog
              today!
            </Text>

            <Text>
              <NextLink href='/about'>
                Learn more about the Hemolog story...
              </NextLink>
            </Text>
            <Spacer h={3} />
            <Grid.Container gap={2}>
              <Grid sm={12}>
                <DescriptionCards />
              </Grid>
            </Grid.Container>
          </span>
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

  @media (max-width: 768px) {
    h1 {
      font-size: 50px !important;
      line-height: 50px !important;
    }
  }
`

const StyledImage = styled.div`
  position: absolute;
  right: 0;
  width: 50%;
`
