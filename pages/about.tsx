import Head from 'next/head'
import NextLink from 'next/link'
import {
  Text,
  Divider,
  Display,
  Image,
  Spacer,
  Grid,
  Link,
} from '@geist-ui/react'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'

const About = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Hemolog - About</title>
      </Head>
      <StyledPage>
        <StaticHeader />
        <StyledPageContent>
          <Text h2>The story so far</Text>
          <Text h5>More than you would ever want to know about Hemolog</Text>
          <Divider />
          <Display>
            <Image width={765} height={400} src='/images/hemolog-2-hero.png' />
          </Display>

          <Text>
            Let's face it, there are some exciting developments in the world of
            Hemophilia research. Honestly, it's not <i>just</i> research
            anymore. Clinical trials are happening now across the globe. Gene
            threrapy is definitely going to change things for the better, it's
            just a matter of when it's available to all of us.
          </Text>

          <Text>
            That being said, it's still important to keep track of you
            treatments. Maybe even more now than ever. If getting on a trial is
            something you're interested in, knowing how many bleeds you were
            having before is really important.
          </Text>
          <Text>
            Trial or not, keeping track of your treatment habbits can be hard,
            and the tools we have don't do a great job. Hemolog is simple. You
            track your treatments, and Hemolog gives you instant feedback.
          </Text>
          <Text>
            Insights are something that I always wanted to be apart of Hemolog,
            and now they're finally here.
          </Text>

          <Display
            shadow
            caption='High level insights that help you understand your habbits'
          >
            <Image
              width={486}
              height={377}
              src='/images/insights-example.png'
            />
          </Display>

          <Text>
            These insights are calculated as you add more data. Filters will
            allow you to choose different time frames for viewing your data down
            the road giving you the best most comprehensive view into your
            treatment history ever. I've chosen a few insights that are
            interesting for me. If you have thoughts on what you would like to
            see just let me know.
          </Text>

          <Spacer y={5} />

          <Grid.Container gap={2} alignItems='center'>
            <Grid xs={24} sm={16}>
              <Text h3 type='secondary'>
                Now that Hemolog is back. I hope you enjoy using it as much as I
                have. It's up to all of us to keep each other accountable. You
                can{' '}
                <NextLink href='/emergency/mike29'>
                  <Link color href='/emergency/mike29' icon>
                    view my emergency page
                  </Link>
                </NextLink>
                at any time to verify I've been keeping up with my prophy
                regimen.
              </Text>
              <br />
              <Text h4>— Michael Schultz</Text>
            </Grid>
            <Grid xs={24} sm={8}>
              <Spacer />
              <Image
                width={300}
                height={300}
                src='/images/michael-schultz.jpg'
              />
            </Grid>
          </Grid.Container>

          <Spacer y={5} />
        </StyledPageContent>
        <Footer />
      </StyledPage>
    </>
  )
}

export default About

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
  padding: 0 24px;
`
