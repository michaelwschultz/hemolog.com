'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Footer from '@/components/shared/footer'
import LoadingScreen from '@/components/shared/loadingScreen'
import Logo from '@/components/shared/logo'
import { withAuth } from '@/components/shared/withAuth'
import { useAuth } from '@/lib/auth'

const Signin = () => {
  const auth = useAuth()
  const router = useRouter()
  const version = process.env.npm_package_version

  // Redirect authenticated users to home
  useEffect(() => {
    if (auth.user && !auth.loading) {
      router.replace('/home')
    }
  }, [auth.user, auth.loading, router])

  // Show loading while checking auth state or redirecting
  if (auth.loading || auth.user) {
    return <LoadingScreen />
  }

  return (
    <div className='min-h-screen flex flex-col max-w-[850pt] w-full mx-auto'>
      <header className='p-6'>
        <div className='flex justify-between items-center'>
          <Logo />
          <a
            href='https://github.com/michaelwschultz/hemolog.com'
            className='px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded'
          >
            v{version}
          </a>
        </div>
      </header>

      <main className='flex-1 px-6 pt-10'>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8'>
          <div className='font-semibold text-blue-800 mb-1'>Important</div>
          <div className='text-blue-700'>
            Hemolog is currently in development. Data integrity is not
            guaranteed. Hemolog is{' '}
            <b>
              <i>not</i>
            </b>{' '}
            HIPAA compliant... yada yada yada.
          </div>
        </div>

        <div className='flex justify-center'>
          <div className='max-w-md w-full border border-gray-200 rounded-lg p-6'>
            <h4 className='text-xl font-semibold mb-3'>Register or sign in</h4>
            <p className='text-gray-600 mb-6'>
              Signing in will create an account if you don't have one yet. Don't
              worry, Hemolog will always be <i>free</i>.
            </p>

            <div className='flex justify-end'>
              {!process.env.NEXT_PUBLIC_USE_EMULATORS && (
                <button
                  type='button'
                  onClick={() => auth.signinWithGoogle?.('/home')}
                  disabled={auth.loading}
                  className='px-4 py-2 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-green-800 rounded-lg font-medium transition-colors flex items-center gap-2'
                >
                  {auth.loading && (
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-green-800'></div>
                  )}
                  Continue with Google
                </button>
              )}
              {process.env.NEXT_PUBLIC_USE_EMULATORS && (
                <button
                  type='button'
                  onClick={() => auth.signinWithTestUser?.()}
                  disabled={auth.loading}
                  className='px-4 py-2 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-green-800 rounded-lg font-medium transition-colors flex items-center gap-2'
                >
                  {auth.loading && (
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-green-800'></div>
                  )}
                  Continue with Test User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* <div className='h-12' />
          <DescriptionCards />
          <div className='h-8' /> */}
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(Signin)
