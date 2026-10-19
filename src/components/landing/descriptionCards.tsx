import Image from 'next/image'

import type { ReactElement } from 'react'

const cards = [
  {
    src: '/images/feature-free.png',
    alt: 'Free forever',
    title: 'Free forever',
    body: 'No sponsorships, pharma companies, or ads.',
  },
  {
    src: '/images/feature-dead.png',
    alt: 'Hemolog is back',
    title: "Didn't Hemolog die?",
    body: "Yep, but it's back. This version shows you the habits in your log.",
  },
  {
    src: '/images/feature-lock.png',
    alt: 'Safe and secure',
    title: 'Safe and secure',
    body: 'Your data is stored in Firebase, a database owned by Google.',
  },
  {
    src: '/images/feature-github.png',
    alt: 'Open source',
    title: 'Open source',
    body: 'code' as const,
  },
]

export default function DescrtipionCards(): ReactElement {
  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
      {cards.map((card) => (
        <article key={card.title} className='surface p-6'>
          <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-paper'>
            <Image src={card.src} width={28} height={28} alt={card.alt} />
          </div>
          <h3 className='text-base font-medium text-ink'>{card.title}</h3>
          <p className='mt-1.5 text-sm leading-relaxed text-slate'>
            {card.body === 'code' ? (
              <>
                Check out the code on{' '}
                <a
                  href='https://github.com/michaelwschultz/hemolog.com'
                  className='text-primary-600 underline decoration-primary-200 underline-offset-2 hover:text-primary-700'
                >
                  GitHub
                </a>
                .
              </>
            ) : (
              card.body
            )}
          </p>
        </article>
      ))}
    </div>
  )
}
