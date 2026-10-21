import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import PostFooter from '@/components/blog/postFooter'
import { CONFIG } from '@/lib/helpers'

export interface ChangelogPost {
  slug: string
  id: string
  number: string
  title: string
  subtitle: ReactNode
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  body: ReactNode
}

const linkClass =
  'text-ink underline decoration-primary-500 decoration-2 underline-offset-2'

export const changelogPosts: ChangelogPost[] = [
  {
    slug: 'api-enhancements',
    id: 'post-5',
    number: '5',
    title: 'Take Hemolog anywhere',
    subtitle: (
      <>
        Building on our{' '}
        <a href='https://raycast.com' className={linkClass}>
          Raycast
        </a>{' '}
        update, you can now take Hemolog with you anywhere—or have an AI agent
        interact with it to either log or review your data.
      </>
    ),
    image: {
      src: '/images/changelog/api-concept.svg',
      alt: 'Diagram of the Hemolog API connecting Raycast and AI agents',
      width: 800,
      height: 400,
    },
    body: (
      <>
        <p>
          Last update brought Hemolog straight into your keyboard with Raycast.
          Now we're opening up the platform with a robust API. Whether you are
          traveling light or delegating to an AI agent, your treatment logs are
          accessible anywhere you go.
        </p>
        <p>
          Everything you need is on the{' '}
          <Link href='/docs' className={linkClass}>
            API docs page
          </Link>
          : every endpoint, response shapes, and ready-to-run examples for
          cURL, JavaScript, Shortcuts, and Python.
        </p>
        <p>
          How it works: grab your API key from your{' '}
          <Link href='/app/profile' className={linkClass}>
            Profile
          </Link>{' '}
          page and send it as an{' '}
          <code className='font-mono text-[13px]'>Authorization: Bearer</code>{' '}
          header on each request. Keys are per-app — create as many as you
          like, name them so you know what's using them, and revoke them
          individually at any time (a revoked key stops working immediately).
          Treat each key like a password: anyone who has it can read your
          treatments and log new ones.
        </p>
      </>
    ),
  },
  {
    slug: 'raycast-extension',
    id: 'post-4',
    number: '4',
    title: 'Log treatments at the speed of light',
    subtitle: (
      <>
        A brand new way to log treatments, directly from your keyboard. Now
        available on Mac and Windows (beta) via{' '}
        <a href='https://raycast.com' className={linkClass}>
          Raycast.
        </a>
      </>
    ),
    image: {
      src: '/images/changelog/log-treatment.png',
      alt: 'Raycast extension for Hemolog',
      width: 1870,
      height: 1318,
    },
    body: (
      <p>
        One of my favorite tools to use on my Mac is{' '}
        <a href='https://raycast.com'>Raycast</a>. It's a productivity tool that
        lets you quickly launch apps, search the web, and run commands all from
        your keyboard.
      </p>
    ),
  },
  {
    slug: 'monoclonal-antibodies',
    id: 'post-3',
    number: '3',
    title: 'A brand new treatment type',
    subtitle:
      "It's finally here. Monoclonal antibodies officially can treat hemophilia, giving us a new method of getting our medicine in our body and a whole lot more.",
    image: {
      src: '/images/changelog/about-you.png',
      alt: 'About you section of the profile page',
      width: 543,
      height: 390,
    },
    body: (
      <>
        <p>
          I never thought I'd say this, but I no longer simply{' '}
          <strong>infuse</strong> to treat bleeds. I also{' '}
          <strong>inject</strong>.
        </p>
        <p>
          That might not sound like a huge difference off the bat, but I can
          assure you it is. Having to find a vein all the time is now a thing of
          the past, finally we can inject subcutaneously under the skin, like so
          many other people. I'm so excited for what this means for people with
          bad or damage veins and kids! It's just lessens the burden so much.
        </p>
      </>
    ),
  },
  {
    slug: 'mobile-enhancements',
    id: 'post-2',
    number: '2',
    title: 'Mobile enhancements',
    subtitle: (
      <>
        Looks great on your desktop <em>and</em> mobile devices!
      </>
    ),
    image: {
      src: '/images/changelog/iphone-hemolog-light.png',
      alt: 'Hemolog for iPhone',
      width: 3000,
      height: 2250,
    },
    body: (
      <p>
        I designed Hemolog to be used anywhere. That meant building a web app
        verses an iPhone, Android, or some hybrid app.
      </p>
    ),
  },
  {
    slug: 'hello-world-again',
    id: 'post-1',
    number: '1',
    title: 'Hello world...again',
    subtitle: 'Hemolog is back and better than ever',
    image: {
      src: '/images/insights-example.png',
      alt: 'Insights',
      width: 487,
      height: 337,
    },
    body: (
      <>
        <p>
          Hemolog is back! After 8 years, I've built a reincarnation of the old
          iPhone app Hemolog. This time around, it does a bit more than just
          storing your treatment logs. In this incarnation, Hemolog is now a web
          app and helps you understand your logs by giving showing you stats.
        </p>
        <p>
          The original Hemolog was built with the help of a contract developer.
          This time around I've designed and built everything from the ground up
          with the purpose of being the best place to store your treatment data
          and learn from it.
        </p>
      </>
    ),
  },
]

export function getChangelogPost(slug: string): ChangelogPost | undefined {
  return changelogPosts.find((post) => post.slug === slug)
}

export function ChangelogEntry({
  post,
  full = false,
}: {
  post: ChangelogPost
  full?: boolean
}) {
  const Title = full ? 'h1' : 'h2'

  return (
    <article
      id={post.id}
      className={
        full ? 'scroll-mt-8 pt-8' : 'scroll-mt-8 border-b border-line py-10'
      }
    >
      <p className='font-mono text-[11px] tracking-[0.14em] text-primary-700 uppercase'>
        Update {post.number}
      </p>
      <Title
        className={
          full
            ? 'mt-3 text-4xl text-ink sm:text-5xl'
            : 'mt-3 font-sans text-2xl font-medium tracking-tight text-ink'
        }
      >
        {full ? (
          post.title
        ) : (
          <Link
            href={`/changelog/${post.slug}`}
            className='underline decoration-transparent underline-offset-4 hover:decoration-primary-500'
          >
            {post.title}
          </Link>
        )}
      </Title>
      <div className='mt-5 space-y-4 text-base leading-relaxed text-ink [&_a]:underline [&_a]:decoration-primary-500 [&_a]:decoration-2 [&_a]:underline-offset-2'>
        <p className={full ? 'text-lg text-slate' : 'text-slate'}>
          {post.subtitle}
        </p>
        {post.body}
      </div>
      <Image
        src={post.image.src}
        alt={post.image.alt}
        width={post.image.width}
        height={post.image.height}
        priority={full}
        className='mt-6 h-auto w-full rounded-2xl border border-line bg-surface'
        sizes='(min-width: 720px) 672px, 100vw'
      />
      {full ? (
        <div className='mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-5'>
          <p className='text-sm text-slate'>
            <a href={CONFIG.blueskyUrl} className={linkClass}>
              Michael Schultz
            </a>
          </p>
          <PostFooter postId={post.id} />
        </div>
      ) : (
        <div className='mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3'>
          <Link
            href={`/changelog/${post.slug}`}
            className='text-sm font-medium text-ink underline decoration-primary-500 decoration-2 underline-offset-4'
          >
            Continue reading
          </Link>
          <PostFooter postId={post.id} />
        </div>
      )}
    </article>
  )
}
