import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href='/'
      className='inline-block text-black h-[25px] sm:h-[36px] relative w-[85px] sm:w-[122px]'
    >
      <Image
        src='/images/hemolog-logo-2x-dark.png'
        alt='Hemolog logo'
        fill
        sizes='(max-width: 640px) 85px, 122px'
        className='object-contain'
      />
    </Link>
  )
}
