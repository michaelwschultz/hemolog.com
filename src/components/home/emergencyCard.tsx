'use client'
import Link from 'next/link'
import React from 'react'
import QRCode from 'react-qr-code'

import { useAuth } from '@/lib/auth'
import { useUserQuery } from '@/lib/hooks/useUserQuery'

interface Props {
  forPrint?: boolean
}

export default function EmergencyCard({ forPrint }: Props): JSX.Element {
  const { user } = useAuth()
  const { person } = useUserQuery(user?.uid)

  // Check if we're on mobile - use a simple approach for now
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // Tailwind's sm breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    forPrint = true
  }

  const alertUrl = `hemolog.com/emergency/${person?.alertId}`

  return (
    <div
      className={`relative ${forPrint ? 'w-80 h-48' : 'w-[525px] h-[300px]'} rounded-xl overflow-hidden shadow-lg emergency-card`}
      suppressHydrationWarning
    >
      <div
        className={`bg-primary-500 w-full ${forPrint ? 'h-14 p-4' : 'h-[90px] p-6'}`}
      >
        <div className='flex justify-between items-center'>
          <div>
            <h5
              className={`text-white p-0 m-0 font-normal ${forPrint ? 'text-xs leading-[15px]' : 'text-base leading-6'}`}
            >
              Bleeding disorder
            </h5>
            <h2
              className={`text-white p-0 m-0 ${forPrint ? 'text-xs leading-[15px]' : 'text-base leading-6'}`}
            >
              Emergency
            </h2>
          </div>

          {user?.photoUrl && (
            <div>
              <img
                src={user.photoUrl}
                alt='User avatar'
                className={`rounded-full border-white ${forPrint ? 'w-15 h-15 border-4' : 'w-25 h-25 border-8'}`}
              />
            </div>
          )}
        </div>
      </div>
      <div className={forPrint ? 'h-2' : 'h-4'} />
      <div className={`flex gap-3 ${forPrint ? 'p-2' : 'p-4'}`}>
        <div className='flex-[7]'>
          <div
            className={`relative rounded-lg border-primary-500 ${forPrint ? 'w-24 h-24 p-1.5 border-[3px]' : 'w-[148px] h-[148px] p-2 border-[4px]'}`}
          >
            {person ? (
              <QRCode
                value={`https://${alertUrl}`}
                size={forPrint ? 80 : 124}
              />
            ) : (
              <div className='flex justify-center items-center h-full'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500'></div>
              </div>
            )}
            <img
              src='/images/blood-drop.png'
              alt='Blood drop'
              className={`absolute border-none ${forPrint ? 'left-[34px] -top-4.5 w-6 h-6' : 'left-14 -top-6 w-8 h-8'}`}
            />
          </div>
        </div>
        <div className='flex-[17]'>
          {person ? (
            <div className={forPrint ? 'pl-2' : 'pl-4'}>
              <h3
                className={`p-0 m-0 ${forPrint ? 'text-xs leading-[15px]' : 'text-base leading-6'}`}
              >
                {person?.name}
              </h3>
              <h5
                className={`p-0 m-0 font-normal ${forPrint ? 'text-xs leading-[15px]' : 'text-base leading-6'}`}
              >
                {person?.severity} Hemophilia {person?.hemophiliaType}
              </h5>
              {person?.factor && (
                <h5
                  className={`p-0 m-0 font-normal ${forPrint ? 'text-xs leading-[15px]' : 'text-base leading-6'}`}
                >
                  Treat with factor {person.factor}
                </h5>
              )}
              <div className={forPrint ? 'pt-2' : 'pt-4'}>
                <h4
                  className={`text-lg font-semibold mb-2 ${forPrint ? 'text-xs' : ''}`}
                >
                  Scan or visit for treatment history
                </h4>
                <div className='group relative'>
                  <Link
                    href={`https://${alertUrl}`}
                    className={`text-primary-500 p-0 m-0 ${forPrint ? 'text-xs leading-[15px]' : 'text-base leading-6'}`}
                  >
                    <h4>{alertUrl}</h4>
                  </Link>
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
                    Visit your page to preview what others will see.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex justify-center items-center h-full'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500'></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
