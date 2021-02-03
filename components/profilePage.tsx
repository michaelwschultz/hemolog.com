import React from 'react'
import { Grid, Text, Spacer, Row, Link } from '@geist-ui/react'

import EmergencyCard from 'components/emergencyCard'
import EmergencySnippet from 'components/emergencySnippet'
import SettingsForm from 'components/settingsForm'
import { useAuth } from 'lib/auth'

const ProfilePage = (): JSX.Element => {
  const { user } = useAuth()

  return (
    <>
      <Grid.Container>
        <Grid xs={24} md={11}>
          <Text h4>About you</Text>
          <SettingsForm />
        </Grid>
        <Spacer y={3} />
        <Grid xs={24} md={12}>
          <h4>In case of emergency</h4>
          <Text>
            A medical worker can simply type in the URL listed on the card, or
            eaiser scan the QR code with their phone. This gives the worker a
            quick summary of all your info including your 3 most recent logs,
            and emergency contacts. These features aren’t available with Medic
            Alert.
          </Text>
          <div style={{ display: 'inline-block' }}>
            <Row justify='space-between' align='middle'>
              <EmergencySnippet alertId={user.alertId} />
              <Link color href='/emergency/print'>
                Print your card
              </Link>
            </Row>
            <Spacer />
            <EmergencyCard />
          </div>
        </Grid>
      </Grid.Container>
    </>
  )
}

export default ProfilePage
