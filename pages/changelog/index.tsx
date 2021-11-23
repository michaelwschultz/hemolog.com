import Head from 'next/head'
import {
  Text,
  Divider,
  Image,
  Spacer,
  Grid,
  User,
  Link,
  useToasts,
  useClipboard,
  useTheme,
} from '@geist-ui/react'
import Share from '@geist-ui/react-icons/share'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'
import BlogFooter from 'components/blogFooter'

const Changelog = (): JSX.Element => {
  const [, setToast] = useToasts()
  const { copy } = useClipboard()
  const handleCopy = (postId: string) => {
    copy(`https://hemolog.com/changelog#${postId}`)
    setToast({ type: 'success', text: 'Link copied!' })
  }
  const theme = useTheme()

  const PostFooter = ({ postId }: { postId: string }) => {
    return (
      <>
        <Spacer h={2} />
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
        <Spacer h={2} />
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
          <StyledChangelogContent>
            <Text h2>Changelog</Text>
            <Text h4 style={{ color: theme.palette.secondary }}>
              Development blog about new features, fixes, and updates to Hemolog
            </Text>
            <Divider />

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
                  width={240}
                  height={180}
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
                  width={240}
                  height={166}
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
