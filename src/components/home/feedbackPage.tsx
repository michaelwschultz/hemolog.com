'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useAuth } from '@/lib/auth'
import type { FeedbackType } from '@/lib/db/feedback'
import LoadingScreen from '@/components/shared/loadingScreen'

const handleReplyClick = (email: string) => {
  window.location.assign(
    `mailto:${email}?subject=Thanks for your feedback on Hemolog!`
  )
}

async function fetchFeedback(token: string): Promise<FeedbackType[]> {
  const response = await fetch('/api/feedback', {
    headers: { token },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch feedback')
  }
  return response.json()
}

const FeedbackPage = () => {
  const { user } = useAuth()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => fetchFeedback(user?.token || ''),
    enabled: !!user?.isAdmin && !!user?.token,
  })

  if (isError) {
    console.error({ message: 'Feedback API failed' })
    return <div>No data found</div>
  }

  if (isLoading || !data) {
    return <LoadingScreen />
  }

  return (
    <div className='space-y-4'>
      {data.map((feedback, index) => (
        <div
          key={`feedback-card-${
            // biome-ignore lint/suspicious/noArrayIndexKey: nothing else to use
            index
          }`}
          className='border border-gray-200 rounded-lg p-6'
        >
          <h3 className='text-lg font-semibold mb-2'>{feedback?.user?.name}</h3>
          <p className='text-gray-700 mb-4'>{feedback?.message}</p>

          <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
            <div className='flex items-center gap-3'>
              {feedback?.user?.photoUrl ? (
                <img
                  src={feedback?.user?.photoUrl}
                  alt={feedback?.user?.name || 'User'}
                  className='w-7 h-7 rounded-full'
                />
              ) : (
                <div className='w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700'>
                  {feedback?.user?.name?.charAt(0) || '?'}
                </div>
              )}
              <span className='text-sm text-gray-600'>
                {format(new Date(feedback?.createdAt), 'PPp')}
              </span>
            </div>
            <button
              type='button'
              onClick={() => handleReplyClick(feedback?.user?.email || '')}
              className='px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors'
            >
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeedbackPage
