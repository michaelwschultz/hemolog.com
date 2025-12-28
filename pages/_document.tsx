import Document, {
  type DocumentContext,
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
          enhanceApp: (App) => (props) =>
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
            // biome-ignore lint/security/noDangerouslySetInnerHtml: okay here
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(googleRichResultsSchema),
            }}
          />
          <link
            href='https://fonts.googleapis.com/css?family=Nanum+Pen+Script&display=swap'
            rel='stylesheet'
          />
          {/* react-vis CSS is loaded dynamically when Chart component is used */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
