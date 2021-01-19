import React from 'react'
import { Text, Page, Row, Button, Link } from '@geist-ui/react'
import { FeedbackFish } from '@feedback-fish/react'

export default function Footer(): JSX.Element {
  // NOTE(michael): testing out https://feedback.fish.
  const PROJECT_ID = process.env.FEEDBACK_FISH_PROJECT_ID

  return (
    <Page.Footer>
      <Row justify='space-between' align='middle'>
        <FeedbackFish projectId={PROJECT_ID}>
          <Button auto type='secondary-light'>
            Feedback
          </Button>
        </FeedbackFish>

        <Text p>
          Built by{' '}
          <Link color href='https://michaelschultz.com'>
            Michael Schultz
          </Link>
        </Text>
      </Row>
    </Page.Footer>
  )
}
