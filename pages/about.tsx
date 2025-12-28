import Head from 'next/head'
import NextLink from 'next/link'
import Image from 'next/image'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'

const About = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Hemolog - About</title>
      </Head>
      <div className='min-h-screen flex flex-col max-w-[850pt] w-full mx-auto'>
        <StaticHeader />
        <main className='flex-1 px-6 pt-10 pb-16'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold mb-2'>The story so far</h2>
            <h5 className='text-lg font-semibold text-gray-600 mb-8'>
              More than you would ever want to know about Hemolog
            </h5>
            <hr className='border-gray-200 mb-12' />

            <div className='mb-8'>
              <Image
                height={200}
                width={400}
                src='/images/hemolog-2-hero.png'
                alt='Hemolog 2'
                className='w-full max-w-md mx-auto rounded-lg shadow-lg'
              />
            </div>

            <div className='prose prose-gray max-w-none mb-8'>
              <p className='text-gray-700 mb-4'>
                Let's face it, there are some exciting developments in the world
                of Hemophilia research. Honestly, it's not <i>just</i> research
                anymore. Clinical trials are happening now across the globe.
                Gene therapy is definitely going to change things for the
                better, it's just a matter of when it's available to all of us.
              </p>

              <p className='text-gray-700 mb-4'>
                That being said, it's still important to keep track of your
                treatments. Maybe even more now than ever. If getting on a trial
                is something you're interested in, knowing how many bleeds you
                were having before is really important.
              </p>

              <p className='text-gray-700 mb-4'>
                Trial or not, keeping track of your treatment habits can be hard
                and the tools we have aren't great. Hemolog is simple. You track
                your treatments and Hemolog gives you instant feedback.
              </p>

              <p className='text-gray-700 mb-8'>
                Insights are something that I always wanted to be a part of
                Hemolog and now they're finally here.
              </p>
            </div>

            <figure className='mb-8'>
              <Image
                src='/images/insights-example.png'
                alt='Insights example'
                width={800}
                height={400}
                className='w-full rounded-lg shadow-lg'
              />
              <figcaption className='text-sm text-gray-600 mt-2 text-center'>
                High level insights that help you understand your habits
              </figcaption>
            </figure>

            <p className='text-gray-700 mb-8'>
              These insights are calculated as you log your treatments. Filter
              by year for a comprehensive view into your treatment history. I've
              chosen a few insights that are interesting to me. If you have
              thoughts on what you would like to see, just let me know.
            </p>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-12'>
              <div className='font-semibold text-blue-800 mb-1'>Note</div>
              <div className='text-blue-700'>
                Development is ongoing. Check out the{' '}
                <a
                  href='/changelog'
                  className='text-blue-600 hover:text-blue-800 underline'
                >
                  development blog
                </a>{' '}
                for updates and changes.
              </div>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-8 mb-12'>
              <div className='flex-1'>
                <p className='text-lg text-gray-600 mb-4'>
                  Now that Hemolog is back, I hope you enjoy using it as much as
                  I have. It's up to all of us to keep each other accountable.
                  You can{' '}
                  <a
                    href='/emergency/mike29'
                    className='text-primary-500 hover:text-primary-600 underline'
                  >
                    view my emergency page
                  </a>{' '}
                  at any time to verify I've been keeping up with my prophy
                  regimen.
                </p>
                <p className='text-xl font-semibold'>— Michael Schultz</p>
              </div>
              <div className='flex-shrink-0'>
                <Image
                  width={120}
                  height={120}
                  src='/images/michael-schultz.jpg'
                  alt='Michael Schultz'
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default About
