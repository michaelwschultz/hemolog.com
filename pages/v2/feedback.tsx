import { Page, Row, Fieldset, Button, Note } from '@geist-ui/react'
import { useUser } from 'lib/hooks/useUser'
import dayjs from 'dayjs'
import Logo from 'components/logo'

const Feedback = () => {
  const { user } = useUser()

  if (!user) {
    return null
  }

  const MOCK_FEEDBACK_DATA = [
    {
      user: {
        displayName: 'Michael Bishop',
        uid: 'testalkjsdlfjasd',
        email: 'michaelb@gmail.com',
      },
      feedback: {
        userId: 'testalkjsdlfjasd',
        text: `This is looking great man! I'd love to see some more options for brands
          as I wasn't able to find mine in your list or have a way to add it myself.
          Keep it up!`,
        timestamp: '2020-11-24T12:47:05.123Z',
      },
    },
    {
      user: {
        displayName: 'Shazia Hussain',
        uid: '5dfgsdfg',
        email: 'shaziah@gmail.com',
      },
      feedback: {
        userId: '5dfgsdfg',
        text: `Not as good as a fishing tournament app but I like it. haha`,
        timestamp: '2020-11-24T12:47:05.123Z',
      },
    },
    {
      user: {
        displayName: 'Jesse Schultz',
        uid: 'asdfkwejk',
        email: 'jesses@gmail.com',
      },
      feedback: {
        userId: 'asdfkwejk',
        text: `Not as good as a fishing tournament app but I like it. haha`,
        timestamp: '2020-11-24T12:47:05.123Z',
      },
    },
    {
      user: {
        displayName: 'Luke Schultz',
        uid: 'asdfa',
        email: 'luke10s@gmail.com',
      },
      feedback: {
        userId: 'asdfa',
        text: `Not as good as a fishing tournament app but I like it. haha`,
        timestamp: '2020-11-24T12:47:05.123Z',
      },
    },
  ]

  // TODO: change this to uid and use a env variable for storing it
  const michael = 'Michael Schultz'

  if (user.displayName === michael) {
    return (
      <Page size='large'>
        <Page.Header style={{ paddingTop: '24px' }}>
          <Logo />
        </Page.Header>
        <Page.Content>
          {/* TODO: sort the list of feedback by date/time */}
          {MOCK_FEEDBACK_DATA.map((entry) => (
            <Row key={entry.user.uid} style={{ paddingBottom: '16px' }}>
              <Fieldset style={{ width: '100%' }}>
                <Fieldset.Title>{entry.user.displayName}</Fieldset.Title>
                <Fieldset.Subtitle>{entry.feedback.text}</Fieldset.Subtitle>
                <Fieldset.Footer>
                  <Fieldset.Footer.Status>
                    {entry.user.email} on{' '}
                    {dayjs(entry.feedback.timestamp).format('MM/DD/YYYY')}
                  </Fieldset.Footer.Status>
                  <Fieldset.Footer.Actions>
                    <Button auto size='mini'>
                      Reply
                    </Button>
                  </Fieldset.Footer.Actions>
                </Fieldset.Footer>
              </Fieldset>
            </Row>
          ))}
        </Page.Content>
      </Page>
    )
  }

  return (
    <Page size='large'>
      <Page.Content>
        <Note>Nothing to see here</Note>
      </Page.Content>
    </Page>
  )
}

export default Feedback
