import Head from 'next/head'
import Sidebar from 'components/sidebar'
import { Page, Text, Button, Row, useModal } from '@geist-ui/react'
import FeedbackModal from 'components/feedbackModal'
import Logo from 'components/logo'
import SettingsForm from 'components/settingsForm'

export default function Settings(): JSX.Element {
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
        <title>Hemolog - Settings</title>
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
