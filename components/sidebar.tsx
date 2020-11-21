import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import NextLink from 'next/link'
import { useUser } from 'utils/auth/useUser'
import { Link, Row, Spacer } from '@geist-ui/react'

export default function Sidebar(): JSX.Element {
  const { user, logout } = useUser()

  return (
    <StyledSidebar>
      <StyledAvatar>
        {!user ? (
          <h3>Loading user...</h3>
        ) : (
          <>
            <Image
              src={user.photoUrl}
              width={100}
              height={100}
              alt="avatar"
              className="avatar"
            />
            <h3>{user.displayName}</h3>
          </>
        )}
      </StyledAvatar>
      <Spacer y={2} />
      <Row justify="center">
        <NextLink href="/v2/stats">
          <Link block style={{ color: 'white' }}>
            Stats
          </Link>
        </NextLink>
      </Row>
      <Spacer y={1} />
      <Row justify="center">
        <NextLink href="/v2/settings">
          <Link block style={{ color: 'white' }}>
            Settings
          </Link>
        </NextLink>
      </Row>
      <Spacer y={1} />
      <Row justify="center">
        <Link onClick={() => logout()} block style={{ color: 'white' }}>
          Log out
        </Link>
      </Row>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.primary};
  min-width: 280px;
  padding: 24px;

  img {
    border-radius: 100px;
  }

  h3 {
    color: white;
  }
`

const StyledAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
