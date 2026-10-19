'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ReactElement, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import EmergencyCard from '@/components/home/emergencyCard'
import SettingsForm from '@/components/home/settingsForm'
import { track } from '@/components/shared/analytics'
import EmergencySnippet from '@/components/shared/emergencySnippet'
import { Popup } from '@/components/shared/popup'
import { useAuth } from '@/lib/auth'
import {
  maskApiKey,
  useApiKeysMutations,
  useApiKeysQuery,
} from '@/lib/hooks/useApiKeys'
import type { ApiKeyEntry } from '@/lib/types/users'

const ProfilePage = (): ReactElement => {
  const { user, signout } = useAuth()
  const router = useRouter()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [keyPendingRevoke, setKeyPendingRevoke] = useState<ApiKeyEntry | null>(
    null
  )

  const { apiKeys, isLoading: isLoadingKeys } = useApiKeysQuery(user?.uid)
  const { createApiKey, revokeApiKey, isCreating, isRevoking } =
    useApiKeysMutations()
  const [newKeyDescription, setNewKeyDescription] = useState('')
  const [revealedKeyIds, setRevealedKeyIds] = useState<string[]>([])

  const handleCreateKey = () => {
    if (!user?.uid) return
    createApiKey({ uid: user.uid, description: newKeyDescription })
    setNewKeyDescription('')
  }

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Unable to copy. Reveal the key and copy it manually.')
    }
  }

  const toggleRevealKey = (id: string) => {
    setRevealedKeyIds((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    track('Viewed Profile Page', {})
  }, [])

  const handleOnPrintClick = () => {
    track('Clicked Print Button', { page: '/app/profile' })
    router.push('/emergency/print')
  }

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
          API keys
        </h2>
        <div className='space-y-4'>
          <div className='flex w-full gap-2'>
            <input
              type='text'
              value={newKeyDescription}
              onChange={(e) => setNewKeyDescription(e.target.value)}
              placeholder='Key description (e.g. "Mobile app")'
              className='flex-1 rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink'
              maxLength={50}
            />
            <button
              type='button'
              onClick={handleCreateKey}
              disabled={isCreating || !newKeyDescription.trim()}
              className='btn btn-primary shrink-0'
            >
              {isCreating ? 'Creating...' : 'Create key'}
            </button>
          </div>

          {isLoadingKeys ? (
            <p className='text-sm text-gray-600'>Loading API keys...</p>
          ) : apiKeys.length === 0 ? (
            <p className='text-sm text-gray-600'>No API keys created yet.</p>
          ) : (
            <div className='space-y-2'>
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className='flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm text-ink truncate'>
                      {key.description}
                    </p>
                    <code className='font-mono text-xs text-gray-600 break-all'>
                      {revealedKeyIds.includes(key.id)
                        ? key.key
                        : maskApiKey(key.key)}
                    </code>
                  </div>
                  {key.revokedAt ? (
                    <span className='ml-4 shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500'>
                      Revoked
                    </span>
                  ) : (
                    <div className='flex items-center gap-2 ml-4 shrink-0'>
                      <button
                        type='button'
                        onClick={() =>
                          handleCopyKey(
                            revealedKeyIds.includes(key.id)
                              ? key.key
                              : maskApiKey(key.key)
                          )
                        }
                        className='text-xs text-gray-500 hover:text-ink'
                      >
                        Copy
                      </button>
                      <button
                        type='button'
                        onClick={() => toggleRevealKey(key.id)}
                        className='text-xs text-gray-500 hover:text-ink'
                      >
                        {revealedKeyIds.includes(key.id) ? 'Hide' : 'Reveal'}
                      </button>
                      <button
                        type='button'
                        onClick={() => setKeyPendingRevoke(key)}
                        className='text-xs text-red-500 hover:text-red-700'
                      >
                        Revoke
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
        open={!!keyPendingRevoke}
        title='Revoke this API key?'
        onClose={() => setKeyPendingRevoke(null)}
        footer={
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setKeyPendingRevoke(null)}
              className='btn btn-secondary flex-1'
            >
              Cancel
            </button>
            <button
              type='button'
              disabled={isRevoking}
              onClick={() => {
                if (user?.uid && keyPendingRevoke) {
                  track('Revoked API Key', {})
                  revokeApiKey({ id: keyPendingRevoke.id, uid: user.uid })
                  setKeyPendingRevoke(null)
                }
              }}
              className='btn btn-danger flex-1'
            >
              {isRevoking ? 'Revoking...' : 'Revoke key'}
            </button>
          </div>
        }
      >
        <p className='text-sm text-gray-600'>
          Anything using <strong>{keyPendingRevoke?.description}</strong> will
          immediately lose access to the Hemolog API. This cannot be undone.
        </p>
      </Popup>

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
