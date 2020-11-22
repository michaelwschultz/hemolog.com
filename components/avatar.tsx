import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { useUser } from 'utils/auth/useUser'
import { Text, Spacer, useTheme } from '@geist-ui/react'

export default function Avatar(): JSX.Element {
  const { user } = useUser()
  const theme = useTheme()

  return (
    <StyledAvatar>
      {!user ? (
        <Text h4>Loading user...</Text>
      ) : (
        <>
          <Image
            src={user.photoUrl}
            width={100}
            height={100}
            alt='avatar'
            className='avatar'
          />
          <Spacer y={1} />
          <Text h4 style={{ color: theme.palette.background }}>
            {user.displayName}
          </Text>
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
