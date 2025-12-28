import { IconShare } from '@tabler/icons-react'
import toast from 'react-hot-toast'

export default function PostFooter({ postId }: { postId: string }) {
  const handleCopy = async (postId: string) => {
    try {
      await navigator.clipboard.writeText(
        `https://hemolog.com/changelog#${postId}`
      )
      toast.success('Link copied!')
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast.error('Failed to copy link')
    }
  }

  return (
    <>
      <div className='h-8' />
      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-3'>
            <img
              src='/images/michael-avatar.jpg'
              alt='Michael Schultz'
              className='w-10 h-10 rounded-full'
            />
            <div>
              <div className='font-medium'>Michael Schultz</div>
              <a
                href='https://twitter.com/michaelschultz'
                className='text-primary-500 hover:text-primary-600 text-sm'
              >
                @michaelschultz
              </a>
            </div>
          </div>
        </div>
        <div className='flex-shrink-0'>
          <IconShare
            className='text-primary-500 hover:text-primary-600 cursor-pointer w-5 h-5'
            onClick={() => handleCopy(postId)}
          />
        </div>
      </div>
      <hr className='border-gray-200 my-4' />
      <div className='h-8' />
    </>
  )
}
