import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import BlogFooter from '@/components/blog/blogFooter'
import PostFooter from '@/components/blog/postFooter'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

const ChangelogPost = async ({ params }: PageProps): Promise<ReactElement> => {
  const { slug } = await params

  // For now, redirect to 404 for unknown slugs
  // In a real implementation, you would fetch content based on slug
  if (
    ![
      'hello-world-again',
      'mobile-enhancements',
      'monoclonal-antibodies',
      'raycast-extension',
    ].includes(slug)
  ) {
    notFound()
  }

  const postData = getPostData(slug)

  return (
    <div className='page'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-6 pb-16 sm:pt-10'>
        <div className='mx-auto max-w-2xl'>
          <p className='mb-3 text-[13px] font-medium tracking-[0.16em] text-primary-700 uppercase'>
            Blog
          </p>
          <h1 className='text-4xl text-ink sm:text-5xl'>Changelog</h1>
          <p className='mt-3 text-lg text-slate'>
            New features, fixes, and updates to Hemolog
          </p>
          <div className='mt-8 mb-12 h-px bg-line' />

          <article className='pb-16'>
            <h4 className='text-xl font-semibold mb-2'>{postData.title}</h4>
            <h6 className='text-base font-medium text-gray-600 mb-4'>
              {postData.subtitle}
            </h6>
            <div className='h-4' />

            <hr className='border-gray-200' />
            <div className='text-center text-sm font-medium text-gray-500 mb-4'>
              {postData.updateLabel}
            </div>
            <hr className='border-gray-200 mb-6' />

            <div className='text-gray-700 mb-6'>{postData.content}</div>

            <PostFooter postId={postData.postId} />
          </article>
        </div>

        <div className='h-8' />

        <BlogFooter />

        <div className='h-20' />
      </main>
      <Footer />
    </div>
  )
}

function getPostData(slug: string) {
  const posts = {
    'hello-world-again': {
      title: 'Hello world...again',
      subtitle: 'Hemolog is back and better than ever',
      updateLabel: 'Update #1',
      postId: 'post-1',
      richResults: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: 'Hello world... again',
        image: ['https://hemolog.com/images/insights-example.png'],
        datePublished: '2020-02-05T08:00:00+08:00',
        dateModified: '2020-02-05T09:20:00+08:00',
      },
      content: (
        <>
          <p className='text-gray-700 mb-4'>
            Hemolog is back! After 8 years, I've built a reincarnation of the
            old iPhone app Hemolog. This time around, it does a bit more than
            just storing your treatment logs. In this incarnation, Hemolog is
            now a web app and helps you understand your logs by showing you
            stats.
          </p>
          <p className='text-gray-700 mb-6'>
            The original Hemolog was built with the help of a contract
            developer. This time around I've designed and built everything from
            the ground up with the purpose of being the best place to store your
            treatment data and learn from it.
          </p>
        </>
      ),
    },
    'mobile-enhancements': {
      title: 'Mobile enhancements',
      subtitle: 'Looks great on your desktop and mobile devices!',
      updateLabel: 'Update #2',
      postId: 'post-2',
      richResults: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: 'Mobile enhancements',
        image: [
          'https://hemolog.com/images/changelog/iphone-hemolog-light.png',
        ],
        datePublished: '2020-02-05T08:00:00+08:00',
        dateModified: '2020-02-05T09:20:00+08:00',
      },
      content: (
        <>
          <p className='text-gray-700 mb-6'>
            I designed Hemolog to be used anywhere. That meant building a web
            app verses an iPhone, Android, or some hybrid app.
          </p>
        </>
      ),
    },
    'monoclonal-antibodies': {
      title: 'A brand new treatment type',
      subtitle:
        "It's finally here. Monoclonal antibodies officially can treat hemophilia, giving us a new method of getting our medicine in our body and a whole lot more.",
      updateLabel: 'Update #3',
      postId: 'post-3',
      richResults: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: 'A brand new treatment type',
        image: ['https://hemolog.com/images/changelog/about-you.png'],
        datePublished: '2020-02-05T08:00:00+08:00',
        dateModified: '2020-02-05T09:20:00+08:00',
      },
      content: (
        <>
          <p className='text-gray-700 mb-4'>
            I never thought I'd say this, but I no longer simply{' '}
            <strong>infuse</strong> to treat bleeds. I also{' '}
            <strong>inject</strong>.
          </p>
          <p className='text-gray-700 mb-6'>
            That might not sound like a huge difference off the bat, but I can
            assure you it is. Having to find a vein all the time is now a thing
            of the past, finally we can inject subcutaneously under the skin,
            like so many other people. I'm so excited for what this means for
            people with bad or damage veins and kids! It's just lessens the
            burden so much.
          </p>
        </>
      ),
    },
    'raycast-extension': {
      title: 'Log treatments at the speed of light',
      subtitle:
        'A brand new way to log treatments, directly from your keyboard. Now available on Mac and Windows (beta) via Raycast.',
      updateLabel: 'Update #4',
      postId: 'post-4',
      richResults: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: 'Log treatments at the speed of light',
        image: ['https://hemolog.com/images/changelog/log-treatment.png'],
        datePublished: '2020-02-05T08:00:00+08:00',
        dateModified: '2020-02-05T09:20:00+08:00',
      },
      content: (
        <>
          <p className='text-gray-700 mb-6'>
            One of my favorite tools to use on my Mac is{' '}
            <a
              href='https://raycast.com'
              className='text-primary-500 hover:text-primary-600'
            >
              Raycast
            </a>
            . It's a productivity tool that lets you quickly launch apps, search
            the web, and run commands all from your keyboard.
          </p>
        </>
      ),
    },
  }

  return posts[slug as keyof typeof posts] || posts['hello-world-again']
}

export default ChangelogPost
