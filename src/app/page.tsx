import Image from 'next/image'
import Link from 'next/link'
import DescriptionCards from '@/components/landing/descriptionCards'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

export default function Landing(): JSX.Element {
  return (
    <div className='min-h-screen flex flex-col max-w-[850pt] w-full mx-auto relative'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-10 relative'>
        {/* Background illustration */}
        <div className='absolute right-0 top-0 w-1/2 h-full pointer-events-none'>
          <Image
            alt='logging infusion illustration'
            src='/images/logging-infusion-illustration.png'
            width={925 / 2}
            height={989 / 2}
            className='w-full h-auto object-contain'
            priority
            loading='eager'
          />
        </div>

        {/* Content */}
        <div className='relative z-10 max-w-2xl'>
          <h1 className='font-["Nanum_Pen_Script"] text-8xl md:text-[100px] leading-tight md:leading-[80px] w-3/4 mb-4'>
            TREATMENT INSIGHTS <br />
            THAT MATTER
          </h1>
          <h5 className='text-xl font-semibold text-gray-700 mb-6'>
            The last treatment log you'll ever need.
          </h5>

          <div className='mb-6'>
            <p className='text-gray-600 mb-4'>
              Log your treatments and get fantastic insights that help you
              change your habits.
              <br />
              Sign up for free and start using the newest version of Hemolog
              today!
            </p>

            <p className='text-primary-500 hover:text-primary-600 transition-colors'>
              <Link href='/about'>Learn more about the Hemolog story...</Link>
            </p>
          </div>

          <div className='mt-12'>
            <DescriptionCards />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
