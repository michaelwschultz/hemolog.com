import React, { useContext } from 'react'
import Link from 'next/link'
import { Row, Spacer, Loading } from '@geist-ui/react'
import styled, { ThemeContext } from 'styled-components'
import QRCode from 'react-qr-code'

import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'

interface Props {
  forPrint?: boolean
}

export default function EmergencyCard({ forPrint }: Props): JSX.Element {
  const { user } = useAuth()
  const { person } = useDbUser(user && user.uid)

  const alertUrl = `hemolog.com/emergency/${person && person.alertId}`

  const themeContext = useContext(ThemeContext)

  return (
    <StyledEmergencyCard className='emergency-card' forPrint={forPrint}>
      <StyledHeader forPrint={forPrint}>
        <Row justify='space-between'>
          <div>
            <h5 style={{ color: themeContext.colors.text }}>
              Bleeding disorder
            </h5>
            <h2 style={{ color: themeContext.colors.text }}>Emergency</h2>
          </div>

          <StyledAvatar src={user && user.photoUrl} forPrint={forPrint} />
        </Row>
      </StyledHeader>
      <Spacer y={forPrint ? 0.7 : 1} />
      <Row style={{ padding: forPrint ? '8px' : '16px' }}>
        <StyledQRCode forPrint={forPrint}>
          {person ? (
            <QRCode value={`https://${alertUrl}`} size={forPrint ? 80 : 124} />
          ) : (
            <Loading />
          )}
          <StyledBloodDrop src='/images/blood-drop.png' forPrint={forPrint} />
        </StyledQRCode>
        {person ? (
          <StyledPersonalInfo forPrint={forPrint}>
            <div>
              <h3>{person && person.name}</h3>
              <h5>
                {person && person.severity} Hemophilia{' '}
                {person && person.hemophiliaType}
              </h5>
              <h5>
                Treat with factor{' '}
                {person && person.factor ? (
                  person.factor
                ) : (
                  <Link href='/profile'>Update profile</Link>
                )}
              </h5>
            </div>
            <StyledScanLink forPrint={forPrint}>
              <h6>
                <b>Scan or visit link for treatment history & contacts</b>
              </h6>
              <h4 style={{ color: 'salmon' }}>{alertUrl}</h4>
            </StyledScanLink>
          </StyledPersonalInfo>
        ) : (
          <Loading />
        )}
      </Row>
    </StyledEmergencyCard>
  )
}

const StyledEmergencyCard = styled.div<{ forPrint: boolean }>`
  position: relative;
  width: ${(props) => (props.forPrint ? '308px' : '525px')};
  height: ${(props) => (props.forPrint ? '192px' : '300px')};
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
    line-height: ${(props) => (props.forPrint ? '15px' : '24px')};
    font-size: ${(props) => (props.forPrint ? '75%' : '100%')};
  }

  h5 {
    font-weight: 400;
  }
`

const StyledHeader = styled.div<{ forPrint: boolean }>`
  background-color: salmon;
  height: ${(props) => (props.forPrint ? '56px' : '90px')};
  width: 100%;
  padding: ${(props) => (props.forPrint ? '16px' : '24px')};
`

const StyledPersonalInfo = styled.div<{ forPrint: boolean }>`
  padding-left: ${(props) => (props.forPrint ? '8px' : '16px')};
`

const StyledQRCode = styled.div<{ forPrint: boolean }>`
  position: relative;
  width: ${(props) => (props.forPrint ? '102px' : '148px')};
  height: ${(props) => (props.forPrint ? '96px' : '148px')};
  padding: ${(props) => (props.forPrint ? '5px' : '8px')};
  border-radius: 8px;
  border: ${(props) => (props.forPrint ? '3px' : '4px')} solid salmon;
`

const StyledScanLink = styled.div<{ forPrint: boolean }>`
  padding-top: ${(props) => (props.forPrint ? '8px' : '16px')}; ;
`

const StyledBloodDrop = styled.img<{ forPrint: boolean }>`
  position: absolute;
  left: ${(props) => (props.forPrint ? '36px' : '64px')};
  top: ${(props) => (props.forPrint ? '-18px' : '-22px')};
  width: ${(props) => (props.forPrint ? '16px' : '22px')};
  height: ${(props) => (props.forPrint ? '22px' : '30px')};
  border: none !important;
`

const StyledAvatar = styled.img<{ forPrint: boolean }>`
  width: ${(props) => (props.forPrint ? '60px' : '100px')};
  height: ${(props) => (props.forPrint ? '60px' : '100px')};
  border-radius: 50%;
  border: ${(props) => (props.forPrint ? '4px' : '8px')} solid white;
`
