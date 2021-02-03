import React from 'react'
import Link from 'next/link'

export default function Logo(): JSX.Element {
  return (
    <Link href='/'>
      <a style={{ color: 'black' }}>
        <img
          width='122px'
          height='36px'
          style={{ display: 'block' }}
          src={'/images/hemolog-logo-2x-dark.png'}
        />
      </a>
    </Link>
  )
}
