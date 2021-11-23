import useSWR from 'swr'
import { format } from 'date-fns'
import { Avatar, Grid, Fieldset, Button, Spacer } from '@geist-ui/react'
import styled from 'styled-components'

import fetcher from 'lib/fetcher'
import { useAuth } from 'lib/auth'
import { FeedbackType } from 'lib/db/feedback'
import LoadingScreen from 'components/loadingScreen'

const handleReplyClick = (email: string) => {
  window.location.assign(
    `mailto:${email}?subject=Thanks for your feedback on Hemolog!`
  )
}

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
        <Grid.Container
          key={`feedback-card-${index}`}
          style={{ paddingBottom: '16px' }}
        >
          <Fieldset style={{ width: '100%' }}>
            <Fieldset.Title>{feedback?.user?.name}</Fieldset.Title>
            <Fieldset.Subtitle>{feedback?.message}</Fieldset.Subtitle>
            <Fieldset.Footer>
              <StyledRow>
                <span>
                  <Avatar
                    src={feedback?.user?.photoUrl}
                    text={feedback?.user?.name.charAt(0)}
                  />
                </span>
                <Spacer w={0.5} />
                {format(new Date(feedback?.createdAt), 'PPp')}
              </StyledRow>
              <Button
                auto
                scale={0.25}
                onClick={() => handleReplyClick(feedback?.user?.email)}
              >
                Reply
              </Button>
            </Fieldset.Footer>
          </Fieldset>
        </Grid.Container>
      ))}
    </>
  )
}

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  p {
    margin: 0;
    padding: 0;
  }

  span {
    width: 1.875rem;
  }
`

export default FeedbackPage
