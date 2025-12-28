import { useAuth } from 'lib/auth'

export default function Identity(): JSX.Element {
  const { user } = useAuth()

  return (
    <div className='flex flex-col items-center'>
      {!user ? (
        <h4 className='text-xl font-semibold'>Loading user...</h4>
      ) : (
        <>
          <div className='flex justify-center'>
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.displayName || 'User'}
                className='w-16 h-16 rounded-full'
              />
            ) : (
              <div className='w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-gray-700'>
                {user.displayName?.charAt(0) || '?'}
              </div>
            )}
          </div>
          <div className='h-8' />
          <h4 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {user.displayName}
          </h4>
        </>
      )}
    </div>
  )
}
