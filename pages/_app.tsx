import { useState } from 'react'
import Head from 'next/head'
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
  secondary: '#48BB78',
}

export default function App({ Component, pageProps }): JSX.Element {
  return (
    <>
      <Head>
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
        {/* TODO(michael): Remove - Testing UserSnap.com */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
                  window.onUsersnapCXLoad = function(api) {
                    api.init();
                  }
                  var script = document.createElement('script');
                  script.defer = 1;
                  script.src = 'https://widget.usersnap.com/global/load/6ea08345-b2f7-49f4-8464-394143662980?onload=onUsersnapCXLoad';
                  document.getElementsByTagName('head')[0].appendChild(script);
                  `,
          }}
        /> */}
        <title>Hemolog</title>
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

  b {
    font-weight: 900;
  }

  a {
    font-weight: 600;
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
