import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Grid,
  Text,
  Spacer,
  Snippet,
  Button,
  useToasts,
  Modal,
  useModal,
} from '@geist-ui/react'

import EmergencyCard from 'components/emergencyCard'
import EmergencySnippet from 'components/emergencySnippet'
import SettingsForm from 'components/settingsForm'
import { useAuth } from 'lib/auth'
import { updateUser } from 'lib/db/users'
import { generateUniqueString, track } from 'lib/helpers'
import useDbUser from 'lib/hooks/useDbUser'

const ProfilePage = (): JSX.Element => {
  const { user, signout } = useAuth()
  const { person } = useDbUser(user?.uid || '')
  const router = useRouter()
  const [, setToast] = useToasts()
  const { visible, setVisible, bindings } = useModal()
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
        setToast({
          text: 'API key updated!',
          type: 'success',
          delay: 5000,
        })
      })
      .catch((error) =>
        setToast({
          text: `Something went wrong: ${error}`,
          type: 'error',
          delay: 10000,
        })
      )
  }, [setToast, user])

  // biome-ignore lint/correctness/useExhaustiveDependencies: user is needed here
  useEffect(() => {
    if (person && !person.apiKey) {
      handleUpdateUserApiKey()
    }
  }, [user, person, handleUpdateUserApiKey])

  const handleDeleteAccount = async () => {
    if (!user?.token) {
      setToast({
        text: 'Unable to delete account. Please sign in again and retry.',
        type: 'error',
        delay: 8000,
      })
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

      setToast({
        text: 'Your account has been deleted. Thank you for trying Hemolog.',
        type: 'success',
        delay: 8000,
      })
      setVisible(false)
      await signout?.()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete account. Please try again.'
      setToast({
        text: errorMessage,
        type: 'error',
        delay: 8000,
      })
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <Grid.Container>
      <Grid xs={24} md={11} direction='column'>
        <Text h4>About you</Text>
        <SettingsForm />

        <Spacer h={3} />
        <Text h4>API key</Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Snippet
            style={{ width: '100%' }}
            symbol=''
            text={person?.apiKey || ' '}
          />
          <Spacer />
          <Button type='secondary-light' auto onClick={handleUpdateUserApiKey}>
            Reset key
          </Button>
        </div>
        <Text>
          Used to access the (limited) Hemolog API. No documenation exists yet
          but you can find more info inside the readme on Github.
        </Text>
      </Grid>
      <Spacer h={3} />
      <Grid xs={24} md={12} direction='column'>
        <h4>In case of emergency</h4>
        <Text>
          A medical worker can simply type in the URL listed on the card, or
          eaiser scan the QR code with their phone. This gives the worker a
          quick summary of all your info including your 3 most recent logs, and
          emergency contacts. These features aren’t available with Medic Alert.
        </Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <EmergencySnippet
            alertId={user?.alertId || 'example'}
            style={{ width: '100%' }}
          />
          <Spacer />
          <Button type='secondary-light' auto onClick={handleOnPrintClick}>
            Print your card
          </Button>
        </div>
        {/* <Grid.Container gap={2} alignItems='center'>
            <Grid xs={24}>
              <EmergencySnippet alertId={(user && user.alertId) || 'example'} />
            </Grid>
            <Grid xs={24}>
              <Button type='secondary-light' auto onClick={handleOnPrintClick}>
                Print your card
              </Button>
            </Grid>
          </Grid.Container> */}
        <Spacer />
        <EmergencyCard />
        <Spacer h={3} />
        <Text h4>Delete account</Text>
        <Text>
          Deleting your account removes your profile, infusions, and emergency
          info forever. This action cannot be undone.
        </Text>
        <Spacer />
        <Button
          auto
          type='error'
          onClick={() => {
            track('Opened Delete Account Modal')
            setVisible(true)
          }}
        >
          Delete account
        </Button>
      </Grid>
      <Modal visible={visible} {...bindings}>
        <Modal.Title>Delete your account?</Modal.Title>
        <Modal.Content>
          <Text>
            This permanently deletes your Hemolog data and cannot be reversed.
            You will need to create a new account to return.
          </Text>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          type='error'
          loading={isDeletingAccount}
          disabled={isDeletingAccount}
          onClick={handleDeleteAccount}
        >
          Delete account
        </Modal.Action>
      </Modal>
    </Grid.Container>
  )
}

export default ProfilePage
