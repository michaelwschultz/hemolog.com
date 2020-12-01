import useSWR from 'swr'
import fetcher from 'lib/fetcher'
import dayjs from 'dayjs'
import {
  Avatar,
  Page,
  Row,
  Fieldset,
  Button,
  Note,
  Spacer,
  useToasts,
} from '@geist-ui/react'

import Logo from 'components/logo'
import { useAuth } from 'lib/auth'
import { useEffect } from 'react'

interface UserFeedback {
  id: string
  message: string
  user: {
    name: string
    email: string
    photoUrl?: string
    uid: string
  }
  createdAt: string
}

type Feedback = UserFeedback[]

const Feedback = () => {
  const { user } = useAuth()
  const { data, error } = useSWR<Feedback>(
    user ? ['/api/feedback', user.token] : null,
    fetcher
  )

  const [, setToast] = useToasts()

  if (error) {
    console.log(error)
    setToast({
      type: 'error',
      text: `Oops, something went wrong - ${error}`,
    })
  }

  useEffect(() => {
    console.log('this error', error)
  }, [error])

  if (data) {
    return (
      <Page size='large'>
        <Page.Header style={{ paddingTop: '24px' }}>
          <Logo />
        </Page.Header>
        <Page.Content>
          {data.map((feedback) => (
            <Row key={feedback.id} style={{ paddingBottom: '16px' }}>
              <Fieldset style={{ width: '100%' }}>
                <Fieldset.Title>{feedback.user.name}</Fieldset.Title>
                <Fieldset.Subtitle>{feedback.message}</Fieldset.Subtitle>
                <Fieldset.Footer>
                  <Fieldset.Footer.Status>
                    <Row align='middle'>
                      <Avatar
                        src={feedback.user.photoUrl}
                        text={feedback.user.name.charAt(0)}
                        size='small'
                      />
                      <Spacer x={0.5} />
                      {feedback.user.email} on{' '}
                      {dayjs(feedback.createdAt).format('MM/DD/YYYY')}
                    </Row>
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

  return null
}

export default Feedback
