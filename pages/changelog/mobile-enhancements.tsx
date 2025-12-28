import Head from 'next/head'
import { IconShare, IconChevronLeft } from '@tabler/icons-react'
import Image from 'next/image'

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

            <article id='post-2' className='pb-16'>
              <div className='h-12' />
              <h4 className='text-xl font-semibold mb-2'>
                Mobile enhancements
              </h4>
              <h6 className='text-base font-medium text-gray-600 mb-4'>
                Looks great on your desktop <em>and</em> mobile devices!
              </h6>
              <div className='h-4' />
              <hr className='border-gray-200' />
              <div className='text-center text-sm font-medium text-gray-500 mb-4'>
                Update #2
              </div>
              <hr className='border-gray-200 mb-6' />
              <p className='text-gray-700 mb-4'>
                I designed Hemolog to be used anywhere. That meant building a
                web app verses an iPhone, Android, or some hybrid app.
              </p>
              <p className='text-gray-700 mb-8'>
                The original Hemolog was built with the help of a contract
                developer. This time around I've designed and built everything
                from the ground up with the purpose of being the best place to
                store your infusion data and learn from it.
              </p>

              <figure className='mb-8'>
                <Image
                  src='/images/changelog/iphone-hemolog-light.png'
                  alt='Hemolog for iPhone'
                  width={400}
                  height={600}
                  className='w-full rounded-lg shadow-lg'
                />
                <figcaption className='text-sm text-gray-600 mt-2 text-center'>
                  Hemolog running on an iPhone 12
                </figcaption>
              </figure>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8'>
                <div className='font-semibold text-blue-800 mb-1'>Pro tip</div>
                <div className='text-blue-700'>
                  Visit Hemolog.com using Safari on your iPhone and click the{' '}
                  <IconShare size={16} className='inline' /> icon, then scroll
                  down to 'Add to Home Screen' to create an app icon.
                </div>
              </div>

              <figure className='mb-8'>
                <Image
                  src='/images/changelog/iphone-homescreen-app.jpg'
                  alt='Hemolog app icon on iPhone'
                  width={400}
                  height={300}
                  className='w-full rounded-lg shadow-lg'
                />
                <figcaption className='text-sm text-gray-600 mt-2 text-center'>
                  Hemolog app icon on iPhone
                </figcaption>
              </figure>

              <div className='mb-8'>
                <span role='img' aria-label='sunglasses' className='text-xl'>
                  😎
                </span>{' '}
                <a
                  href='https://github.com/michaelwschultz/hemolog.com/issues/9'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Sneak peak of what's coming next
                </a>
              </div>

              <PostFooter postId='post-2' />
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
