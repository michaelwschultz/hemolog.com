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
        <Row justify='center'>
          <Fieldset style={{ width: '460px' }}>
            <Text h4>Sign in</Text>
            <Text p>
              Signing in will create an account if you don't have one yet. Don't
              worry, Hemolog will always be <i>free</i>.
            </Text>
            <Spacer />
            <Button
              onClick={() => auth.signinWithGoogle('/')}
              loading={auth.loading}
            >
              Continue with Google
            </Button>
            <Spacer />
          </Fieldset>
        </Row>
        <Spacer y={2} />
        <Note type='success' label='Important'>
          Hemolog is currently in development. Data integrety is not guaranteed.
          Hemolog is{' '}
          <b>
            <i>not</i>
          </b>{' '}
          HIPAA compliant... yada yada yada.
        </Note>

        <Spacer />

        <Divider />
        <Spacer y={4} />
        <Grid.Container gap={2}>
          <Grid xs={24} sm={12}>
            <Card shadow type='success'>
              <Text h4>Open source</Text>
              <Text>
                Hemolog is completely open source. We've got a limited number of
                years to worry about logging. Check out the code on{' '}
                <Link
                  href='https://github.com/michaelwschultz/hemolog.com'
                  underline
                  icon
                >
                  Github
                </Link>
                .
              </Text>
            </Card>
          </Grid>
          <Grid xs={24} sm={12}>
            <Card shadow>
              <Text h4>Free forever</Text>
              <Text>
                No need to worry about paying for Hemolog. It's free forever. No
                sponsorships, pharma companies, or ads.
              </Text>
            </Card>
          </Grid>
          <Grid xs={24} sm={12}>
            <Card shadow type='success'>
              <Text h4>Wait...didn't Hemolog die?</Text>
              <Text>
                Hemolog's first incarnation was an iPhone app back in 2011. It
                was a great start but didn't do <i>most</i> of what Hemolog 2
                can do!
              </Text>
            </Card>
          </Grid>
          <Grid xs={24} sm={12}>
            <Card shadow>
              <Text h4>Is this safe?</Text>
              <Text>
                <Link
                  href='https://github.com/michaelwschultz/hemolog.com'
                  color
                  icon
                >
                  See for yourself!
                </Link>
                {` `}
                Your data is stored in{' '}
                <Link href='https://firebase.google.com/' color icon>
                  Firebase
                </Link>
                , a trused Google product. You own your data, and it will never
                be sold.
              </Text>
            </Card>
          </Grid>
        </Grid.Container>
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
