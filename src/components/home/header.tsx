'use client'

import Link from 'next/link'
import React, { type ReactElement, useRef } from 'react'
import TreatmentModalContent from '@/components/home/treatmentModalContent'
import Logo from '@/components/shared/logo'
import { Popup } from '@/components/shared/popup'
import { useAuth } from '@/lib/auth'
import type { TreatmentType } from '@/lib/db/treatments'
import { useTreatmentsQuery } from '@/lib/hooks/useTreatmentsQuery'
import { useUserQuery } from '@/lib/hooks/useUserQuery'
import { registerTreatmentDialog } from '@/lib/treatmentDialog'

interface Props {
  version?: string
}

const Header = (props: Props): ReactElement | null => {
  const { version } = props
  const { user, signout } = useAuth()
  const { data: treatments } = useTreatmentsQuery()
  const { person } = useUserQuery(user?.uid)
  const treatmentFormRef = useRef<{ handleSubmit: () => void }>(null)

  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [treatmentOpen, setTreatmentOpen] = React.useState(false)
  const [editingTreatment, setEditingTreatment] = React.useState<
    TreatmentType | undefined
  >()

  React.useEffect(() => {
    return registerTreatmentDialog((treatment) => {
      setEditingTreatment(treatment)
      setTreatmentOpen(true)
    })
  }, [])

  const closeTreatment = () => {
    setTreatmentOpen(false)
    setEditingTreatment(undefined)
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
              onClick={() => {
                setEditingTreatment(undefined)
                setTreatmentOpen(true)
              }}
              className='btn btn-primary'
            >
              New treatment
            </button>
            <div className='relative dropdown-container'>
              <button
                type='button'
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-line transition-colors hover:bg-paper'
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
                <div className='absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-line bg-white py-1 shadow-lg'>
                  <div className='border-b border-line px-4 py-2.5'>
                    <div className='font-medium text-ink'>{user?.name}</div>
                    <div className='mt-0.5 font-mono text-xs text-slate'>
                      v{version}
                    </div>
                  </div>
                  <Link
                    href='/changelog'
                    className='block px-4 py-2 text-sm text-ink hover:bg-paper'
                  >
                    Latest updates
                  </Link>
                  <Link
                    href='/docs'
                    className='block px-4 py-2 text-sm text-ink hover:bg-paper'
                  >
                    API docs
                  </Link>
                  <div className='my-1 border-t border-line' />
                  <button
                    type='button'
                    onClick={() => {
                      void signout?.()
                      setDropdownOpen(false)
                    }}
                    className='block w-full px-4 py-2 text-left text-sm text-primary-700 hover:bg-primary-50'
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='h-4' />
        <Popup
          open={treatmentOpen}
          title={editingTreatment ? 'Edit treatment' : 'Log treatment'}
          onClose={closeTreatment}
        >
          <TreatmentModalContent
            key={
              editingTreatment?.uid ??
              `create-${person?.medication ?? ''}-${person?.monoclonalAntibody ?? ''}`
            }
            ref={treatmentFormRef}
            treatment={editingTreatment}
            previousTreatment={editingTreatment ? undefined : treatments?.[0]}
            onSuccess={closeTreatment}
          />
          <div className='flex justify-end px-4 pb-4 sm:px-6'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => treatmentFormRef.current?.handleSubmit()}
            >
              {editingTreatment ? 'Save' : 'Log treatment'}
            </button>
          </div>
        </Popup>
      </>
    )
  }

  return null
}

export default Header
