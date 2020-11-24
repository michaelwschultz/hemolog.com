import FirebaseAuth from 'components/firebaseAuth'
import { Page, Text, Card, Row, Spacer } from '@geist-ui/react'

const Auth = () => {
  return (
    <Page size='large'>
      <Page.Header>
        <Spacer />
        <Text h4>Sign up or sign in</Text>
      </Page.Header>
      <Page.Content>
        <Row justify='center'>
          <Card width='330px'>
            <Text h4>Welcome to Hemolog</Text>
            <Text p>
              Whether you have an account or not, signing in with Google will
              get you where you want to go.
            </Text>
            <Card.Footer>
              <FirebaseAuth />
            </Card.Footer>
          </Card>
        </Row>
      </Page.Content>
      <Page.Footer>
        <Text p>Built in Oakland California by Michael Schultz</Text>
      </Page.Footer>
    </Page>
  )
}

export default Auth
