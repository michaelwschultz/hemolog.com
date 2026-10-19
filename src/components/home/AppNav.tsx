'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'
import { useAuth } from '@/lib/auth'

type NavItem = {
  label: string
  href: string
  exact?: boolean
}

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.exact) {
    return pathname === item.href
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function AppNav(): ReactElement {
  const pathname = usePathname()
  const { user } = useAuth()

  const items: NavItem[] = [
    { label: 'Home', href: '/app', exact: true },
    { label: 'Profile', href: '/app/profile' },
  ]

  if (user?.isAdmin) {
    items.push({ label: 'Feedback', href: '/app/feedback' })
  }

  return (
    <nav
      className='inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1'
      aria-label='App sections'
    >
      {items.map((item) => {
        const isActive = isNavActive(pathname, item)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive ? 'bg-ink text-white' : 'text-slate hover:text-ink'
            }`}
            role='tab'
            aria-selected={isActive}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
