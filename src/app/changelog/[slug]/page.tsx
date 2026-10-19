import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import BlogFooter from '@/components/blog/blogFooter'
import {
  ChangelogEntry,
  getChangelogPost,
} from '@/components/blog/changelogPosts'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

const ChangelogPost = async ({ params }: PageProps): Promise<ReactElement> => {
  const { slug } = await params
  const post = getChangelogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className='page'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-6 pb-16 sm:pt-10'>
        <div className='mx-auto max-w-2xl'>
          <Link
            href='/changelog'
            className='text-sm font-medium text-ink underline decoration-primary-500 decoration-2 underline-offset-4'
          >
            Changelog
          </Link>
          <ChangelogEntry post={post} full />
          <BlogFooter />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ChangelogPost
