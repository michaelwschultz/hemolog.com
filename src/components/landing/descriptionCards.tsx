import Image from 'next/image'

export default function DescrtipionCards(): JSX.Element {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
        <Image
          src='/images/feature-free.png'
          width={40}
          height={40}
          alt='Free forever'
        />
        <h4 className='text-lg font-semibold mt-4 mb-2'>Free forever</h4>
        <p className='text-gray-600'>
          No sponsorships, pharma companies, or ads.
        </p>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
        <Image
          src='/images/feature-dead.png'
          width={40}
          height={40}
          alt='Hemolog is back'
        />
        <h4 className='text-lg font-semibold mt-4 mb-2'>Didn't Hemolog die?</h4>
        <p className='text-gray-600'>
          Yep, but it's back. Just wait till you see what this reincarnation can
          do!
        </p>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
        <Image
          src='/images/feature-lock.png'
          width={40}
          height={40}
          alt='Safe and secure'
        />
        <h4 className='text-lg font-semibold mt-4 mb-2'>Safe and secure</h4>
        <p className='text-gray-600'>
          Your data is stored in Firebase, a trusted database owned by Google.
        </p>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
        <Image
          src='/images/feature-github.png'
          width={40}
          height={40}
          alt='Open source'
        />
        <h4 className='text-lg font-semibold mt-4 mb-2'>Open source</h4>
        <p className='text-gray-600'>
          Check out the code on{' '}
          <a
            href='https://github.com/michaelwschultz/hemolog.com'
            className='text-primary-500 hover:text-primary-600'
          >
            Github
          </a>
          .
        </p>
      </div>
    </div>
  )
}
