import Head from 'next/head'
import {
  Page,
  Text,
  Button,
  Row,
  Keyboard,
  Spacer,
  useModal,
  Loading,
} from '@geist-ui/react'

import { useAuth } from 'lib/auth'
import FeedbackModal from 'components/feedbackModal'
import InfusionModal from 'components/infusionModal'
import InfusionTable from 'components/infusionTable'
import Logo from 'components/logo'
import Sidebar from 'components/sidebar'
import Stats from 'components/stats'

export default function Logs(): JSX.Element {
  const auth = useAuth()

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

  // TODO(michael) add welcome message by checking to see if this is the users
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

  // TODO(michael): Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

  if (!auth.user) {
    return <Loading>Loading</Loading>
  }

  return (
    <>
      <Head>
        <title>Hemolog</title>
      </Head>
      <Sidebar>
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
                  Log infusion
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
            {/* TODO(michael) find out how this Spacer can be removed */}
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
      </Sidebar>
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
