import React from 'react'
import { Text, Page, Row, Button, useModal, Link } from '@geist-ui/react'

import FeedbackModal from 'components/feedbackModal'

export default function Footer(): JSX.Element {
  const {
    visible: feedbackModal,
    setVisible: setFeedbackModalVisible,
    bindings: feedbackModalBindings,
  } = useModal(false)

  return (
    <Page.Footer>
      <Row justify='space-between' align='middle'>
        <Button
          onClick={() => setFeedbackModalVisible(true)}
          auto
          type='secondary-light'
        >
          Feedback
        </Button>

        <Text p>
          Built by{' '}
          <Link color href='https://michaelschultz.com'>
            Michael Schultz
          </Link>
        </Text>
      </Row>
      <FeedbackModal
        visible={feedbackModal}
        setVisible={setFeedbackModalVisible}
        bindings={feedbackModalBindings}
      />
    </Page.Footer>
  )
}
