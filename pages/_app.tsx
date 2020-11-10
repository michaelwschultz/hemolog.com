import { createGlobalStyle, ThemeProvider } from 'styled-components'

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

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  }
`

const theme = {
  colors: {
    text: 'white',
    primary: 'salmon',
  },
}
