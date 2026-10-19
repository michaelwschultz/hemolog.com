'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { type ReactElement, useEffect, useState } from 'react'
import EmergencyInfo from '@/components/emergency/emergencyInfo'
import Footer from '@/components/shared/footer'
import { useEmergencyUserQuery } from '@/lib/hooks/useEmergencyUserQuery'

const Emergency = (): ReactElement => {
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
    <div className='page'>
      <header className='flex items-end justify-between px-6 pt-6 pb-2'>
        <div>
          <p className='mb-2 text-[13px] font-medium tracking-[0.16em] text-primary-700 uppercase'>
            Emergency
          </p>
          <h1 className='text-3xl text-ink sm:text-4xl'>Responder info</h1>
        </div>
        <Link
          href='/'
          className='text-sm font-medium text-ink underline decoration-primary-500 decoration-2 underline-offset-4'
        >
          Hemolog
        </Link>
      </header>

      <div className='flex flex-col items-start justify-between gap-6 px-6 pt-6 pb-8 lg:flex-row lg:items-center'>
        <p className='max-w-md flex-1 text-sm leading-relaxed text-slate'>
          Recent treatment logs for someone with hemophilia. This data is self
          reported and may not be up to date.
        </p>

        <div className='note note-urgent max-w-sm'>
          <div className='note-title'>Call first</div>
          <p className='text-sm leading-relaxed text-ink'>
            If someone has been in an accident, call{' '}
            <a href='tel:911' className='font-medium underline'>
              911
            </a>{' '}
            immediately.
          </p>
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
          <div className='note note-urgent mb-6'>
            <div className='note-title'>Couldn't load this page</div>
            <p className='text-sm leading-relaxed text-slate'>
              This person may no longer have a Hemolog account, or the app
              failed to respond. Check the address and try again.
            </p>
          </div>
        )}

        {mounted && !person && !displayLoading && !isError && (
          <div className='note mb-6'>
            <div className='note-title'>Nothing at this address</div>
            <p className='text-sm leading-relaxed text-slate'>
              Check that the URL matches the link on the Hemolog emergency card.
            </p>
          </div>
        )}

        {mounted && person && <EmergencyInfo person={person} />}
      </main>
      <Footer />
    </div>
  )
}

export default Emergency
