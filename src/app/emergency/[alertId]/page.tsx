'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import EmergencyInfo from '@/components/emergency/emergencyInfo'
import Footer from '@/components/shared/footer'
import { useEmergencyUserQuery } from '@/lib/hooks/useEmergencyUserQuery'

const Emergency = (): JSX.Element => {
  const [mounted, setMounted] = useState(false)
  const params = useParams()
  const alertId = params.alertId as string
  let isExample = false

  useEffect(() => {
    setMounted(true)
  }, [])

  if (alertId === 'example') {
    isExample = true
  }

  const { person, isLoading, isError, error } = useEmergencyUserQuery(
    isExample ? 'mike29' : alertId
  )

  // During SSR and initial hydration, show loading state to prevent mismatch
  const displayLoading = !mounted || isLoading

  return (
    <div className='min-h-screen flex flex-col max-w-[850pt] w-full mx-auto'>
      {/* Header */}
      <header className='flex justify-between items-center px-6 py-6 pb-0'>
        <h4 className='text-xl font-semibold text-green-600'>Emergency Info</h4>
        <Link
          href='/'
          className='text-sm font-medium text-primary-500 hover:text-primary-600'
        >
          Hemolog.com
        </Link>
      </header>

      {/* Disclaimer and Important Note */}
      <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-6 pb-8'>
        <p className='text-sm text-gray-600 flex-1'>
          This page shows the most recent medical logs for someone with
          hemophilia. <br />
          This data is <em>self reported</em> and may not be up-to-date.
        </p>

        <div className='bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm'>
          <div className='font-semibold text-green-800 mb-1'>Important</div>
          <div className='text-green-700'>
            If someone has been in an accident, please call{' '}
            <a
              href='tel:911'
              className='text-green-600 hover:text-green-800 font-semibold'
            >
              911
            </a>{' '}
            immediately.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className='flex-1 px-6 pb-16'>
        {displayLoading && (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500'></div>
            <span className='ml-3 text-gray-600'>Loading emergency info</span>
          </div>
        )}

        {mounted && (isError || error) && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <div className='font-semibold text-red-800 mb-1'>Error</div>
            <div className='text-red-700'>
              Something went wrong. This could mean that this person no longer
              has a Hemolog account or the app is broken.
            </div>
          </div>
        )}

        {mounted && !person && !displayLoading && !isError && (
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6'>
            <div className='font-semibold text-gray-800 mb-1'>Try again</div>
            <div className='text-gray-700'>
              Nothing could be found at this address. Please make sure the URL
              matches the link provided on the Hemolog Emergency Card.
            </div>
          </div>
        )}

        {mounted && person && <EmergencyInfo person={person} />}
      </main>
      <Footer />
    </div>
  )
}

export default Emergency
