import { useState } from 'react'
import Head from 'next/head'
import Sidebar from 'components/sidebar'
import { useUser } from 'utils/auth/useUser'
import {
  Page,
  Text,
  Button,
  Row,
  Col,
  Keyboard,
  Spacer,
  useMediaQuery,
  useModal,
  Note,
} from '@geist-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import FeedbackModal from 'components/feedbackModal'
import Logo from 'components/logo'

export default function Home(): JSX.Element {
  const { user } = useUser()
  const largerThanSm = useMediaQuery('md', { match: 'up' })
  const [showSidebar, setShowSidebar] = useState(true)
  const toggleSidebar = () => setShowSidebar((prevState) => !prevState)
  useHotkeys('ctrl+b', toggleSidebar)

  const {
    visible: feedbackModal,
    setVisible: setFeedbackModalVisible,
    bindings: feedbackModalBindings,
  } = useModal(false)

  // TODO: Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU
  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Hemolog - Settings</title>
      </Head>
      {/* TODO: hide mobal sidebar on load */}
      {showSidebar && !largerThanSm && <Sidebar />}
      <Row>
        {showSidebar && largerThanSm && (
          <Col span={5}>
            <Sidebar />
          </Col>
        )}
        <Page size='large'>
          <Page.Header style={{ paddingTop: '24px' }}>
            <Row justify='space-between' align='middle'>
              <Logo />
              <Button onClick={toggleSidebar} auto>
                Toggle sidebar
              </Button>
            </Row>
          </Page.Header>
          <Page.Content>
            <Note label='Note'>
              Soon you'll be able to add more info to your profile here like
              severity type. That might also be something that is required when
              you sign up.
            </Note>
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
              <Text p>
                Toggle sidebar with: <Keyboard ctrl>b</Keyboard>
              </Text>
            </Row>
          </Page.Footer>
        </Page>
      </Row>
      <FeedbackModal
        visible={feedbackModal}
        setVisible={setFeedbackModalVisible}
        bindings={feedbackModalBindings}
      />
    </>
  )
}
