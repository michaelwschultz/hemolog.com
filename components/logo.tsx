import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Logo(): JSX.Element {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // Tailwind's sm breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Link href='/'>
      {/** biome-ignore lint/a11y/useValidAnchor: href provided by Link */}
      <a
        className={`inline-block text-black ${isMobile ? 'h-[25px]' : 'h-[36px]'}`}
      >
        <Image
          width={isMobile ? 85 : 122}
          height={isMobile ? 25 : 36}
          src={'/images/hemolog-logo-2x-dark.png'}
          alt='Hemolog logo'
        />
      </a>
    </Link>
  )
}
