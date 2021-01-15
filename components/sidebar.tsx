import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useHotkeys } from 'react-hotkeys-hook'
import NextLink from 'next/link'
import { Link, Row, Spacer, Text, Col, useMediaQuery } from '@geist-ui/react'

import { useAuth } from 'lib/auth'
import EmergencySnippet from 'components/emergencySnippet'
import Identity from 'components/identity'

export default function Sidebar({ children }): JSX.Element {
  const { user, signout } = useAuth()

  const themeContext = useContext(ThemeContext)
  const [showSidebar, setShowSidebar] = useState(true)
  const largerThanSm = useMediaQuery('md', { match: 'up' })
  const toggleSidebar = () => setShowSidebar((prevState) => !prevState)
  useHotkeys('ctrl+b', toggleSidebar)

  const sidebar = () => {
    return (
      <StyledSidebar>
        <Identity />
        <Spacer y={2} />
        <StyledNavigation>
          <div>
            <Row justify='center'>
              <NextLink href='/'>
                <Link block style={{ color: themeContext.colors.text }}>
                  Stats
                </Link>
              </NextLink>
            </Row>
            <Spacer y={1} />
            <Row justify='center'>
              <NextLink href='/profile'>
                <Link block style={{ color: themeContext.colors.text }}>
                  Profile
                </Link>
              </NextLink>
            </Row>
            {user && user.isAdmin && (
              <>
                <Spacer y={1} />
                <Row justify='center'>
                  <NextLink href='/feedback'>
                    <Link block style={{ color: themeContext.colors.text }}>
                      Feedback
                    </Link>
                  </NextLink>
                </Row>
              </>
            )}
            <Spacer y={1} />
            <Row justify='center'>
              <Link
                onClick={() => signout()}
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
            <EmergencySnippet alertId={user.alertId} />
          </div>
        </StyledNavigation>
      </StyledSidebar>
    )
  }

  if (showSidebar && !largerThanSm) {
    return (
      <>
        {sidebar()}
        <Row>{children}</Row>
      </>
    )
  }

  if (showSidebar && largerThanSm) {
    return (
      <Row>
        {<Col span={5}>{sidebar()}</Col>}
        {children}
      </Row>
    )
  }

  return children
}

const StyledSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 24px;
  height: 100%;
`
const StyledNavigation = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`
