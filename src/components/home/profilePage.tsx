'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ReactElement, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import EmergencyCard from '@/components/home/emergencyCard'
import SettingsForm from '@/components/home/settingsForm'
import EmergencySnippet from '@/components/shared/emergencySnippet'
import { Popup } from '@/components/shared/popup'
import { useAuth } from '@/lib/auth'
import { generateUniqueString, track } from '@/lib/helpers'
import { useUserMutations } from '@/lib/hooks/useUserMutations'
import { useUserQuery } from '@/lib/hooks/useUserQuery'

const ProfilePage = (): ReactElement => {
  const { user, signout } = useAuth()
  const { person } = useUserQuery(user?.uid)
  const { updateUser } = useUserMutations()
  const router = useRouter()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  useEffect(() => {
    track('Viewed Profile Page', {})
  }, [])

  const handleOnPrintClick = () => {
    track('Clicked Print Button', { page: '/app/profile' })
    router.push('/emergency/print')
  }

  const handleUpdateUserApiKey = useCallback(async () => {
    if (!user?.uid) return
    const newApiKey = await generateUniqueString(20)
    updateUser({ uid: user.uid, userData: { apiKey: newApiKey } })
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
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      <div className='flex flex-col'>
        <h2 className='mb-4 font-sans text-xl font-medium tracking-tight text-ink'>
          About you
        </h2>
        <SettingsForm />

        <div className='h-12' />
        <h2 className='mb-4 font-sans text-xl font-medium tracking-tight text-ink'>
          API key
        </h2>
        <div className='flex w-full gap-2'>
          <code className='flex-1 break-all rounded-xl border border-line bg-white px-3 py-2 font-mono text-sm text-ink'>
            {person?.apiKey || ' '}
          </code>
          <button
            type='button'
            onClick={handleUpdateUserApiKey}
            className='btn btn-secondary shrink-0'
          >
            Reset key
          </button>
        </div>
        <p className='mt-2 text-gray-600'>
          Used to access the Hemolog API. See the{' '}
          <Link
            href='/docs'
            className='text-primary-500 hover:text-primary-600'
          >
            API docs
          </Link>{' '}
          for endpoints and examples.
        </p>
      </div>

      <div className='flex flex-col'>
        <h2 className='mb-4 font-sans text-xl font-medium tracking-tight text-ink'>
          In case of emergency
        </h2>
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
            className='btn btn-secondary shrink-0'
          >
            Print your card
          </button>
        </div>

        <EmergencyCard />

        <div className='h-12' />
        <h2 className='mb-4 font-sans text-xl font-medium tracking-tight text-ink'>
          Delete account
        </h2>
        <p className='mb-4 text-gray-600'>
          Deleting your account removes your profile, treatments, and emergency
          info forever. This action cannot be undone.
        </p>

        <button
          type='button'
          onClick={() => {
            track('Opened Delete Account Modal', {})
            setDeleteModalVisible(true)
          }}
          className='btn btn-danger'
        >
          Delete account
        </button>
      </div>

      <Popup
        open={deleteModalVisible}
        title='Delete your account?'
        onClose={() => setDeleteModalVisible(false)}
      >
        <div className='p-6'>
          <p className='text-sm leading-relaxed text-slate'>
            This permanently deletes your Hemolog data and cannot be reversed.
            You will need to create a new account to return.
          </p>
          <div className='mt-6 flex justify-end gap-3'>
            <button
              type='button'
              onClick={() => setDeleteModalVisible(false)}
              className='btn btn-secondary'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className='btn btn-danger'
            >
              {isDeletingAccount && (
                <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              )}
              Delete account
            </button>
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default ProfilePage
