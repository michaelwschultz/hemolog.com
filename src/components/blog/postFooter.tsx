'use client'

import { IconShare } from '@tabler/icons-react'
import toast from 'react-hot-toast'

export default function PostFooter({ postId }: { postId: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://hemolog.com/changelog#${postId}`
      )
      toast.success('Link copied')
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast.error("Couldn't copy the link")
    }
  }

  return (
    <button
      type='button'
      onClick={handleCopy}
      className='inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate hover:text-ink'
    >
      <IconShare className='h-4 w-4' aria-hidden='true' />
      Copy link
    </button>
  )
}
