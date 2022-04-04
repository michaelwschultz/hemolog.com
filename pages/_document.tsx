import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { CssBaseline } from '@geist-ui/react'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        })
      const initialProps = await Document.getInitialProps(ctx)
      const styles = CssBaseline.flush()

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const googleRichResultsSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      url: 'https://hemolog.com',
      logo: 'https://hemolog.com/images/hemolog-logo.png',
    }

    return (
      <Html>
        <Head>
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(googleRichResultsSchema),
            }}
          />
          <link
            rel='stylesheet'
            href='https://unpkg.com/react-vis/dist/style.css'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
