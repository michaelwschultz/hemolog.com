import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/router'

import EmergencyCard from 'components/emergencyCard'
import EmergencySnippet from 'components/emergencySnippet'
import SettingsForm from 'components/settingsForm'
import { useAuth } from 'lib/auth'
import { updateUser } from 'lib/db/users'
import { generateUniqueString, track } from 'lib/helpers'
import toast from 'react-hot-toast'
import useDbUser from 'lib/hooks/useDbUser'

const ProfilePage = (): JSX.Element => {
  const { user, signout } = useAuth()
  const { person } = useDbUser(user?.uid || '')
  const router = useRouter()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  track('Viewed Profile Page')

  const handleOnPrintClick = () => {
    track('Clicked Print Button', { page: '/profile' })
    router.push('/emergency/print')
  }

  const handleUpdateUserApiKey = useCallback(async () => {
    const newApiKey = await generateUniqueString(20)
    updateUser(user?.uid || '', { apiKey: newApiKey })
      .then(() => {
        toast.success('API key updated!')
      })
      .catch((error) => toast.error(`Something went wrong: ${error}`))
  }, [user])

  // biome-ignore lint/correctness/useExhaustiveDependencies: user is needed here
  useEffect(() => {
    if (person && !person.apiKey) {
      handleUpdateUserApiKey()
    }
  }, [user, person, handleUpdateUserApiKey])

  const handleDeleteAccount = async () => {
    if (!user?.token) {
      toast.error('Unable to delete account. Please sign in again and retry.')
      return
    }

    try {
      setIsDeletingAccount(true)
      track('Confirmed Delete Account')
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          token: user.token,
        },
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(errorMessage || 'Unable to delete account.')
      }

      toast.success(
        'Your account has been deleted. Thank you for trying Hemolog.'
      )
      setDeleteModalVisible(false)
      await signout?.()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete account. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      <div className='flex flex-col'>
        <h4 className='text-xl font-semibold mb-4'>About you</h4>
        <SettingsForm />

        <div className='h-12' />
        <h4 className='text-xl font-semibold mb-4'>API key</h4>
        <div className='flex gap-2 w-full'>
          <code className='flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 break-all'>
            {person?.apiKey || ' '}
          </code>
          <button
            type='button'
            onClick={handleUpdateUserApiKey}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors'
          >
            Reset key
          </button>
        </div>
        <p className='mt-2 text-gray-600'>
          Used to access the (limited) Hemolog API. No documentation exists yet
          but you can find more info inside the readme on Github.
        </p>
      </div>

      <div className='flex flex-col'>
        <h4 className='text-xl font-semibold mb-4'>In case of emergency</h4>
        <p className='mb-4 text-gray-600'>
          A medical worker can simply type in the URL listed on the card, or
          easier scan the QR code with their phone. This gives the worker a
          quick summary of all your info including your 3 most recent logs, and
          emergency contacts. These features aren't available with Medic Alert.
        </p>
        <div className='flex gap-2 w-full mb-4'>
          <div className='flex-1'>
            <EmergencySnippet alertId={user?.alertId || 'example'} />
          </div>
          <button
            type='button'
            onClick={handleOnPrintClick}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors whitespace-nowrap'
          >
            Print your card
          </button>
        </div>

        <EmergencyCard />

        <div className='h-12' />
        <h4 className='text-xl font-semibold mb-4'>Delete account</h4>
        <p className='mb-4 text-gray-600'>
          Deleting your account removes your profile, infusions, and emergency
          info forever. This action cannot be undone.
        </p>

        <button
          type='button'
          onClick={() => {
            track('Opened Delete Account Modal')
            setDeleteModalVisible(true)
          }}
          className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors w-fit'
        >
          Delete account
        </button>
      </div>

      {deleteModalVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold mb-4'>Delete your account?</h3>
            <p className='text-gray-600 mb-6'>
              This permanently deletes your Hemolog data and cannot be reversed.
              You will need to create a new account to return.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                type='button'
                onClick={() => setDeleteModalVisible(false)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className='px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2'
              >
                {isDeletingAccount && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                )}
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
