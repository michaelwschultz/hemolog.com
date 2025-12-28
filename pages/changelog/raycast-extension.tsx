import Head from 'next/head'
import Image from 'next/image'
import { IconChevronLeft } from '@tabler/icons-react'

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
                Log treatments at the speed of light
              </h4>
              <h6 className='text-base font-medium text-gray-600 mb-4'>
                A brand new way to log treatments, directly from your keyboard.
                Now available on Mac and Windows (beta) via{' '}
                <a
                  href='https://raycast.com'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Raycast
                </a>
                .
              </h6>
              <div className='h-4' />
              <hr className='border-gray-200' />
              <div className='text-center text-sm font-medium text-gray-500 mb-4'>
                Update #4
              </div>
              <hr className='border-gray-200 mb-6' />
              <p className='text-gray-700 mb-4'>
                One of my favorite tools to use on my Mac is{' '}
                <a
                  href='https://raycast.com'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Raycast
                </a>
                . It's a productivity tool that lets you quickly launch apps,
                search the web, and run commands all from your keyboard.
              </p>
              <p className='text-gray-700 mb-6'>
                Raycast has an{' '}
                <a
                  href='https://www.raycast.com/extensions'
                  className='text-primary-500 hover:text-primary-600'
                >
                  extensions
                </a>{' '}
                ecosystem that lets you extend its functionality. I decided to
                build an extension for Hemolog that lets you log treatments
                directly from Raycast. It's super quick and easy to use, and
                it's available for free on the Raycast Store.
              </p>

              <div className='mb-6'>
                <Image
                  width={64}
                  height={64}
                  src='/images/changelog/log-treatment.png'
                  alt='Raycast extension for Hemolog'
                />
              </div>

              <p className='text-gray-700 mb-4'>
                To get started, you'll need to install{' '}
                <a
                  href='https://raycast.com'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Raycast
                </a>{' '}
                on your Mac or Windows PC! (the Windows app is currently in
                beta).
              </p>

              <div className='mb-6'>
                <a
                  title='Install Hemolog Raycast Extension'
                  href='https://www.raycast.com/michaelschultz/hemolog-raycast-extension'
                >
                  <Image
                    src='https://www.raycast.com/michaelschultz/hemolog-raycast-extension/install_button@2x.png?v=1.1'
                    width={200}
                    height={40}
                    alt='Install Hemolog Raycast Extension'
                  />
                </a>
              </div>

              <p className='text-gray-700 mb-8'>
                Once you have Raycast installed, you can install the Hemolog
                extension from the{' '}
                <a
                  href='https://www.raycast.com/michaelschultz/hemolog-raycast-extension'
                  className='text-primary-500 hover:text-primary-600'
                >
                  Raycast Store
                </a>
                . After that, you'll need to connect your Hemolog account to the
                extension. It's as easy as logging into your hemolog account and
                visiting your{' '}
                <a
                  href='https://hemolog.com/profile'
                  className='text-primary-500 hover:text-primary-600'
                >
                  profile page
                </a>
                . Here you'll find your <strong>API key</strong>. Launch the
                Hemolog extension in Raycast and you'll be prompted to enter
                your <strong>API key</strong>. Paste it in, and you're all set!
              </p>

              <PostFooter postId='post-4' />
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
