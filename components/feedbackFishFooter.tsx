// import { FeedbackFish } from '@feedback-fish/react'

export default function Footer(): JSX.Element {
  // NOTE(michael): testing out https://feedback.fish.
  // const PROJECT_ID = process.env.FEEDBACK_FISH_PROJECT_ID

  return (
    <footer className='py-8 px-6 border-t border-gray-200 bg-gray-50'>
      <div className='flex justify-between items-center max-w-6xl mx-auto'>
        {/* <FeedbackFish projectId={PROJECT_ID}>
          <button className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm'>
            Feedback
          </button>
        </FeedbackFish> */}

        <p className='text-gray-600'>
          Built by{' '}
          <a
            href='https://michaelschultz.com'
            className='text-primary-500 hover:text-primary-600'
          >
            Michael Schultz
          </a>
        </p>
      </div>
    </footer>
  )
}
