import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

const linkClass =
  'text-ink underline decoration-primary-500 decoration-2 underline-offset-2'

const About = (): ReactElement => {
  return (
    <div className='page'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-6 pb-16 sm:pt-10'>
        <article className='mx-auto max-w-2xl'>
          <p className='mb-3 text-[13px] font-medium tracking-[0.16em] text-primary-700 uppercase'>
            About
          </p>
          <h1 className='text-4xl text-ink sm:text-5xl'>The story so far</h1>
          <p className='mt-3 max-w-xl text-lg text-slate'>
            More than you would ever want to know about Hemolog
          </p>

          <div className='relative mt-10 aspect-[451/285] w-56 overflow-hidden'>
            <Image
              src='/images/hemolog-2-hero.png'
              alt='Hemolog 2'
              width={765}
              height={530}
              className='absolute top-0 left-0 h-auto w-[169.6%] max-w-none -translate-x-[20.52%] -translate-y-[23.2%] mix-blend-multiply'
            />
          </div>

          <div className='mt-8 space-y-5 text-base leading-relaxed text-ink'>
            <p>
              Let's face it, there are some exciting developments in the world
              of Hemophilia research. Honestly, it's not <em>just</em> research
              anymore. Clinical trials are happening now across the globe. Gene
              therapy is definitely going to change things for the better, it's
              just a matter of when it's available to all of us.
            </p>
            <p>
              That being said, it's still important to keep track of your
              treatments. Maybe even more now than ever. If getting on a trial
              is something you're interested in, knowing how many bleeds you
              were having before is really important.
            </p>
            <p>
              Trial or not, keeping track of your treatment habits can be hard
              and the tools we have aren't great. Hemolog is simple. You track
              your treatments and Hemolog gives you instant feedback.
            </p>
            <p>
              Insights are something that I always wanted to be a part of
              Hemolog and now they're finally here.
            </p>
          </div>

          <figure className='mt-10'>
            <Image
              src='/images/insights-example.png'
              alt='Insights example'
              width={487}
              height={337}
              className='h-auto w-full rounded-2xl border border-line bg-white'
              sizes='(min-width: 720px) 672px, 100vw'
            />
            <figcaption className='mt-3 text-sm leading-relaxed text-slate'>
              High level insights that help you understand your habits
            </figcaption>
          </figure>

          <p className='mt-8 text-base leading-relaxed text-ink'>
            These insights are calculated as you log your treatments. Filter by
            year for a comprehensive view into your treatment history. I've
            chosen a few insights that are interesting to me. If you have
            thoughts on what you would like to see, just let me know.
          </p>

          <p className='mt-8 text-sm leading-relaxed text-slate'>
            Development is ongoing. Check the{' '}
            <Link href='/changelog' className={linkClass}>
              development blog
            </Link>{' '}
            for updates and changes.
          </p>

          <div className='mt-12 flex items-start gap-5 border-t border-line pt-8'>
            <Image
              width={64}
              height={64}
              src='/images/michael-schultz.jpg'
              alt=''
              className='h-16 w-16 shrink-0 rounded-full object-cover'
            />
            <div>
              <p className='text-base leading-relaxed text-ink'>
                Now that Hemolog is back, I hope you enjoy using it as much as I
                have. It's up to all of us to keep each other accountable. You
                can{' '}
                <Link href='/emergency/mike29' className={linkClass}>
                  view my emergency page
                </Link>{' '}
                at any time to verify I've been keeping up with my prophy
                regimen.
              </p>
              <p className='mt-4 text-sm font-medium text-ink'>
                Michael Schultz
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default About
