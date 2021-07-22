import Head from 'next/head'
import { Text, Divider, Image, Spacer, Link, useTheme } from '@geist-ui/react'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'
import BlogFooter from 'components/blogFooter'
import BlogPostFooter from 'components/blogPostFooter'

const Changelog = (): JSX.Element => {
  const theme = useTheme()

  return (
    <>
      <Head>
        <title>Hemolog - Changelog</title>
      </Head>
      <StyledPage>
        <StaticHeader />
        <StyledPageContent>
          <StyledChangelogContent>
            <Text h2>Changelog</Text>
            <Text h4 style={{ color: theme.palette.secondary }}>
              Development blog about new features, fixes, and updates to Hemolog
            </Text>
            <Divider />
            <Spacer y={3} />

            <StyledPost id='post-3'>
              <Text h4>How to contribute</Text>
              <Text h6>
                Have some skills in design or development and want to contribute
                to Hemolog? Here's how.
              </Text>
              <Spacer />
              <Divider>Update #3</Divider>
              <Text>
                Hemolog has been built in the open from the beginning. But it's
                just been me working on the project. To make Hemolog even
                better, I need your help.
              </Text>
              <Text>
                I saw this project as a way to build something helpful for
                myself and to help me learn new tools and practice my design.
                Now that it's up and running, has active users, and in need of a
                fresh coat of paint I figured I would reach out to the
                community.
              </Text>
              <StyledRow>
                <Link href='/changelog/how-to-contribute' color>
                  Continue reading
                </Link>
              </StyledRow>

              <BlogPostFooter postSlug='how-to-contribute' />
            </StyledPost>

            <StyledPost id='post-2'>
              <Text h4>Mobile enhancements</Text>
              <Text h6>
                Looks great on your desktop <i>and</i> mobile devices!
              </Text>
              <Spacer />
              <Divider>Update #2</Divider>
              <Text>
                I designed Hemolog to be used anywhere. That meant building a
                web app verses an iPhone, Android, or some hybrid app.
              </Text>
              <StyledRow>
                <Link href='/changelog/mobile-enhancements' color>
                  Continue reading
                </Link>

                <Image
                  width={240}
                  height={180}
                  src='/images/changelog/iphone-hemolog-light.png'
                />
              </StyledRow>

              <BlogPostFooter postSlug='mobile-enhancements' />
            </StyledPost>

            <StyledPost id='post-1'>
              <Text h4>Hello world...again</Text>
              <Text h6>Hemolog is back and better than ever</Text>
              <Spacer />

              <Divider>Update #1</Divider>
              <Text>
                Hemolog is back! After 8 years, I've built a reincarnation of
                the old iPhone app Hemolog. This time around, it does a bit more
                than just storing your treatment logs. In this incarnation,
                Hemolog is now a web app and helps you understand your logs by
                giving showing you stats.
              </Text>
              <Text>
                The original Hemolog was built with the help of a contract
                developer. This time around I've designed and built everything
                from the ground up with the purpose of being the best place to
                store your infusion data and learn from it.
              </Text>

              <StyledRow>
                <Link href='/changelog/hello-world-again' color>
                  Continue reading
                </Link>

                <Image
                  width={240}
                  height={166}
                  src='/images/insights-example.png'
                />
              </StyledRow>

              <BlogPostFooter postSlug='hello-world-again' />
            </StyledPost>
          </StyledChangelogContent>

          <Spacer y={2} />

          <BlogFooter />

          <Spacer y={5} />
        </StyledPageContent>
        <Footer />
      </StyledPage>
    </>
  )
}

export default Changelog

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

const StyledChangelogContent = styled.div`
  max-width: 480pt;
  margin: 0 auto;
`

const StyledPost = styled.section`
  padding-bottom: 64px;
`
const StyledRow = styled.div`
  display: flex;
  justify-content: 'space-between';

  a.link {
    display: block;
    width: 100%;
  }
`
