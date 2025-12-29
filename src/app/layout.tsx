import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

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

const googleRichResultsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://hemolog.com',
  logo: 'https://hemolog.com/images/hemolog-logo.png',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(googleRichResultsSchema),
          }}
        />
        <link
          href='https://fonts.googleapis.com/css?family=Nanum+Pen+Script&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
