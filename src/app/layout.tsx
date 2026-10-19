'use client'

import { IBM_Plex_Mono, Outfit, Syne } from 'next/font/google'
import { Analytics } from '@/components/shared/analytics'
import { Providers } from './providers'
import './globals.css'

const syne = Syne({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
})

const outfit = Outfit({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
})

// export const metadata: Metadata = {
//   title: 'Hemolog',
//   description:
//     'Back and better than ever! Hemolog 2 provides real-time insights on your hemophilia treatment regimen for free.',
//   openGraph: {
//     url: 'https://hemolog.com',
//     type: 'website',
//     title: 'Hemolog 2',
//     description:
//       'Back and better than ever! Hemolog 2 provides real-time insights on your hemophilia treatment regimen for free.',
//     images: [
//       {
//         url: 'https://hemolog.com/images/og-image.png',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Hemolog 2',
//     description:
//       'Back and better than ever! Hemolog 2 provides real-time insights on your hemophilia treatment regimen for free.',
//     images: [
//       {
//         url: 'https://hemolog.com/images/og-image.png',
//       },
//     ],
//   },
//   icons: {
//     apple: '/images/apple-touch-icon.png',
//     icon: [
//       {
//         url: '/images/favicon-32x32.png',
//         sizes: '32x32',
//         type: 'image/png',
//       },
//       {
//         url: '/images/favicon-16x16.png',
//         sizes: '16x16',
//         type: 'image/png',
//       },
//     ],
//   },
//   manifest: '/manifest.json',
//   other: {
//     'mobile-web-app-capable': 'yes',
//     'apple-mobile-web-app-capable': 'yes',
//   },
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${syne.variable} ${outfit.variable} ${plexMono.variable}`}
    >
      <body>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
