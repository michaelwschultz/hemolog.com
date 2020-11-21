import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from 'utils/auth/useUser'

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
              alt='avatar'
              className='avatar'
            />
            <h3>{user.displayName}</h3>
          </>
        )}
      </StyledAvatar>

      <StyledNavigation>
        <li>
          <Link href='/v2/stats'>Stats</Link>
        </li>
        <li>
          <Link href='/v2/settings'>Settings</Link>
        </li>
        <li>
          <a onClick={() => logout()}>Log out</a>
        </li>
      </StyledNavigation>
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

const StyledNavigation = styled.ul`
  list-style: none;
  padding-inline-start: 0;

  li {
    padding: 24px;
    font-size: 21px;
    color: ${({ theme }) => theme.colors.text};
  }
`
