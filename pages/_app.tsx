import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from 'lib/theme'

export default function App({ Component, pageProps }): JSX.Element {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

/* TODO find out where to import this */
/* @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,900;1,400;1,900&display=swap'); */

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    height: inherit;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  }

  /* targets the empty div applied by nextjs so the sidebar follows the height of the page */
  body > div {
    height: inherit;
  }

  b {
    font-weight: 900;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`
