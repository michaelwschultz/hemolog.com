'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { type ReactElement, useEffect, useState } from 'react'

const STORAGE_KEY = 'hemolog-theme'

const ThemeToggle = (): ReactElement => {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // Private mode etc. — theme still applies for this session.
    }
    setDark(next)
  }

  return (
    <button
      type='button'
      onClick={toggle}
      className='flex h-9 w-9 items-center justify-center rounded-full text-slate ring-1 ring-line transition-colors hover:text-ink'
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark === null ? (
        <span className='h-4 w-4' />
      ) : dark ? (
        <IconSun className='h-4 w-4' />
      ) : (
        <IconMoon className='h-4 w-4' />
      )}
    </button>
  )
}

export default ThemeToggle
