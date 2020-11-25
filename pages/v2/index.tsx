import { useState } from 'react'
import Head from 'next/head'
import InfusionTable from 'components/firebaseInfusionTable'
import Stats from 'components/stats'
// import Chart from 'components/chart'
import Sidebar from 'components/sidebar'
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
} from '@geist-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import FeedbackModal from 'components/feedbackModal'
import InfusionModal from 'components/infusionModal'
import { useUser } from 'utils/auth/useUser'
import Logo from 'components/logo'

export default function Home(): JSX.Element {
  const { user } = useUser()
  const largerThanSm = useMediaQuery('md', { match: 'up' })

  // TODO: store this variable in localstorage so it persists across pages
  const [showSidebar, setShowSidebar] = useState(true)
  const toggleSidebar = () => setShowSidebar((prevState) => !prevState)
  useHotkeys('ctrl+b', toggleSidebar)

  const {
    visible: feedbackModal,
    setVisible: setFeedbackModalVisible,
    bindings: feedbackModalBindings,
  } = useModal(false)

  const {
    visible: infusionModal,
    setVisible: setInfusionModalVisible,
    bindings: infusionModalBindings,
  } = useModal(false)

  // TODO: add welcome message by checking to see if this is the users
  // first time logging in. Still not sure how to accomplish this.
  //
  // const [toasts, setToast] = useToasts()

  // // displays welcome message on first login
  // useEffect(() => {
  //   if (user && !toasts.length) {
  //     setToast({
  //       text: '👋 Welcome to Hemolog 2!',
  //       delay: 12000,
  //       type: 'success',
  //       actions: [
  //         {
  //           name: 'thanks',
  //           passive: true,
  //           handler: (_event, cancel) => cancel(),
  //         },
  //       ],
  //     })
  //   }
  // }, [user])

  // TODO: Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU
  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Hemolog 2</title>
      </Head>
      {/* TODO: fix server side issue of sidebar not being found in HTML */}
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
              <Row>
                <Button
                  onClick={() => setInfusionModalVisible(true)}
                  auto
                  type='success-light'
                >
                  New infusion
                </Button>
                <Spacer x={0.5} />
                <Button onClick={toggleSidebar} auto>
                  Toggle sidebar
                </Button>
              </Row>
            </Row>
          </Page.Header>
          <Page.Content>
            <Text h4>Stats</Text>
            <Stats />
            {/* <Chart /> */}
            <Spacer y={3} />
            <Text h4>Infusions</Text>
            <InfusionTable />
            {/* TODO: find out how this Spacer can be removed */}
            <Spacer y={5} />
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
      <InfusionModal
        visible={infusionModal}
        setVisible={setInfusionModalVisible}
        bindings={infusionModalBindings}
      />
    </>
  )
}
