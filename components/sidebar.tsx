import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

export default function Sidebar(): JSX.Element {
  return (
    <StyledSidebar>
      <StyledAvatar>
        <Image
          src='/images/michael.jpeg'
          width={100}
          height={100}
          alt='avatar'
          className='avatar'
        />
        <h3>Michael Schultz</h3>
      </StyledAvatar>

      <StyledNavigation>
        <li>Home</li>
        <li>Stats</li>
        <li>Settings</li>
      </StyledNavigation>

      <StyledLogout>Log out</StyledLogout>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
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

  li {
    padding: 24px;
    font-size: 21px;
    color: ${({ theme }) => theme.colors.text};
  }
`

const StyledLogout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
