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
    <div className='page'>
      <header className='px-6 py-5'>
        <div className='flex items-center justify-between'>
          <Logo />
          <span className='font-mono text-xs text-slate'>v{version}</span>
        </div>
      </header>

      <main className='flex-1 px-6 pt-6 pb-16'>
        <div className='note note-urgent mb-8 max-w-xl'>
          <div className='note-title'>Before you start</div>
          <p className='text-sm leading-relaxed text-slate'>
            Hemolog is in development. Data integrity is not guaranteed, and
            Hemolog is not HIPAA compliant.
          </p>
        </div>

        <div className='mx-auto w-full max-w-md'>
          <div className='surface p-6 sm:p-8'>
            <h1 className='text-3xl text-ink'>Sign in</h1>
            <p className='mt-3 text-sm leading-relaxed text-slate'>
              Google creates an account if you don't have one yet. Hemolog stays
              free.
            </p>

            <div className='mt-8'>
              {!process.env.NEXT_PUBLIC_USE_EMULATORS && (
                <button
                  type='button'
                  onClick={() => auth.signinWithGoogle?.('/home')}
                  disabled={auth.loading}
                  className='btn btn-primary w-full'
                >
                  {auth.loading && (
                    <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                  )}
                  Continue with Google
                </button>
              )}
              {process.env.NEXT_PUBLIC_USE_EMULATORS && (
                <button
                  type='button'
                  onClick={() => auth.signinWithTestUser?.()}
                  disabled={auth.loading}
                  className='btn btn-primary w-full'
                >
                  {auth.loading && (
                    <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                  )}
                  Continue with test user
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(Signin)
