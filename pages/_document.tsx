import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
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
