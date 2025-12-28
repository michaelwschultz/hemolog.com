import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'lib/contexts/ThemeContext'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const description =
    'Back and better than ever! Hemolog 2 provides real-time insights on your hemophilia treatment regimen for free.'

  return (
    <>
      <Head>
        <meta
          property='og:image'
          content='https://hemolog.com/images/og-image.png'
        />
        <title>Hemolog</title>
        <meta name='description' content={description} />

        <meta property='og:url' content='https://hemolog.com' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Hemolog 2' />
        <meta property='og:description' content={description} />
        <meta
          property='og:image'
          content='https://hemolog.com/images/og-image.png'
        />

        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:domain' content='hemolog.com' />
        <meta property='twitter:url' content='https://hemolog.com' />
        <meta name='twitter:title' content='Hemolog 2' />
        <meta name='twitter:description' content={description} />
        <meta
          name='twitter:image'
          content='https://hemolog.com/images/og-image.png'
        />

        <link rel='apple-touch-icon' href='/images/apple-touch-icon.png' />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/images/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/images/favicon-16x16.png'
        />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        {/* <script
          defer
          src='https://assets.onedollarstats.com/stonks.js'
          data-debug={
            process.env.NODE_ENV !== 'production' ? 'hemolog.com' : undefined
          }
        /> */}
      </Head>
      <div className='min-h-screen'>
        <ThemeProvider>
          <Toaster
            position='top-right'
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
            }}
          />
          <Component {...pageProps} />
        </ThemeProvider>
      </div>
    </>
  )
}
