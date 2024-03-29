import Link from 'next/link'
import Image from 'next/image'
import { useMediaQuery } from '@geist-ui/react'

export default function Logo(): JSX.Element {
  const isMobile = useMediaQuery('xs', { match: 'down' })

  return (
    <Link href='/'>
      <a style={{ color: 'black', height: isMobile ? '25px' : '36px' }}>
        <Image
          width={isMobile ? '85px' : '122px'}
          height={isMobile ? '25px' : '36px'}
          src={'/images/hemolog-logo-2x-dark.png'}
          alt='Hemolog logo'
        />
      </a>
    </Link>
  )
}
