import type { Metadata } from 'next'
import { Nanum_Pen_Script } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const nanumPenScript = Nanum_Pen_Script({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nanum-pen-script',
})

export const metadata: Metadata = {
  title: 'Hemolog',
  description:
    'Back and better than ever! Hemolog 2 provides real-time insights on your hemophilia treatment regimen for free.',
  openGraph: {
    url: 'https://hemolog.com',
    type: 'website',
    title: 'Hemolog 2',
    description:
      'Back and better than ever! Hemolog 2 provides real-time insights on your hemophilia treatment regimen for free.',
    images: [
      {
        url: 'https://hemolog.com/images/og-image.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hemolog 2',
    description:
      'Back and better than ever! Hemolog 2 provides real-time insights on your hemophilia treatment regimen for free.',
    images: [
      {
        url: 'https://hemolog.com/images/og-image.png',
      },
    ],
  },
  icons: {
    apple: '/images/apple-touch-icon.png',
    icon: [
      {
        url: '/images/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/images/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={nanumPenScript.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
