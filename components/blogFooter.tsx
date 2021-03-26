import React from 'react'
import { Text, Image, Spacer, Grid, Button } from '@geist-ui/react'
import { useRouter } from 'next/router'

import { useAuth } from 'lib/auth'
import { UserType } from 'lib/types/users'

export default function BlogFooter(): JSX.Element {
  const {
    user,
    loading,
  }: {
    user: UserType
    loading: boolean
  } = useAuth()

  const router = useRouter()
  return (
    <Grid.Container gap={2} alignItems='center'>
      <Grid xs={24} sm={16}>
        <Text h3></Text>
        <Text h4>
          Designed and developed by Michael Schultz in Oakland, California.
        </Text>
        {user ? (
          <Text>Thanks for being part of the Hemolog community!</Text>
        ) : (
          <>
            <Text>Start using Hemolog for free.</Text>
            <Button
              size='small'
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
        <Image width={300} height={300} src='/images/michael-schultz.jpg' />
      </Grid>
    </Grid.Container>
  )
}
