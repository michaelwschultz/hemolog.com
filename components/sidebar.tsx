import React, { useContext, useReducer } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Identity from 'components/identity'
import NextLink from 'next/link'
import { useUser } from 'utils/auth/useUser'
import { Link, Row, Spacer, Text } from '@geist-ui/react'
import EmergencySnippet from 'components/emergencySnippet'
import useDbUser from 'lib/hooks/useDbUser'

export default function Sidebar(): JSX.Element {
  const { user, logout } = useUser()
  const { person } = useDbUser(user && user.uid)
  const themeContext = useContext(ThemeContext)

  return (
    <StyledSidebar>
      <Identity />
      <Spacer y={2} />
      <StyledNavigation>
        <div>
          <Row justify="center">
            <NextLink href="/v2/stats">
              <Link block style={{ color: themeContext.colors.text }}>
                Stats
              </Link>
            </NextLink>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <NextLink href="/v2/settings">
              <Link block style={{ color: themeContext.colors.text }}>
                Settings
              </Link>
            </NextLink>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <Link
              onClick={() => logout()}
              block
              style={{ color: themeContext.colors.text }}
            >
              Log out
            </Link>
          </Row>
        </div>
        <div>
          <Text p style={{ color: themeContext.colors.text }}>
            Emergency Card
          </Text>
          {person && <EmergencySnippet alertId={person.alertId} />}
        </div>
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
const StyledNavigation = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`
