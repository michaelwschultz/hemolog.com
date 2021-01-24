// import FirebaseAuth from 'components/firebaseAuth'
import { useAuth } from 'lib/auth'
import {
  Page,
  Text,
  Fieldset,
  Row,
  Spacer,
  Grid,
  Card,
  Divider,
  Link,
  Button,
  Note,
  Tag,
} from '@geist-ui/react'
import Logo from 'components/logo'
import DescriptionCards from 'components/descriptionCards'

const Auth = () => {
  const auth = useAuth()

  return (
    <Page size='large'>
      <Page.Header style={{ paddingTop: '24px' }}>
        <Row align='middle' justify='space-between'>
          <Logo />
          <Link href='https://github.com/michaelwschultz/hemolog.com'>
            <Tag>v2.0.0</Tag>
          </Link>
        </Row>
      </Page.Header>
      <Page.Content>
        <Note type='secondary' label='Important'>
          Hemolog is currently in development. Data integrety is not guaranteed.
          Hemolog is{' '}
          <b>
            <i>not</i>
          </b>{' '}
          HIPAA compliant... yada yada yada.
        </Note>
        <Spacer y={2} />
        <Row justify='center'>
          <Fieldset style={{ width: '460px' }}>
            <Text h4>Register or sign in</Text>
            <Text p>
              Signing in will create an account if you don't have one yet. Don't
              worry, Hemolog will always be <i>free</i>.
            </Text>
            <Spacer />
            <Button
              onClick={() => auth.signinWithGoogle('/home')}
              loading={auth.loading}
              type='success'
            >
              Continue with Google
            </Button>
            <Spacer />
          </Fieldset>
        </Row>

        <Spacer />

        <Divider />
        <Spacer y={4} />
        <DescriptionCards />
        <Spacer y={2} />
      </Page.Content>
      <Page.Footer>
        <Row justify='center'>
          <Text>
            Built in Oakland California by{' '}
            <Link href='https://michaelschultz.com' color icon>
              Michael Schultz
            </Link>
          </Text>
          <Spacer />
        </Row>
      </Page.Footer>
    </Page>
  )
}

export default Auth
