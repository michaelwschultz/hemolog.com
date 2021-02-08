import Head from 'next/head'
import type { AppProps } from 'next/app'
import {
  GeistProvider,
  CssBaseline,
  GeistUIThemesPalette,
} from '@geist-ui/react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from 'lib/theme'
import { AuthProvider } from 'lib/auth'

const hemologPalette: Partial<GeistUIThemesPalette> = {
  success: '#FF062C',
  successLight: '#FF398F',
  successDark: '#a3051d',
  warning: '#0070F3',
  warningLight: '#3291FF',
  warningDark: '#0761D1',
  error: '#48BB78',
  errorLight: '#48BB78',
  errorDark: '#48BB78',
  link: '#FF062C',
}

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
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GeistProvider theme={{ palette: hemologPalette }}>
            <CssBaseline />
            <Component {...pageProps} />
          </GeistProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  /* targets the empty div applied by nextjs so the sidebar follows the height of the page */

  html, body {
    height: 100%;
  }

  /*  targets Nextjs empty div issue */
  /* TODO(michael): remove scrollbar on mobile */
  body > div:first-child {
    overflow: -moz-scrollbars-vertical; 
    overflow-y: scroll;
    height: inherit;
  }

  a {
    font-weight: 600;
  }

  // overrides dumb geist-ui cssBaseline rules for unordered lists
  li:before {
    content: "" !important;
  }

  .ellipsis {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`
