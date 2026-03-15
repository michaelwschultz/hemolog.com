'use client'

import React, { type ReactElement } from 'react'
import Logo from '@/components/shared/logo'
import { useAuth } from '@/lib/auth'
import { useTreatmentSheet } from '@/lib/hooks/useTreatmentSheet'
import { useTreatmentsQuery } from '@/lib/hooks/useTreatmentsQuery'

interface Props {
  version?: string
}

const Header = (props: Props): ReactElement | null => {
  const { version } = props
  const { user, signout } = useAuth()
  const { data: treatments } = useTreatmentsQuery()
  const { openTreatmentSheet } = useTreatmentSheet()

  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  const handleOpenSheet = () => {
    openTreatmentSheet({
      mode: 'create',
      previousTreatment: treatments?.[0],
    })
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  if (user) {
    const avatarInitial = user.name?.charAt(0) || user.email?.charAt(0) || '?'

    return (
      <>
        <div className='flex justify-between items-center'>
          <Logo />
          <div className='flex items-center gap-2' suppressHydrationWarning>
            <button
              type='button'
              onClick={handleOpenSheet}
              className='bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors active:scale-[0.98]'
            >
              New treatment
            </button>
            <div className='relative dropdown-container'>
              <button
                type='button'
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors'
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={avatarInitial}
                    className='w-8 h-8 rounded-full'
                  />
                ) : (
                  <span className='text-sm font-medium text-gray-700'>
                    {avatarInitial}
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'>
                  <div className='px-4 py-2 border-b border-gray-200'>
                    <div className='font-medium text-gray-900'>
                      {user?.name}
                    </div>
                  </div>
                  <div className='px-4 py-2 text-sm text-gray-600 border-b border-gray-200'>
                    Hemolog v{version}
                  </div>
                  <a
                    href='/changelog'
                    className='block px-4 py-2 text-sm text-primary-600 hover:bg-gray-50'
                  >
                    Latest updates
                  </a>
                  <div className='border-t border-gray-200 my-1'></div>
                  <button
                    type='button'
                    onClick={() => {
                      void signout?.()
                      setDropdownOpen(false)
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50'
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='h-4' />
      </>
    )
  }

  return null
}

export default Header
