import useSWR from 'swr'
import { format } from 'date-fns'
import { Avatar, Row, Fieldset, Button, Spacer } from '@geist-ui/react'

import fetcher from 'lib/fetcher'
import { useAuth } from 'lib/auth'
import { FeedbackType } from 'lib/db/feedback'
import LoadingScreen from 'components/loadingScreen'

const FeedbackPage = () => {
  const { user } = useAuth()
  const { data, error } = useSWR<FeedbackType[]>(
    user && user.isAdmin ? ['/api/feedback', user.token] : null,
    fetcher
  )

  if (error) {
    console.error({ message: 'Feedback API failed' })

    return <div>No data found</div>
  }

  if (!data) {
    return <LoadingScreen />
  }

  return (
    <>
      {data.map((feedback, index) => (
        <Row key={`feedback-card-${index}`} style={{ paddingBottom: '16px' }}>
          <Fieldset style={{ width: '100%' }}>
            <Fieldset.Title>{feedback?.user?.name}</Fieldset.Title>
            <Fieldset.Subtitle>{feedback?.message}</Fieldset.Subtitle>
            <Fieldset.Footer>
              <Fieldset.Footer.Status>
                <Row align='middle'>
                  <Avatar
                    src={feedback?.user?.photoUrl}
                    text={feedback?.user?.name.charAt(0)}
                    size='small'
                  />
                  <Spacer x={0.5} />
                  {feedback?.user?.email} on{' '}
                  {format(new Date(feedback?.createdAt), 'PPp')}
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
    </>
  )
}

export default FeedbackPage
