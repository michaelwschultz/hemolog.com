import React from 'react'
import { useRouter } from 'next/router'
import { Grid, Text, Spacer, Button } from '@geist-ui/react'
import splitbee from '@splitbee/web'

import EmergencyCard from 'components/emergencyCard'
import EmergencySnippet from 'components/emergencySnippet'
import SettingsForm from 'components/settingsForm'
import { useAuth } from 'lib/auth'

const ProfilePage = (): JSX.Element => {
  const { user } = useAuth()
  const router = useRouter()

  splitbee.track('Viewed profile page')

  const handleOnPrintClick = () => {
    splitbee.track('Clicked Print Button', { page: '/profile' })
    router.push('/emergency/print')
  }

  return (
    <>
      <Grid.Container>
        <Grid xs={24} md={11} direction='column'>
          <Text h4>About you</Text>
          <SettingsForm />
        </Grid>
        <Spacer y={3} />
        <Grid xs={24} md={12} direction='column'>
          <h4>In case of emergency</h4>
          <Text>
            A medical worker can simply type in the URL listed on the card, or
            eaiser scan the QR code with their phone. This gives the worker a
            quick summary of all your info including your 3 most recent logs,
            and emergency contacts. These features aren’t available with Medic
            Alert.
          </Text>
          <Grid.Container gap={2} alignItems='center'>
            <Grid xs={24} sm={16}>
              <EmergencySnippet alertId={(user && user.alertId) || 'example'} />
            </Grid>
            <Grid xs={24} sm={8}>
              <Button type='secondary-light' auto onClick={handleOnPrintClick}>
                Print your card
              </Button>
            </Grid>
          </Grid.Container>
          <Spacer />
          <EmergencyCard />
        </Grid>
      </Grid.Container>
    </>
  )
}

export default ProfilePage
