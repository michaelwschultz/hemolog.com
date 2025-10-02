import { Text, Image, Spacer, Grid, Button } from '@geist-ui/react'
import { useRouter } from 'next/router'

import { useAuth } from 'lib/auth'

export default function BlogFooter(): JSX.Element {
  const { user, loading } = useAuth()

  const router = useRouter()
  return (
    <Grid.Container alignItems='center'>
      <Grid
        xs={24}
        sm={16}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Text h4>
          Designed and developed by Michael Schultz in Oakland, California.
        </Text>
        {user ? (
          <Text>Thanks for being part of the Hemolog community!</Text>
        ) : (
          <>
            <Text>Start using Hemolog for free.</Text>
            <Button
              type='success-light'
              onClick={() => router.push('/signin')}
              loading={loading}
              auto
            >
              Register
            </Button>
          </>
        )}
      </Grid>
      <Grid xs={24} sm={8}>
        <Spacer />
        <Image
          width={15}
          src='/images/michael-schultz.jpg'
          alt='Michael Schultz'
        />
      </Grid>
    </Grid.Container>
  )
}
