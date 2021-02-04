import React from 'react'
import { Grid, Button, useMediaQuery } from '@geist-ui/react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { useAuth } from 'lib/auth'
import { UserType } from 'lib/types/users'
import Logo from 'components/logo'

const StaticHeader = (): JSX.Element => {
  const {
    user,
    loading,
  }: {
    user: UserType
    loading: boolean
  } = useAuth()

  const router = useRouter()
  const smallerThanSmall = useMediaQuery('sm', { match: 'down' })

  return (
    <StyledPageHeader>
      <Grid.Container>
        <Grid xs={12}>
          <Logo />
        </Grid>
        <Grid xs={12}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size={smallerThanSmall ? 'mini' : 'medium'}
              type='success'
              onClick={() => router.push(user ? '/home' : '/signin')}
              loading={loading}
            >
              {user ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </Grid>
      </Grid.Container>
    </StyledPageHeader>
  )
}

export default StaticHeader

const StyledPageHeader = styled.header`
  padding: 24px;
`
