import Head from 'next/head'
import Link from 'next/link'

import { Page, Text, Row, Spacer, Grid } from '@geist-ui/react'
import { useAuth } from 'lib/auth'
import SettingsForm from 'components/settingsForm'
import EmergencyCard from 'components/emergencyCard'
import Header from 'components/header'
import Footer from 'components/footer'
import EmergencySnippet from 'components/emergencySnippet'

export default function Profile(): JSX.Element {
  const { user } = useAuth()
  // TODO(michael) Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

  return (
    <>
      <Head>
        <title>Hemolog - Profile</title>
      </Head>
      <Page size='large'>
        <Header />
        <Page.Content>
          <Grid.Container>
            <Grid xs={24} md={11}>
              <Text h4>About you</Text>
              <SettingsForm />
            </Grid>
            <Spacer y={3} />
            <Grid xs={24} md={12}>
              <h4>In case of emergency</h4>
              <Text>
                A medical worker can simply type in the URL listed on the card,
                or eaiser scan the QR code with their phone. This gives the
                worker a quick summary of all your info including your 3 most
                recent logs, and emergency contacts. These features aren’t
                available with Medic Alert.
              </Text>
              <div style={{ display: 'inline-block' }}>
                <Row justify='space-between' align='middle'>
                  <EmergencySnippet alertId={user.alertId} />
                  <Link href='/emergency/print'>Print your card</Link>
                </Row>
                <Spacer />
                <EmergencyCard />
              </div>
            </Grid>
          </Grid.Container>
          <Spacer y={3} />
        </Page.Content>
        <Footer />
      </Page>
    </>
  )
}
