'use client'

import Image from 'next/image'
import BlogFooter from '@/components/blog/blogFooter'
import PostFooter from '@/components/blog/postFooter'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

const Changelog = (): JSX.Element => {
  return (
    <div className='min-h-screen flex flex-col max-w-[850pt] w-full mx-auto'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-10 pb-16'>
        <div className='max-w-2xl mx-auto'>
          <h2 className='text-3xl font-bold mb-2'>Changelog</h2>
          <h4 className='text-lg font-semibold text-gray-600 mb-8'>
            Development blog about new features, fixes, and updates to Hemolog
          </h4>
          <hr className='border-gray-200 mb-12' />

          <section id='post-4' className='pb-16'>
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
            <p className='text-gray-700 mb-6'>
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
            <div className='flex justify-between items-center mb-8'>
              <a
                href='/changelog/raycast-extension'
                className='text-primary-500 hover:text-primary-600'
              >
                Continue reading
              </a>

              <div className='w-[400px] h-auto relative aspect-square'>
                <Image
                  src='/images/changelog/log-treatment.png'
                  alt='Raycast extension for Hemolog'
                  fill
                  sizes='400px'
                  className='object-contain'
                />
              </div>
            </div>

            <PostFooter postId='post-4' />
          </section>

          <section id='post-3' className='pb-16'>
            <div className='h-12' />
            <h4 className='text-xl font-semibold mb-2'>
              A brand new treatment type
            </h4>
            <h6 className='text-base font-medium text-gray-600 mb-4'>
              It's finally here. Monoclonal antibodies officially can treat
              hemophilia, giving us a new method of getting our medicine in our
              body and a whole lot more.
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
            <p className='text-gray-700 mb-6'>
              That might not sound like a huge difference off the bat, but I can
              assure you it is. Having to find a vein all the time is now a
              thing of the past, finally we can inject subcutaneously under the
              skin, like so many other people. I'm so excited for what this
              means for people with bad or damage veins and kids! It's just
              lessens the burden so much.
            </p>
            <div className='flex justify-between items-center mb-8'>
              <a
                href='/changelog/monoclonal-antibodies'
                className='text-primary-500 hover:text-primary-600'
              >
                Continue reading
              </a>

              <div className='w-[400px] h-auto relative aspect-square'>
                <Image
                  src='/images/changelog/about-you.png'
                  alt='About you section of the profile page'
                  fill
                  sizes='400px'
                  className='object-contain'
                />
              </div>
            </div>

            <PostFooter postId='post-3' />
          </section>

          <section id='post-2' className='pb-16'>
            <div className='h-12' />
            <h4 className='text-xl font-semibold mb-2'>Mobile enhancements</h4>
            <h6 className='text-base font-medium text-gray-600 mb-4'>
              Looks great on your desktop <em>and</em> mobile devices!
            </h6>
            <div className='h-4' />
            <hr className='border-gray-200' />
            <div className='text-center text-sm font-medium text-gray-500 mb-4'>
              Update #2
            </div>
            <hr className='border-gray-200 mb-6' />
            <p className='text-gray-700 mb-6'>
              I designed Hemolog to be used anywhere. That meant building a web
              app verses an iPhone, Android, or some hybrid app.
            </p>
            <div className='flex justify-between items-center mb-8'>
              <a
                href='/changelog/mobile-enhancements'
                className='text-primary-500 hover:text-primary-600'
              >
                Continue reading
              </a>

              <div className='w-[400px] h-auto relative aspect-square'>
                <Image
                  src='/images/changelog/iphone-hemolog-light.png'
                  alt='Hemolog for iPhone'
                  fill
                  sizes='400px'
                  className='object-contain'
                />
              </div>
            </div>

            <PostFooter postId='post-2' />
          </section>

          <section id='post-1' className='pb-16'>
            <h4 className='text-xl font-semibold mb-2'>Hello world...again</h4>
            <h6 className='text-base font-medium text-gray-600 mb-4'>
              Hemolog is back and better than ever
            </h6>
            <div className='h-4' />

            <hr className='border-gray-200' />
            <div className='text-center text-sm font-medium text-gray-500 mb-4'>
              Update #1
            </div>
            <hr className='border-gray-200 mb-6' />
            <p className='text-gray-700 mb-4'>
              Hemolog is back! After 8 years, I've built a reincarnation of the
              old iPhone app Hemolog. This time around, it does a bit more than
              just storing your treatment logs. In this incarnation, Hemolog is
              now a web app and helps you understand your logs by giving showing
              you stats.
            </p>
            <p className='text-gray-700 mb-6'>
              The original Hemolog was built with the help of a contract
              developer. This time around I've designed and built everything
              from the ground up with the purpose of being the best place to
              store your treatment data and learn from it.
            </p>

            <div className='flex justify-between items-center mb-8'>
              <a
                href='/changelog/hello-world-again'
                className='text-primary-500 hover:text-primary-600'
              >
                Continue reading
              </a>

              <div className='w-[400px] h-auto relative aspect-square'>
                <Image
                  src='/images/insights-example.png'
                  alt='Insights'
                  fill
                  sizes='400px'
                  className='object-contain'
                />
              </div>
            </div>

            <PostFooter postId='post-1' />
          </section>
        </div>

        <div className='h-8' />

        <BlogFooter />

        <div className='h-20' />
      </main>
      <Footer />
    </div>
  )
}

export default Changelog
