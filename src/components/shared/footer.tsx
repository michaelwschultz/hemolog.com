'use client'

// All Geist UI components have been migrated to Tailwind

import EmergencySnippet from '@/components/shared/emergencySnippet'
import { useAuth } from '@/lib/auth'

export default function Footer(): JSX.Element {
  const { user, loading } = useAuth()

  const alertId = () => {
    if (loading) {
      return ''
    }
    if (user?.alertId) {
      return user.alertId
    }
    return 'example'
  }

  return (
    <footer className='px-10 py-10'>
      <hr className='border-gray-200' />
      <div className='h-8' />
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-1 flex flex-col'>
          <h5 className='text-lg font-semibold mb-2'>Hemolog 2</h5>
          <a
            className='text-primary-500 hover:text-primary-600 mb-1'
            href='/about'
          >
            The story so far...
          </a>
          <a
            className='text-primary-500 hover:text-primary-600 mb-4'
            href='/changelog'
          >
            Development blog
          </a>
          <h5 className='text-lg font-semibold mb-2'>Follow</h5>
          <a
            className='text-primary-500 hover:text-primary-600 mb-1 flex items-center'
            href='https://twitter.com/hemolog'
          >
            @Hemolog
          </a>
          <a
            className='text-primary-500 hover:text-primary-600 mb-4 flex items-center'
            href='https://twitter.com/michaelschultz'
          >
            @MichaelSchultz
          </a>
        </div>
        <div className='flex-1 flex flex-col'>
          <h5 className='text-lg font-semibold mb-2'>Get Involved</h5>
          <a
            className='text-primary-500 hover:text-primary-600 mb-1 flex items-center'
            href='https://github.com/michaelwschultz/hemolog.com'
          >
            View source
          </a>
          <a
            className='text-primary-500 hover:text-primary-600 mb-4 flex items-center'
            href='https://github.com/sponsors/michaelwschultz'
          >
            Donate
          </a>
          <h5 className='text-lg font-semibold mb-2'>Emergency Link</h5>
          <EmergencySnippet alertId={alertId()} />
        </div>
      </div>
    </footer>
  )
}
