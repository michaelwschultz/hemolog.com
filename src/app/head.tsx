import type { ReactElement } from 'react'

const googleRichResultsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://hemolog.com',
  logo: 'https://hemolog.com/images/hemolog-logo.png',
}

export default function Head(): ReactElement {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(googleRichResultsSchema),
      }}
    />
  )
}
