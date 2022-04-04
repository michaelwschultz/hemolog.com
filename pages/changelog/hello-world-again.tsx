import Head from 'next/head'
import { Text, Divider, Display, Image, Spacer } from '@geist-ui/react'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'
import BlogFooter from 'components/blog/blogFooter'
import PostFooter from 'components/blog/postFooter'

const Changelog = (): JSX.Element => {
  const articleRichResults = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'Hello world... again',
    image: ['https://hemolog.com/images/insights-example.png'],
    datePublished: '2020-02-05T08:00:00+08:00',
    dateModified: '2020-02-05T09:20:00+08:00',
  }

  return (
    <>
      <Head>
        <title>Hemolog - Changelog</title>
        <script
          type='application/ld+json'
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
            <Text h5>
              Development blog about new features, fixes, and updates to Hemolog
            </Text>
            <Divider />

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

              <Display
                shadow
                caption='High level insights that help you understand your habits'
              >
                <Image src='/images/insights-example.png' alt='Insights' />
              </Display>

              <Text>
                These insights are calculated as you add more data. Filters will
                allow you to choose different time frames for viewing your data
                down the road giving you the best most comprehensive view into
                your treatment history ever. I’ve chosen a few insights that are
                interesting for me. If you have thoughts on what you would like
                to see just let me know.
              </Text>

              <Spacer />
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

const StyledPost = styled.article`
  padding-bottom: 64px;
`
