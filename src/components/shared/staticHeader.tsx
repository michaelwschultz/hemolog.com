'use client'

import { useRouter } from 'next/navigation'
import Logo from '@/components/shared/logo'
import { useAuth } from '@/lib/auth'

const StaticHeader = (): JSX.Element => {
  const { user, loading } = useAuth()
  const router = useRouter()

  return (
    <header className='p-6'>
      <div className='flex justify-between items-center'>
        <Logo />
        <button
          type='button'
          className='bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => router.push(user ? '/home' : '/signin')}
          disabled={loading}
        >
          {loading ? (
            <div className='flex items-center'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-green-800 mr-2'></div>
              Loading...
            </div>
          ) : user ? (
            'Dashboard'
          ) : (
            'Register'
          )}
        </button>
      </div>
    </header>
  )
}

export default StaticHeader
