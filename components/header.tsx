import React from 'react'

import { useAuth } from 'lib/auth'
import Logo from 'components/logo'
import InfusionModal from 'components/infusionModal'

interface Props {
  version?: string
}

const Header = (props: Props): JSX.Element | null => {
  const { version } = props
  const { user, signout } = useAuth()

  const [infusionModal, setInfusionModal] = React.useState(false)

  const [isMobile, setIsMobile] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // Tailwind's sm breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // const [themeType, setThemeType] = useState('dark')
  // const switchThemes = () => {
  //   setThemeType((lastThemeType) =>
  //     lastThemeType === 'dark' ? 'light' : 'dark'
  //   )
  // }

  if (user) {
    const avatarInitial =
      user.name?.charAt(0) ||
      user.displayName?.charAt(0) ||
      user.email?.charAt(0) ||
      '?'

    return (
      <>
        <div className='flex justify-between items-center'>
          <Logo />
          <div className='flex items-center gap-2'>
            {!isMobile && (
              <button
                type='button'
                onClick={() => setInfusionModal(true)}
                className='bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1.5 rounded text-sm font-medium transition-colors'
              >
                New treatment
              </button>
            )}
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

        {isMobile && (
          <button
            type='button'
            onClick={() => setInfusionModal(true)}
            className='w-full bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-lg font-medium transition-colors'
          >
            Log infusion
          </button>
        )}

        <InfusionModal
          visible={infusionModal}
          setVisible={setInfusionModal}
          bindings={{}}
        />
      </>
    )
  }

  return null
}

export default Header
