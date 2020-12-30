import Head from 'next/head'
import { GeistProvider, CssBaseline } from '@geist-ui/react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from 'lib/theme'
import { AuthProvider, ProtectRoute } from 'lib/auth'

export default function App({ Component, pageProps }): JSX.Element {
  return (
    <>
      <Head>
        <link rel='apple-touch-icon' href='/images/apple-touch-icon.png' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <title>Hemolog</title>
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GeistProvider>
            <CssBaseline />
            <ProtectRoute>
              <Component {...pageProps} />
            </ProtectRoute>
          </GeistProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

/* TODO(michael) find out where to import this */
/* @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,900;1,400;1,900&display=swap'); */

const GlobalStyle = createGlobalStyle`
  /* targets the empty div applied by nextjs so the sidebar follows the height of the page */
  body > div {
    height: inherit;
  }

  b {
    font-weight: 900;
  }

  a {
    color: inherit;
  }

  // overrides dumb geist-ui cssBaseline rules for unordered lists
  li:before {
    content: "" !important;
  }

  .ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`
