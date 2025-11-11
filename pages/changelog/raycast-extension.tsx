import Head from 'next/head'
import { Text, Divider, Spacer, Link, Image } from '@geist-ui/react'

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
    headline: 'Log treatments at the speed of light',
    image: ['https://hemolog.com/images/changelog/raycast.png'],
    datePublished: '2025-09-22T06:09:00+08:00',
    dateModified: '2025-09-22T06:09:00+08:00',
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

            <StyledPost id='post-3'>
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
              <Text>
                Raycast has an{' '}
                <a href='https://www.raycast.com/extensions'>extensions</a>{' '}
                ecosystem that lets you extend its functionality. I decided to
                build an extension for Hemolog that lets you log treatments
                directly from Raycast. It’s super quick and easy to use, and
                it’s available for free on the Raycast Store.
              </Text>
              <Image
                width={64}
                src='/images/changelog/log-treatment.png'
                alt='Raycast extension for Hemolog'
              />
              <Text>
                To get started, you’ll need to install{' '}
                <a href='https://raycast.com'>Raycast</a> on your Mac or Windows
                PC! (the Windows app is currently in beta).
              </Text>
              <a
                title='Install Hemolog Raycast Extension'
                href='https://www.raycast.com/michaelschultz/hemolog-raycast-extension'
              >
                <Image
                  src='https://www.raycast.com/michaelschultz/hemolog-raycast-extension/install_button@2x.png?v=1.1'
                  width={20}
                  alt='Screenshot of Hemolog Raycast Extension in action.'
                />
              </a>
              <Text>
                Once you have Raycast installed, you can install the Hemolog
                extension from the{' '}
                <a href='https://www.raycast.com/michaelschultz/hemolog-raycast-extension'>
                  Raycast Store
                </a>
                . After that, you’ll need to connect your Hemolog account to the
                extension. It’s as easy as logging into your hemolog account and
                visiting your{' '}
                <a href='https://hemolog.com/profile'>profile page</a>. Here
                you’ll find your <b>API key</b>. Launch the Hemolog extension in
                Raycast and you’ll be prompted to enter your <b>API key</b>.
                Paste it in, and you’re all set!
              </Text>
              <Spacer />
              <PostFooter postId='post-4' />
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
