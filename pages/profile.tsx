import Head from 'next/head'
import Link from 'next/link'

import Sidebar from 'components/sidebar'
import { Page, Text, Button, Row, useModal, Spacer } from '@geist-ui/react'
import FeedbackModal from 'components/feedbackModal'
import Logo from 'components/logo'
import SettingsForm from 'components/settingsForm'
import EmergencyCard from 'components/emergencyCard'

export default function Profile(): JSX.Element {
  const {
    visible: feedbackModal,
    setVisible: setFeedbackModalVisible,
    bindings: feedbackModalBindings,
  } = useModal(false)

  // TODO(michael) Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

  return (
    <>
      <Head>
        <title>Hemolog - Profile</title>
      </Head>
      <Sidebar>
        <Page size='large'>
          <Page.Header style={{ paddingTop: '24px' }}>
            <Row align='middle'>
              <Logo />
            </Row>
          </Page.Header>
          <Page.Content>
            <Text h4>Your profile</Text>
            <SettingsForm />
            <Spacer y={3} />
            <h4>In case of emergency</h4>
            <div style={{ display: 'inline-block' }}>
              <Row justify='space-between' align='middle'>
                <Text>Hemolog card</Text>
                <Link href='/emergency/print'>Print your card</Link>
              </Row>
              <EmergencyCard />
            </div>
            <Text>
              A medical worker can simply type in the URL listed on the card, or
              eaiser scan the QR code with their phone. This gives the worker a
              quick summary of all your info including your 3 most recent logs,
              and emergency contacts. These features aren’t available with Medic
              Alert.
            </Text>
            <Spacer y={3} />
          </Page.Content>
          <Page.Footer style={{ paddingBottom: '16px' }}>
            {/* This footer overlays the content for some reason */}
            <Row justify='space-between' align='middle'>
              <Button
                onClick={() => setFeedbackModalVisible(true)}
                auto
                type='secondary-light'
              >
                Feedback
              </Button>
              {/* <Text p>
              Toggle sidebar with: <Keyboard ctrl>b</Keyboard>
            </Text> */}
            </Row>
          </Page.Footer>
        </Page>
      </Sidebar>
      <FeedbackModal
        visible={feedbackModal}
        setVisible={setFeedbackModalVisible}
        bindings={feedbackModalBindings}
      />
    </>
  )
}
