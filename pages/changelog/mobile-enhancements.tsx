import Head from 'next/head'
import {
  Text,
  Divider,
  Display,
  Image,
  Spacer,
  Link,
  Note,
} from '@geist-ui/react'
import Share from '@geist-ui/react-icons/share'
import ChevronLeft from '@geist-ui/react-icons/chevronLeft'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'
import BlogFooter from 'components/blog/blogFooter'
import PostFooter from 'components/blog/postFooter'

const Changelog = (): JSX.Element => {
  const articleRichResults = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'Mobile enhancements',
    image: ['https://hemolog.com/images/changelog/iphone-hemolog-light.png'],
    datePublished: '2020-02-05T08:00:00+08:00',
    dateModified: '2020-02-05T09:20:00+08:00',
  }

  return (
    <>
      <Head>
        <title>Hemolog - Changelog</title>
        <script
          type='application/ld+json'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: okay here
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleRichResults),
          }}
        />
      </Head>
      <StyledPage>
        <StaticHeader />
        <StyledPageContent>
          <StyledChangelogContent>
            <Text h2>Changelog</Text>
            <Link href='/changelog' color>
              <StyledRow>
                <ChevronLeft />
                Back to list of updates
              </StyledRow>
            </Link>
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
              <Text>
                The original Hemolog was built with the help of a contract
                developer. This time around I’ve designed and built everything
                from the ground up with the purpose of being the best place to
                store your infusion data and learn from it.
              </Text>
              <Display shadow caption='Hemolog running on an iPhone 12'>
                <Image
                  src='/images/changelog/iphone-hemolog-light.png'
                  alt='Hemolog for iPhone'
                />
              </Display>
              <Note label='Pro tip'>
                Visit Hemolog.com using Safari on your iPhone and click the{' '}
                <Share size={16} /> icon, then scroll down to ’Add to Home
                Screen’ to create an app icon.
              </Note>
              <Display shadow caption='Hemolog app icon on iPhone'>
                <Image
                  src='/images/changelog/iphone-homescreen-app.jpg'
                  alt='Hemolog app icon on iPhone'
                />
              </Display>
              <Spacer />
              <span role='img' aria-label='sunglasses'>
                😎
              </span>{' '}
              <Link
                color
                icon
                href='https://github.com/michaelwschultz/hemolog.com/issues/9'
              >
                Sneak peak of what’s coming next
              </Link>
              <PostFooter postId='post-2' />
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

const StyledPost = styled.article`
  padding-bottom: 64px;
`

const StyledRow = styled.span`
  display: flex;
  align-items: center;
`
