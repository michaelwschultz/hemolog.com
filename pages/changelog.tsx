import Head from 'next/head'
import {
  Text,
  Divider,
  Display,
  Image,
  Spacer,
  Grid,
  User,
  Link,
  useToasts,
  useClipboard,
  Note,
} from '@geist-ui/react'
import Share from '@geist-ui/react-icons/share'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'

const Changelog = (): JSX.Element => {
  const [, setToast] = useToasts()
  const { copy } = useClipboard()
  const handleCopy = (postId: string) => {
    copy(`https://hemolog.com/changelog#${postId}`)
    setToast({ type: 'success', text: 'Link copied!' })
  }

  const PostFooter = ({ postId }: { postId: string }) => {
    return (
      <>
        <Spacer y={2} />
        <Grid.Container gap={2} alignItems='center'>
          <Grid xs={22}>
            <User src='/images/michael-avatar.jpg' name='Michael Schultz'>
              <User.Link href='https://twitter.com/michaelschultz'>
                @michaelschultz
              </User.Link>
            </User>
          </Grid>
          <Grid xs={2}>
            <div style={{ cursor: 'pointer' }}>
              <Share color='#FF062C' onClick={() => handleCopy(postId)} />
            </div>
          </Grid>
        </Grid.Container>
        <Divider />
        <Spacer y={2} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Hemolog - Changelog</title>
      </Head>
      <StyledPage>
        <StaticHeader />
        <StyledPageContent>
          <Text h2>Changelog</Text>
          <Text h5>
            Development blog of updates and changes made to Hemolog
          </Text>
          <Divider />

          <StyledChangelogContent>
            <StyledPost id='post-2'>
              <Spacer y={3} />
              <Text h4>Mobile enhancements</Text>
              <Text h6>
                Looks great on your desktop <i>and</i> mobile!
              </Text>
              <Spacer />
              <Divider>February 3, 2021</Divider>
              <Text>
                I designed Hemolog to be used anywhere. That meant building a
                web app verses an iPhone, Android, or some hybrid app.
              </Text>
              <Text>
                The original Hemolog was built with the help of a contract
                developer. This time around I've designed and built everything
                from the ground up with the purpose of being the best place to
                store your infusion data and learn from it.
              </Text>

              <Display shadow caption='Hemolog running on an iPhone 12'>
                <Image
                  width={640}
                  height={480}
                  src='/images/changelog/iphone-hemolog-light.png'
                />
              </Display>

              <Note label='Pro tip'>
                Visit Hemolog.com using Safari on your iPhone and click the{' '}
                <Share size={16} /> icon, then scroll down to 'Add to Home
                Screen' to create an app icon.
              </Note>

              <Display shadow caption='Hemolog app icon on iPhone'>
                <Image
                  width={640}
                  height={180}
                  src='/images/changelog/iphone-homescreen-app.jpg'
                />
              </Display>

              <Spacer />
              <Link
                color
                icon
                href='https://github.com/michaelwschultz/hemolog.com/issues/9'
              >
                Sneak peak of what's coming next{' '}
              </Link>
              <span role='img' aria-label='sunglasses'>
                😎
              </span>
              <PostFooter postId='post-2' />
            </StyledPost>

            <StyledPost id='post-1'>
              <Text h4>Hello world...again</Text>
              <Text h6>Hemolog is back and better than ever</Text>
              <Spacer />

              <Divider>February 1, 2021</Divider>
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

              <Display
                shadow
                caption='High level insights that help you understand your habits'
              >
                <Image
                  width={486}
                  height={377}
                  src='/images/insights-example.png'
                />
              </Display>

              <Text>
                These insights are calculated as you add more data. Filters will
                allow you to choose different time frames for viewing your data
                down the road giving you the best most comprehensive view into
                your treatment history ever. I've chosen a few insights that are
                interesting for me. If you have thoughts on what you would like
                to see just let me know.
              </Text>

              <Spacer />
              <PostFooter postId='post-1' />
            </StyledPost>
          </StyledChangelogContent>

          <Spacer y={2} />

          <Grid.Container gap={2} alignItems='center'>
            <Grid xs={24} sm={16}>
              <Text h3></Text>
              <Text h4>
                Designed and developed by Michael Schultz in Oakland,
                California.
              </Text>
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
  padding: 0 24px;
`

const StyledChangelogContent = styled.div`
  max-width: 480pt;
  margin: 0 auto;
`

const StyledPost = styled.section`
  padding-bottom: 64px;
`
