import React from 'react'
import {
  Text,
  Row,
  Col,
  Spacer,
  useModal,
  Link,
  Divider,
} from '@geist-ui/react'
import styled from 'styled-components'

import EmergencySnippet from 'components/emergencySnippet'
import FeedbackModal from 'components/feedbackModal'
import { useAuth } from 'lib/auth'

export default function Footer(): JSX.Element {
  const {
    visible: feedbackModal,
    setVisible: setFeedbackModalVisible,
    bindings: feedbackModalBindings,
  } = useModal(false)

  const { user, loading } = useAuth()

  const alertId = () => {
    if (loading) {
      return ''
    }
    if (user) {
      return user.alertId
    }
    return 'Sign up to get yours'
  }

  return (
    <StyledFooter>
      <Divider />
      <Spacer y={2} />
      <Row justify='space-between' align='middle'>
        <Col>
          <Text h5>Hemolog 2</Text>
          <a onClick={() => setFeedbackModalVisible(true)}>Give feedback</a>
          <Spacer />
          <Text h5>Emergency Link</Text>
          <EmergencySnippet alertId={alertId()} />
        </Col>
        <Col>
          <Text h5>Follow</Text>
          <Text>
            <Link color href='https://twitter.com/hemolog'>
              @Hemolog
            </Link>
          </Text>
          <Text>
            <Link color href='https://twitter.com/michaelschultz'>
              @MichaelSchultz
            </Link>
          </Text>
          <Text p>hemolog.com © {new Date().getFullYear()}</Text>
        </Col>
      </Row>
      <FeedbackModal
        visible={feedbackModal}
        setVisible={setFeedbackModalVisible}
        bindings={feedbackModalBindings}
      />
    </StyledFooter>
  )
}

const StyledFooter = styled.footer`
  padding: 40px 24px;
`
