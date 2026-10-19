import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'
import DescriptionCards from '@/components/landing/descriptionCards'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

export default function Landing(): ReactElement {
  return (
    <div className='page'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-6 pb-16 sm:pt-10'>
        <div className='grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
          <div className='max-w-xl'>
            <p className='mb-4 text-[13px] font-medium tracking-[0.16em] text-primary-700 uppercase'>
              A treatment log
            </p>
            <h1 className='text-5xl leading-[0.95] text-ink sm:text-6xl'>
              Insights that
              <br />
              matter.
            </h1>
            <div className='mt-6 h-0.5 w-10 bg-primary-500' />
            <p className='mt-6 text-xl font-medium tracking-tight text-ink'>
              The last treatment log you'll ever need.
            </p>
            <p className='mt-3 max-w-md text-base leading-relaxed text-slate'>
              Log each infusion. Hemolog turns that history into the habits
              behind your bleeds, prophylaxis, and factor use.
            </p>
            <div className='mt-8 flex flex-wrap items-center gap-x-5 gap-y-3'>
              <Link href='/signin' className='btn btn-primary'>
                Start logging
              </Link>
              <Link
                href='/about'
                className='text-sm font-medium text-ink underline decoration-primary-500 decoration-2 underline-offset-4'
              >
                Read the Hemolog story
              </Link>
            </div>
          </div>

          <div className='relative mx-auto w-full max-w-md lg:max-w-none'>
            <Image
              alt='Logging a treatment'
              src='/images/logging-infusion-illustration.png'
              width={925 / 2}
              height={989 / 2}
              className='h-auto w-full object-contain mix-blend-multiply'
              priority
              loading='eager'
            />
          </div>
        </div>

        <div className='mt-16 sm:mt-20'>
          <DescriptionCards />
        </div>
      </main>
      <Footer />
    </div>
  )
}
