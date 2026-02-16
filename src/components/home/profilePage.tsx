'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import EmergencyCard from '@/components/home/emergencyCard'
import SettingsForm from '@/components/home/settingsForm'
import ApiKeyField from '@/components/shared/apiKeyField'
import Button from '@/components/shared/button'
import EmergencySnippet from '@/components/shared/emergencySnippet'
import { useAuth } from '@/lib/auth'
import { generateUniqueString, track } from '@/lib/helpers'
import { useUserMutations } from '@/lib/hooks/useUserMutations'
import { useUserQuery } from '@/lib/hooks/useUserQuery'

const ProfilePage = () => {
  const { user, signout } = useAuth()
  const { person } = useUserQuery(user?.uid)
  const { updateUser } = useUserMutations()
  const router = useRouter()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [resetKeyModalVisible, setResetKeyModalVisible] = useState(false)

  useEffect(() => {
    track('Viewed Profile Page', {})
  }, [])

  const handleOnPrintClick = () => {
    track('Clicked Print Button', { page: '/profile' })
    router.push('/emergency/print')
  }

  const handleUpdateUserApiKey = useCallback(async () => {
    if (!user?.uid) return
    const newApiKey = await generateUniqueString(20)
    updateUser({ uid: user.uid, userData: { apiKey: newApiKey } })
    setResetKeyModalVisible(false)
    toast.success('API key reset successfully')
  }, [user?.uid, updateUser])

  // Only create API key once when person is loaded and doesn't have one
  useEffect(() => {
    if (person && !person.apiKey && user?.uid) {
      handleUpdateUserApiKey()
    }
  }, [person, person?.apiKey, user?.uid, handleUpdateUserApiKey])

  const handleDeleteAccount = async () => {
    if (!user?.token) {
      toast.error('Unable to delete account. Please sign in again and retry.')
      return
    }

    try {
      setIsDeletingAccount(true)
      track('Confirmed Delete Account', {})
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
    <div className='space-y-8'>
      {/* Profile Settings */}
      <section>
        <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-6'>
          About you
        </h2>
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <SettingsForm />
        </div>
      </section>

      {/* Emergency Card */}
      <section>
        <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-6'>
          In case of emergency
        </h2>
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <p className='mb-6 text-sm font-medium text-gray-500 leading-relaxed'>
            A medical worker can simply type in the URL listed on the card, or
            easier scan the QR code with their phone. This gives the worker a
            quick summary of all your info including your 3 most recent logs,
            and emergency contacts. These features aren't available with Medic
            Alert.
          </p>
          <div className='flex gap-3 mb-6'>
            <div className='flex-1'>
              <EmergencySnippet alertId={user?.alertId || 'example'} />
            </div>
            <Button variant='secondary' onClick={handleOnPrintClick}>
              Print your card
            </Button>
          </div>
          <EmergencyCard />
        </div>
      </section>

      {/* Account Management */}
      <section>
        <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-6'>
          Account management
        </h2>
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6'>
          {/* API Key */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 mb-1'>
              API key
            </h3>
            <p className='text-sm text-gray-500 mb-3'>
              Used to access the (limited) Hemolog API. Find more info in the
              readme on Github.
            </p>
            <ApiKeyField
              apiKey={person?.apiKey}
              onReset={() => setResetKeyModalVisible(true)}
            />
          </div>

          <div className='border-t border-gray-100' />

          {/* Delete Account */}
          <div className='flex gap-4 items-start justify-between'>
            <div>
              <h3 className='text-sm font-semibold text-gray-900 mb-1'>
                Delete account
              </h3>
              <p className='text-sm text-gray-500'>
                Permanently remove your profile, treatments, and emergency info.
              </p>
            </div>
            <Button
              variant='danger'
              onClick={() => {
                track('Opened Delete Account Modal', {})
                setDeleteModalVisible(true)
              }}
            >
              Delete account
            </Button>
          </div>
        </div>
      </section>

      {resetKeyModalVisible && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl'>
            <h3 className='text-lg font-bold tracking-tight text-gray-900 mb-3'>
              Reset API key?
            </h3>
            <p className='text-sm font-medium text-gray-500 mb-6 leading-relaxed'>
              This will invalidate your current API key and generate a new one.
              Any applications using the old key will stop working immediately.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button
                variant='ghost'
                onClick={() => setResetKeyModalVisible(false)}
              >
                Cancel
              </Button>
              <Button variant='danger' onClick={handleUpdateUserApiKey}>
                Reset key
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteModalVisible && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl'>
            <h3 className='text-lg font-bold tracking-tight text-gray-900 mb-3'>
              Delete your account?
            </h3>
            <p className='text-sm font-medium text-gray-500 mb-6 leading-relaxed'>
              This permanently deletes your Hemolog data and cannot be reversed.
              You will need to create a new account to return.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button
                variant='ghost'
                onClick={() => setDeleteModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                variant='danger'
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                isLoading={isDeletingAccount}
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
