import React from 'react'
import { Row, Button } from '@geist-ui/react'
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

  return (
    <StyledPageHeader>
      <Row justify='space-between' align='middle'>
        <Logo />
        <Button
          type='success'
          onClick={() => router.push(user ? '/home' : '/signin')}
          loading={loading}
        >
          {user ? 'Sign in' : 'Register'}
        </Button>
      </Row>
    </StyledPageHeader>
  )
}

export default StaticHeader

const StyledPageHeader = styled.header`
  padding: 24px;
`
