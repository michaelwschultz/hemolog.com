import Head from 'next/head'
import { Text, Divider, Spacer, Link, Note } from '@geist-ui/react'

import ChevronLeft from '@geist-ui/react-icons/chevronLeft'
import styled from 'styled-components'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'
import BlogFooter from 'components/blogFooter'
import BlogPostFooter from 'components/blogPostFooter'

const Changelog = (): JSX.Element => {
  const articleRichResults = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'How to contribute',
    image: ['https://hemolog.com/images/changelog/iphone-hemolog-light.png'],
    datePublished: '2021-07-22T08:00:00+08:00',
    dateModified: '2021-07-22T08:00:00+08:00',
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
            <Link href='/changelog' color>
              <StyledRow>
                <ChevronLeft />
                Back to list of updates
              </StyledRow>
            </Link>
            <Divider />

            <StyledPost id='post-3'>
              <Spacer y={3} />
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
              <Text>
                Building a project completely on your own can be an arguous
                task, but it isn't without it's beneifts. Being able to make all
                the decisions yourself is freeing beyond beleif. However, I
                realized something this year, that I think I can address with
                this project.
              </Text>
              <Text>
                So many designers and developers getting started in their carrer
                can find it hard to have production level work to show off. Heck
                even people who have been working for a while have a hard time
                in certain cases. Maybe their work is under an NDA, or the thing
                they worked on was never shipped through no fault of their own.
              </Text>
              <Text>
                Inviting more people to contribute to Hemolog is a way of
                expanding the project to be a practice ground for others and not
                just myself. So if you feel like you can contribute to Hemolog
                in some way,{' '}
                <Link color icon href='https://twitter.com/michaelschultz/'>
                  reach out on Twitter
                </Link>{' '}
                or check out the discussions page on our
                <Link
                  color
                  icon
                  href='https://github.com/michaelwschultz/hemolog.com/issues'
                >
                  Github repo
                </Link>{' '}
                for ways to get started.
              </Text>
              <Text></Text>
              {/* <Display shadow caption='Hemolog running on an iPhone 12'>
                <Image
                  width={640}
                  height={480}
                  src='/images/changelog/iphone-hemolog-light.png'
                />
              </Display> */}
              <Note label='Pro tip'>
                Don't have any experience with design or development but are
                interested in learning how an app gets made? Feel free to follow
                the conversion on Github.
              </Note>
              {/* <Display shadow caption='Hemolog app icon on iPhone'>
                <Image
                  width={640}
                  height={180}
                  src='/images/changelog/iphone-homescreen-app.jpg'
                />
              </Display> */}
              <Spacer />
              <BlogPostFooter postSlug='how-to-contribute' />
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

const StyledPost = styled.article`
  padding-bottom: 64px;
`

const StyledRow = styled.span`
  display: flex;
  align-items: center;
`
