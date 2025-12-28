import Head from 'next/head'
import Image from 'next/image'

import StaticHeader from 'components/staticHeader'
import Footer from 'components/footer'
import BlogFooter from 'components/blog/blogFooter'
import PostFooter from 'components/blog/postFooter'

const Changelog = (): JSX.Element => {
  const articleRichResults = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'Hello world... again',
    image: ['https://hemolog.com/images/insights-example.png'],
    datePublished: '2020-02-05T08:00:00+08:00',
    dateModified: '2020-02-05T09:20:00+08:00',
  }

  return (
    <>
      <Head>
        <title>Hemolog - Changelog</title>
        <script
          type='application/ld+json'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: okay here
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleRichResults),
          }}
        />
      </Head>
      <div className='min-h-screen flex flex-col max-w-[850pt] w-full mx-auto'>
        <StaticHeader />
        <main className='flex-1 px-6 pt-10 pb-16'>
          <div className='max-w-2xl mx-auto'>
            <h2 className='text-3xl font-bold mb-2'>Changelog</h2>
            <h5 className='text-lg font-semibold text-gray-600 mb-8'>
              Development blog about new features, fixes, and updates to Hemolog
            </h5>
            <hr className='border-gray-200 mb-12' />

            <article id='post-1' className='pb-16'>
              <h4 className='text-xl font-semibold mb-2'>
                Hello world...again
              </h4>
              <h6 className='text-base font-medium text-gray-600 mb-4'>
                Hemolog is back and better than ever
              </h6>
              <div className='h-4' />

              <hr className='border-gray-200' />
              <div className='text-center text-sm font-medium text-gray-500 mb-4'>
                Update #1
              </div>
              <hr className='border-gray-200 mb-6' />
              <p className='text-gray-700 mb-4'>
                Hemolog is back! After 8 years, I've built a reincarnation of
                the old iPhone app Hemolog. This time around, it does a bit more
                than just storing your treatment logs. In this incarnation,
                Hemolog is now a web app and helps you understand your logs by
                giving showing you stats.
              </p>
              <p className='text-gray-700 mb-8'>
                The original Hemolog was built with the help of a contract
                developer. This time around I've designed and built everything
                from the ground up with the purpose of being the best place to
                store your infusion data and learn from it.
              </p>

              <figure className='mb-8'>
                <Image
                  src='/images/insights-example.png'
                  alt='Insights'
                  width={800}
                  height={400}
                  className='w-full rounded-lg shadow-lg'
                />
                <figcaption className='text-sm text-gray-600 mt-2 text-center'>
                  High level insights that help you understand your habits
                </figcaption>
              </figure>

              <p className='text-gray-700 mb-8'>
                These insights are calculated as you add more data. Filters will
                allow you to choose different time frames for viewing your data
                down the road giving you the best most comprehensive view into
                your treatment history ever. I've chosen a few insights that are
                interesting for me. If you have thoughts on what you would like
                to see just let me know.
              </p>

              <PostFooter postId='post-1' />
            </article>
          </div>

          <div className='h-8' />

          <BlogFooter />

          <div className='h-20' />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Changelog
