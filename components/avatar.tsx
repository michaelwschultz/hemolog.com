import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { useUser } from 'utils/auth/useUser'

export default function Avatar(): JSX.Element {
  const { user } = useUser()

  // TODO: add ability to pass userId to load here in place of having a loggedInUser

  return (
    <StyledAvatar>
      {!user ? (
        <h3>Loading user...</h3>
      ) : (
        <>
          <Image
            src={user.photoUrl}
            width={100}
            height={100}
            alt='avatar'
            className='avatar'
          />
          <h3>{user.displayName}</h3>
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
