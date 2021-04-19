import React from 'react'
import { Grid, Button } from '@geist-ui/react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { useAuth } from 'lib/auth'
import Logo from 'components/logo'

const StaticHeader = (): JSX.Element => {
  const { user, loading } = useAuth()

  const router = useRouter()

  return (
    <StyledPageHeader>
      <Grid.Container>
        <Grid xs={12}>
          <Logo />
        </Grid>
        <Grid
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            size='small'
            type='success-light'
            onClick={() => router.push(user ? '/home' : '/signin')}
            loading={loading}
            auto
          >
            {user ? 'Sign in' : 'Register'}
          </Button>
        </Grid>
      </Grid.Container>
    </StyledPageHeader>
  )
}

export default StaticHeader

const StyledPageHeader = styled.header`
  padding: 24px;
`
