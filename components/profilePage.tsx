import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Grid, Text, Spacer, Snippet, Button, useToasts } from '@geist-ui/react'

import EmergencyCard from 'components/emergencyCard'
import EmergencySnippet from 'components/emergencySnippet'
import SettingsForm from 'components/settingsForm'
import { useAuth } from 'lib/auth'
import { updateUser } from 'lib/db/users'
import { generateUniqueString, track } from 'lib/helpers'
import useDbUser from 'lib/hooks/useDbUser'

const ProfilePage = (): JSX.Element => {
  const { user } = useAuth()
  const { person } = useDbUser(user?.uid || '')
  const router = useRouter()
  const [, setToast] = useToasts()

  track('Viewed Profile Page')

  const handleOnPrintClick = () => {
    track('Clicked Print Button', { page: '/profile' })
    router.push('/emergency/print')
  }

  const handleUpdateUserApiKey = useCallback(async () => {
    const newApiKey = await generateUniqueString(20)
    updateUser(user!.uid, { apiKey: newApiKey })
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

  useEffect(() => {
    if (person && !person.apiKey) {
      handleUpdateUserApiKey()
    }
  }, [user, person, handleUpdateUserApiKey])

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
      </Grid>
    </Grid.Container>
  )
}

export default ProfilePage
