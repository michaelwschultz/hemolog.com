import React, { useContext } from 'react'
import Link from 'next/link'
import { Row, Spacer } from '@geist-ui/react'
import styled, { ThemeContext } from 'styled-components'

import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'

export default function EmergencyCard(): JSX.Element {
  const { user } = useAuth()
  const { person } = useDbUser(user && user.uid)

  const themeContext = useContext(ThemeContext)

  if (!person) {
    return (
      <>
        <div>No user</div>
      </>
    )
  }

  return (
    <StyledEmergencyCard className='emergency-card'>
      <StyledHeader>
        <Row justify='space-between'>
          <div>
            <h5 style={{ color: themeContext.colors.text }}>
              Bleeding disorder
            </h5>
            <h2 style={{ color: themeContext.colors.text }}>Emergency</h2>
          </div>

          <StyledAvatar src={user.photoUrl} />
        </Row>
      </StyledHeader>
      <Spacer />
      <Row style={{ padding: '16px' }}>
        <StyledQRCode>
          <img
            src='/images/hemolog-emergency-example.png'
            width='140'
            height='140'
          />
          <StyledBloodDrop src='/images/blood-drop.png' />
        </StyledQRCode>
        <StyledPersonalInfo>
          <div>
            <h3>{person.name}</h3>
            <h5>
              {person.severity} Hemophilia {person.hemophiliaType}
            </h5>
            <h5>
              Treat with factor{' '}
              {person.factor ? (
                person.factor
              ) : (
                <Link href='/profile'>Update profile</Link>
              )}
            </h5>
          </div>
          <StyledScanLink>
            <h6>
              <b>Scan or visit link for treatment history & contacts</b>
            </h6>
            <h4 style={{ color: 'salmon' }}>
              hemolog.com/emergency/{person.alertId}
            </h4>
          </StyledScanLink>
        </StyledPersonalInfo>
      </Row>
    </StyledEmergencyCard>
  )
}

const StyledEmergencyCard = styled.div`
  position: relative;
  width: 525px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  h2,
  h3,
  h4,
  h5,
  h6 {
    padding: 0;
    margin: 0;
    line-height: 24px;
  }

  h5 {
    font-weight: 400;
  }
`

const StyledHeader = styled.div`
  background-color: salmon;
  height: 90px;
  width: 100%;
  padding: 24px;
`

const StyledPersonalInfo = styled.div`
  padding-left: 16px;
`

const StyledQRCode = styled.div`
  position: relative;
  img {
    border-radius: 8px;
    border: 4px solid salmon;
  }
`

const StyledScanLink = styled.div`
  padding-top: 16px;
`

const StyledBloodDrop = styled.img`
  position: absolute;
  left: 56px;
  top: -18px;
  width: 22px;
  height: 30px;
  border: none !important;
`

const StyledAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 8px solid white;
`
