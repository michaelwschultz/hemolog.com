import type { ReactElement } from 'react'
import BlogFooter from '@/components/blog/blogFooter'
import {
  ChangelogEntry,
  changelogPosts,
} from '@/components/blog/changelogPosts'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

const Changelog = (): ReactElement => {
  return (
    <div className='page'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-6 pb-16 sm:pt-10'>
        <div className='mx-auto max-w-2xl'>
          <p className='mb-3 text-[13px] font-medium tracking-[0.16em] text-primary-700 uppercase'>
            Development blog
          </p>
          <h1 className='text-4xl text-ink sm:text-5xl'>Changelog</h1>
          <p className='mt-3 max-w-xl text-lg text-slate'>
            New features, fixes, and updates to Hemolog
          </p>
          <div className='mt-10 border-t border-line'>
            {changelogPosts.map((post) => (
              <ChangelogEntry key={post.id} post={post} />
            ))}
          </div>
          <BlogFooter />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Changelog
