import React from 'react'
import styled from 'styled-components'
import { useAuth } from 'lib/auth'
import { Text, Spacer, Avatar, useTheme, Row } from '@geist-ui/react'

export default function Identity(): JSX.Element {
  const { user } = useAuth()
  const theme = useTheme()

  return (
    <StyledAvatar>
      {!user ? (
        <Text h4>Loading user...</Text>
      ) : (
        <>
          <Row justify='center'>
            <Avatar
              src={user.photoUrl || ''}
              text={user.displayName && user.displayName.charAt(0)}
              size='large'
            />
          </Row>
          <Spacer y={2} />
          <Row>
            <Text h4 style={{ color: theme.palette.background }}>
              {user.displayName}
            </Text>
          </Row>
        </>
      )}
    </StyledAvatar>
  )
}

const StyledAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
