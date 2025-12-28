import { useRouter } from 'next/router'
import Image from 'next/image'

import { useAuth } from 'lib/auth'

export default function BlogFooter(): JSX.Element {
  const { user, loading } = useAuth()

  const router = useRouter()
  return (
    <div className='flex flex-col sm:flex-row items-center gap-6'>
      <div className='flex-1 flex flex-col'>
        <h4 className='text-lg font-semibold mb-2'>
          Designed and developed by Michael Schultz in Oakland, California.
        </h4>
        {user ? (
          <p className='text-gray-600'>
            Thanks for being part of the Hemolog community!
          </p>
        ) : (
          <>
            <p className='text-gray-600 mb-3'>Start using Hemolog for free.</p>
            <button
              type='button'
              onClick={() => router.push('/signin')}
              disabled={loading}
              className='px-4 py-2 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-green-800 rounded-lg font-medium transition-colors flex items-center gap-2 w-fit'
            >
              {loading && (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-green-800'></div>
              )}
              Register
            </button>
          </>
        )}
      </div>

      <div className='flex-shrink-0'>
        <Image
          width={60}
          height={60}
          src='/images/michael-schultz.jpg'
          alt='Michael Schultz'
          className='rounded-full'
        />
      </div>
    </div>
  )
}
