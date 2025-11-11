import { useContext } from 'react'
import Link from 'next/link'
import {
  Grid,
  Spacer,
  Loading,
  useTheme,
  Tooltip,
  Text,
  useMediaQuery,
} from '@geist-ui/react'
import styled, { ThemeContext } from 'styled-components'
import QRCode from 'react-qr-code'

import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'

interface Props {
  forPrint?: boolean
}

export default function EmergencyCard({ forPrint }: Props): JSX.Element {
  const { user } = useAuth()
  const { person } = useDbUser(user?.uid || '')
  const theme = useTheme()
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix when moving to tailwind
  const themeContext = useContext(ThemeContext) as any
  const isMobile = useMediaQuery('xs', { match: 'down' })

  if (isMobile) {
    forPrint = true
  }

  const alertUrl = `hemolog.com/emergency/${person?.alertId}`

  return (
    <StyledEmergencyCard className='emergency-card' forPrint={forPrint}>
      <StyledHeader forPrint={forPrint} accentColor={theme.palette.success}>
        <Grid.Container justify='space-between'>
          <Grid>
            <h5 style={{ color: themeContext?.colors.text }}>
              Bleeding disorder
            </h5>
            <h2 style={{ color: themeContext?.colors.text }}>Emergency</h2>
          </Grid>

          {user?.photoUrl && (
            <Grid>
              <StyledAvatar src={user.photoUrl} forPrint={forPrint} />
            </Grid>
          )}
        </Grid.Container>
      </StyledHeader>
      <Spacer h={forPrint ? 0.7 : 1} />
      <Grid.Container style={{ padding: forPrint ? '8px' : '16px' }} gap={3}>
        <Grid xs={7}>
          <StyledQRCode forPrint={forPrint} accentColor={theme.palette.success}>
            {person ? (
              <QRCode
                value={`https://${alertUrl}`}
                size={forPrint ? 80 : 124}
              />
            ) : (
              <Loading />
            )}
            <StyledBloodDrop src='/images/blood-drop.png' forPrint={forPrint} />
          </StyledQRCode>
        </Grid>
        <Grid xs={17}>
          {person ? (
            <StyledPersonalInfo forPrint={forPrint}>
              <>
                <h3>{person?.name}</h3>
                <h5>
                  {person?.severity} Hemophilia {person?.hemophiliaType}
                </h5>
                {person?.factor && <h5>Treat with factor {person.factor}</h5>}
              </>
              <StyledScanLink forPrint={forPrint}>
                <Text h4>Scan or visit for treatment history</Text>
                <Tooltip text='Visit your page to preview what others will see.'>
                  <Link href={`https://${alertUrl}`}>
                    <a href={`https://${alertUrl}`}>
                      <h4 style={{ color: theme.palette.success }}>
                        {alertUrl}
                      </h4>
                    </a>
                  </Link>
                </Tooltip>
              </StyledScanLink>
            </StyledPersonalInfo>
          ) : (
            <Loading />
          )}
        </Grid>
      </Grid.Container>
    </StyledEmergencyCard>
  )
}

const StyledEmergencyCard = styled.div<{ forPrint?: boolean }>`
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

const StyledHeader = styled.div<{ forPrint?: boolean; accentColor: string }>`
  background-color: ${(props) => props.accentColor};
  height: ${(props) => (props.forPrint ? '56px' : '90px')};
  width: 100%;
  padding: ${(props) => (props.forPrint ? '16px' : '24px')};
`

const StyledPersonalInfo = styled.div<{ forPrint?: boolean }>`
  padding-left: ${(props) => (props.forPrint ? '8px' : '16px')};
`

const StyledQRCode = styled.div<{ forPrint?: boolean; accentColor: string }>`
  position: relative;
  width: ${(props) => (props.forPrint ? '96px' : '148px')};
  height: ${(props) => (props.forPrint ? '96px' : '148px')};
  padding: ${(props) => (props.forPrint ? '5px' : '8px')};
  border-radius: 8px;
  border: ${(props) => (props.forPrint ? '3px' : '4px')} solid
    ${(props) => props.accentColor};
`

const StyledScanLink = styled.div<{ forPrint?: boolean }>`
  padding-top: ${(props) => (props.forPrint ? '8px' : '16px')};
`

const StyledBloodDrop = styled.img<{ forPrint?: boolean }>`
  position: absolute;
  left: ${(props) => (props.forPrint ? '34px' : '56px')};
  top: ${(props) => (props.forPrint ? '-18px' : '-24px')};
  width: ${(props) => (props.forPrint ? '24px' : '32px')};
  height: ${(props) => (props.forPrint ? '24px' : '32px')};
  border: none !important;
`

const StyledAvatar = styled.img<{ forPrint?: boolean }>`
  width: ${(props) => (props.forPrint ? '60px' : '100px')};
  height: ${(props) => (props.forPrint ? '60px' : '100px')};
  border-radius: 50%;
  border: ${(props) => (props.forPrint ? '4px' : '8px')} solid white;
`
