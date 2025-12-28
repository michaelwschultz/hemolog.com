import Head from 'next/head'
import { IconChevronLeft } from '@tabler/icons-react'

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
      <div className='min-h-screen flex flex-col max-w-[850pt] w-full mx-auto'>
        <StaticHeader />
        <main className='flex-1 px-6 pt-10 pb-16'>
          <div className='max-w-2xl mx-auto'>
            <h2 className='text-3xl font-bold mb-2'>Changelog</h2>
            <a
              href='/changelog'
              className='flex items-center text-primary-500 hover:text-primary-600 mb-8'
            >
              <IconChevronLeft className='w-4 h-4 mr-2' />
              Back to list of updates
            </a>
            <hr className='border-gray-200 mb-12' />

            <article id='post-3' className='pb-16'>
              <div className='h-12' />
              <h4 className='text-xl font-semibold mb-2'>
                A brand new treatment type
              </h4>
              <h6 className='text-base font-medium text-gray-600 mb-4'>
                It's finally here. Monoclonal antibodies officially can treat
                hemophilia, giving us a new method of getting our medicine in
                our body and a whole lot more.
              </h6>
              <div className='h-4' />
              <hr className='border-gray-200' />
              <div className='text-center text-sm font-medium text-gray-500 mb-4'>
                Update #3
              </div>
              <hr className='border-gray-200 mb-6' />
              <p className='text-gray-700 mb-4'>
                I never thought I'd say this, but I no longer simply{' '}
                <strong>infuse</strong> to treat bleeds. I also{' '}
                <strong>inject</strong>.
              </p>
              <p className='text-gray-700 mb-4'>
                That might not sound like a huge difference off the bat, but I
                can assure you it is. Having to find a vein all the time is now
                a thing of the past, finally we can inject subcutaneously under
                the skin, like so many other people. I'm so excited for what
                this means for people with bad or damage veins and kids! It's
                just lessens the burden so much.
              </p>
              <p className='text-gray-700 mb-4'>
                I'm now using a drug called{' '}
                <a
                  href='https://www.hemlibra.com'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Hemlibra
                </a>{' '}
                which is one of these new{' '}
                <a
                  href='https://www.mayoclinic.org/diseases-conditions/cancer/in-depth/monoclonal-antibody/art-20047808'
                  className='text-primary-500 hover:text-primary-600'
                >
                  monoclonal antibodies
                </a>
                , I needed to add a completely new category to Hemolog. This
                wasn't as easy as just adding a new medication. The first thing
                you'll notice is that I decided to rename <em>infusions</em>{' '}
                across the site to <em>treatments</em>. This means we can now
                specify between infusions and injections when logging a
                treatment.
              </p>
              <p className='text-gray-700 mb-8'>
                Once more drugs are on the market I'll update the list of
                medications available, but for now feel free to add your own
                manually. To update this, visit your{' '}
                <a
                  href='https://hemolog.com/profile'
                  className='text-primary-500 hover:text-primary-600'
                >
                  profile page
                </a>
                .
              </p>

              <PostFooter postId='post-3' />
            </article>
          </div>

          <div className='h-8' />

          <BlogFooter />

          <div className='h-20' />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Changelog
