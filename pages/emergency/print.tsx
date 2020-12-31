import Head from 'next/head'
import { Page, Text, Row } from '@geist-ui/react'
import styled from 'styled-components'

import Logo from 'components/logo'
import EmergencyCard from 'components/emergencyCard'

export default function Print(): JSX.Element {
  // TODO(michael) Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

  return (
    <StyledForPrint>
      <Head>
        <title>Hemolog - Print</title>
      </Head>
      <Page size='large'>
        <Page.Header style={{ paddingTop: '24px' }}>
          <Row align='middle'>
            <Logo />
          </Row>
        </Page.Header>
        <Page.Content>
          <Text h4 className='hide-from-printer'>
            Print and cut your emergency card
          </Text>
          <Text className='hide-from-printer'>
            To print, go to <i>File {'>'} Print</i>, or hit <b>Control + P</b>{' '}
            (Command on Mac).
          </Text>
          <Text className='hide-from-printer'>
            Keep the card in your wallet or in your car.
          </Text>
          <StyledCutOut>
            <EmergencyCard forPrint />
          </StyledCutOut>
        </Page.Content>
        <Page.Footer style={{ paddingBottom: '16px' }}></Page.Footer>
      </Page>
    </StyledForPrint>
  )
}

const StyledForPrint = styled.div`
  @media print {
    header,
    .hide-from-printer {
      display: none !important;
    }
  }

  .emergency-card {
    box-shadow: none !important;
  }

  @media print {
    color-adjust: exact !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
`

const StyledCutOut = styled.div`
  display: inline-block;
  padding: 2px;
  border: 2px dashed rgba(0, 0, 0, 0.5);
  border-radius: 20px;
`
