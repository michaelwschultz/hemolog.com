import Head from 'next/head'
import { Text, Divider, Spacer, Link } from '@geist-ui/react'

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
    headline: 'A brand new treatment type',
    image: ['https://hemolog.com/images/changelog/iphone-hemolog-light.png'],
    datePublished: '2022-04-04T07:09:00+08:00',
    dateModified: '2022-04-04T07:09:00+08:00',
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
              <Text>
                I’m now using a drug called{' '}
                <a href='https://www.hemlibra.com'>Hemlibra</a> which is one of
                these new{' '}
                <a href='https://www.mayoclinic.org/diseases-conditions/cancer/in-depth/monoclonal-antibody/art-20047808'>
                  monoclonal antibodies
                </a>
                , I needed to add a completely new category to Hemolog. This
                wasn’t as easy as just adding a new medication. The first thing
                you’ll notice is that I decided to rename <i>infusions</i>{' '}
                across the site to <i>treatments</i>. This means we can now
                specify between infusions and injections when logging a
                treatment.
              </Text>
              <Text>
                Once more drugs are on the market I’ll update the list of
                medications available, but for now feel free to add your own
                manually. To update this, visit your{' '}
                <a href='https://hemolog.com/profile'>profile page</a>.
              </Text>
              <Spacer />
              <PostFooter postId='post-3' />
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
