import styled from 'styled-components'
import { useAuth } from 'lib/auth'
import { Text, Spacer, Avatar, useTheme, Grid } from '@geist-ui/react'

export default function Identity(): JSX.Element {
  const { user } = useAuth()
  const theme = useTheme()

  return (
    <StyledAvatar>
      {!user ? (
        <Text h4>Loading user...</Text>
      ) : (
        <>
          <Grid.Container justify='center'>
            <Avatar
              src={user.photoUrl || ''}
              text={user.displayName?.charAt(0) || ''}
            />
          </Grid.Container>
          <Spacer h={2} />
          <Grid.Container>
            <Text h4 style={{ color: theme.palette.background }}>
              {user.displayName}
            </Text>
          </Grid.Container>
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
