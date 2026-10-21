import Image from 'next/image'
import type { ReactElement } from 'react'
import HeroActions from '@/components/landing/heroActions'
import SampleRecord from '@/components/landing/sampleRecord'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

const yearNotes = [
  {
    title: 'Separate bleeds from prophy',
    body: 'Prophy, preventative doses, and bleeds stay in separate counts. Filter by year when you want one stretch of time.',
  },
  {
    title: 'See which joints take the most hits',
    body: 'Hemolog counts the joints and causes that show up most often, so you know where the problems are.',
  },
  {
    title: 'Hand first responders your emergency card',
    body: 'In an accident, the card links to a page with your recent treatment logs. The page says the record is self-reported, and to call 911 first.',
  },
]

export default function Landing(): ReactElement {
  return (
    <div className='page'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-6 pb-16 sm:pt-10'>
        <div className='grid items-start gap-12 lg:grid-cols-2 lg:gap-16'>
          <div className='max-w-xl'>
            <p className='mb-4 text-[13px] font-medium tracking-[0.16em] text-primary-700 uppercase'>
              A treatment log
            </p>
            <h1 className='text-4xl leading-[1.02] text-ink sm:text-6xl'>
              Insights that matter.
            </h1>
            <p className='mt-6 max-w-md text-base leading-relaxed text-slate'>
              Hemolog is a treatment log for hemophilia. Write down the date,
              the units, and why, and it turns your entries into insights you
              can act on: your bleeds, your prophy, and the joints that need
              the most attention.
            </p>
            <HeroActions />
          </div>
          <SampleRecord />
        </div>

        <section className='mt-20 sm:mt-24' aria-labelledby='year-heading'>
          <h2
            id='year-heading'
            className='font-sans text-xl font-medium tracking-tight text-ink'
          >
            What you'll see when you log
          </h2>
          <dl className='mt-6 border-t border-line'>
            {yearNotes.map((note) => (
              <div
                key={note.title}
                className='grid gap-1 border-b border-line py-5 sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-10 sm:py-6'
              >
                <dt className='text-base font-medium text-ink'>{note.title}</dt>
                <dd className='text-sm leading-relaxed text-slate'>
                  {note.body}
                </dd>
              </div>
            ))}
          </dl>
          <p className='mt-8 max-w-xl text-sm leading-relaxed text-slate'>
            Free to use. No sponsors and no ads. Hemolog did die. It's back,
            rebuilt to make your treatment history easy to log and easy to
            understand. The{' '}
            <a
              href='https://github.com/michaelwschultz/hemolog.com'
              className='text-ink underline decoration-primary-500 decoration-2 underline-offset-2'
            >
              code is on GitHub.
            </a>
          </p>
          <figure className='mt-16 sm:mt-20'>
            <Image
              alt='Someone logging an infusion at the table, with a vial, gauze, and a sharps bin'
              src='/images/logging-infusion-illustration.png'
              width={925}
              height={989}
              className='h-auto w-full max-w-sm rounded-2xl bg-white object-contain p-2 mix-blend-multiply dark:mix-blend-normal dark:shadow-md'
            />
          </figure>
        </section>
      </main>
      <Footer />
    </div>
  )
}
