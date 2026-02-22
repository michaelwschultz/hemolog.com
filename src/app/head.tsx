const googleRichResultsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://hemolog.com',
  logo: 'https://hemolog.com/images/hemolog-logo.png',
}

export default function Head(): JSX.Element {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(googleRichResultsSchema),
      }}
    />
  )
}
