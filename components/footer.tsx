import React from 'react'
import NextLink from 'next/link'
import { Text, Grid, Spacer, useModal, Link, Divider } from '@geist-ui/react'
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
    return 'example'
  }

  return (
    <StyledFooter>
      <Divider />
      <Spacer y={2} />
      <Grid.Container gap={2}>
        <Grid xs={24} sm={14}>
          <Text h5>Hemolog 2</Text>
          {user && (
            <Text>
              <a onClick={() => setFeedbackModalVisible(true)}>Give feedback</a>
            </Text>
          )}
          <Text>
            <NextLink href='/about'>
              <Link color href='/about'>
                The story so far...
              </Link>
            </NextLink>
          </Text>
          <Spacer />
          <Text h5>Emergency Link</Text>
          <EmergencySnippet alertId={alertId()} />
        </Grid>
        <Grid xs={24} sm={10}>
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
          <Text>
            <Link color href='https://github.com/michaelwschultz/hemolog.com'>
              View source
            </Link>{' '}
            |{' '}
            <Link color href='https://github.com/sponsors/michaelwschultz'>
              Donate
            </Link>{' '}
            on Github
          </Text>
          <Text p>hemolog.com © {new Date().getFullYear()}</Text>
        </Grid>
      </Grid.Container>
      <FeedbackModal
        visible={feedbackModal}
        setVisible={setFeedbackModalVisible}
        bindings={feedbackModalBindings}
      />
    </StyledFooter>
  )
}

const StyledFooter = styled.div`
  padding: 40px 24px;
`
