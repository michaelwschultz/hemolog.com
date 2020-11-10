import React from 'react'
import 'public/global_styles.css'

function MyApp({ Component, pageProps }): JSX.Element {
  return <Component {...pageProps} />
}

export default MyApp
