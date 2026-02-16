'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/home', label: 'Home' },
  { href: '/profile', label: 'Profile' },
]

export function PageNav() {
  const pathname = usePathname()

  return (
    <nav className='flex space-x-8 border-b border-gray-200 dark:border-gray-700 mb-6'>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                isActive
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
