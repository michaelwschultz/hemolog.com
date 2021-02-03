import useSWR from 'swr'
import Head from 'next/head'
import { format } from 'date-fns'
import {
  Avatar,
  Page,
  Row,
  Fieldset,
  Button,
  Spacer,
  useToasts,
} from '@geist-ui/react'

import fetcher from 'lib/fetcher'
import { useAuth } from 'lib/auth'
import { FeedbackType } from 'lib/db/feedback'
import LoadingScreen from 'components/loadingScreen'
import Header from 'components/header'
import Footer from 'components/footer'

const Feedback = () => {
  const { user } = useAuth()
  const { data, error } = useSWR<FeedbackType[]>(
    user ? ['/api/feedback', user.token] : null,
    fetcher
  )

  const [, setToast] = useToasts()

  if (error) {
    console.error(error)

    setToast({
      type: 'error',
      text: `Oops, something went wrong - ${error}`,
    })
  }

  if (user) {
    return (
      <>
        <Head>
          <title>Hemolog - feedback</title>
        </Head>
        <Page size='large'>
          <Header />
          <Page.Content>
            {!data && <LoadingScreen />}
            {data &&
              data.map((feedback, index) => (
                <Row
                  key={`feedback-card-${index}`}
                  style={{ paddingBottom: '16px' }}
                >
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
                          {format(new Date(feedback.createdAt), 'PPp')}
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
          <Footer />
        </Page>
      </>
    )
  }

  return null
}

export default Feedback
