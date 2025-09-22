import Head from 'next/head'
import { Text, Divider, Image, Spacer, Link, useTheme } from '@geist-ui/react'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'
import BlogFooter from 'components/blog/blogFooter'
import PostFooter from 'components/blog/postFooter'

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

            <StyledPost id='post-4'>
              <Spacer h={3} />
              <Text h4>Log treatments at the speed of light</Text>
              <Text h6>
                A brand new way to log treatments, directly from your keyboard.
                Now available on Mac and Windows (beta) via{' '}
                <a href='https://raycast.com'>Raycast</a>.
              </Text>
              <Spacer />
              <Divider>Update #4</Divider>
              <Text>
                One of my favorite tools to use on my Mac is{' '}
                <a href='https://raycast.com'>Raycast</a>. It’s a productivity
                tool that lets you quickly launch apps, search the web, and run
                commands all from your keyboard.
              </Text>
              <StyledRow>
                <Link href='/changelog/raycast-extension' color>
                  Continue reading
                </Link>

                <Image
                  width={40}
                  src='/images/changelog/log-treatment.png'
                  alt='Raycast extension for Hemolog'
                />
              </StyledRow>

              <PostFooter postId='post-4' />
            </StyledPost>

            <StyledPost id='post-3'>
              <Spacer h={3} />
              <Text h4>A brand new treatment type</Text>
              <Text h6>
                It’s finally here. Monoclonal antibodies officially can treat
                hemophilia, giving us a new method of getting our medicine in
                our body and a whole lot more.
              </Text>
              <Spacer />
              <Divider>Update #3</Divider>
              <Text>
                I never thought I’d say this, but I no longer simply{' '}
                <b>infuse</b> to treat bleeds. I also <b>inject</b>.
              </Text>
              <Text>
                That might not sound like a huge difference off the bat, but I
                can assure you it is. Having to find a vein all the time is now
                a thing of the past, finally we can inject subcutaneously under
                the skin, like so many other people. I’m so excited for what
                this means for people with bad or damage veins and kids! It’s
                just lessens the burden so much.
              </Text>
              <StyledRow>
                <Link href='/changelog/monoclonal-antibodies' color>
                  Continue reading
                </Link>

                <Image
                  width={40}
                  src='/images/changelog/about-you.png'
                  alt='About you section of the profile page'
                />
              </StyledRow>

              <PostFooter postId='post-3' />
            </StyledPost>

            <StyledPost id='post-2'>
              <Spacer h={3} />
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
                  width={40}
                  src='/images/changelog/iphone-hemolog-light.png'
                  alt='Hemolog for iPhone'
                />
              </StyledRow>

              <PostFooter postId='post-2' />
            </StyledPost>

            <StyledPost id='post-1'>
              <Text h4>Hello world...again</Text>
              <Text h6>Hemolog is back and better than ever</Text>
              <Spacer />

              <Divider>Update #1</Divider>
              <Text>
                Hemolog is back! After 8 years, I’ve built a reincarnation of
                the old iPhone app Hemolog. This time around, it does a bit more
                than just storing your treatment logs. In this incarnation,
                Hemolog is now a web app and helps you understand your logs by
                giving showing you stats.
              </Text>
              <Text>
                The original Hemolog was built with the help of a contract
                developer. This time around I’ve designed and built everything
                from the ground up with the purpose of being the best place to
                store your infusion data and learn from it.
              </Text>

              <StyledRow>
                <Link href='/changelog/hello-world-again' color>
                  Continue reading
                </Link>

                <Image
                  width={40}
                  src='/images/insights-example.png'
                  alt='Insights'
                />
              </StyledRow>

              <PostFooter postId='post-1' />
            </StyledPost>
          </StyledChangelogContent>

          <Spacer h={2} />

          <BlogFooter />

          <Spacer h={5} />
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
