import React from 'react'
import { Text, Spacer, Row, useMediaQuery, Grid } from '@geist-ui/react'
import styled from 'styled-components'

import InfusionTable from 'components/infusionTable'
import Stats from 'components/stats'
import SettingsForm from 'components/settingsForm'
import EmergencyCard from 'components/emergencyCard'
import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'

const HomePage = (): JSX.Element => {
  const smallerThanSmall = useMediaQuery('xs', { match: 'down' })
  const { user } = useAuth()
  const { person } = useDbUser(user && user.uid)

  const hasAllInfo = () => {
    if (person) {
      if (
        person.factor &&
        person.hemophiliaType &&
        person.medication &&
        person.severity
      ) {
        return true
      }
      return false
    }
    return false
  }

  const returnWelcomeHero = () => {
    return (
      <StyledHero>
        <Text h4>Getting started with Hemolog</Text>
        <Text h6 small>
          Fill in how you're affected to get the most accurate stats and a
          custom alert card. You can update these at anytime using the profile
          tab. If you're medication or type of hemophilia doesn't show up in the
          list, feel free to write it in.
        </Text>
        <Spacer />
        <Grid.Container gap={2}>
          <Grid xs={24} sm={12}>
            <SettingsForm />
          </Grid>
          <Grid xs={24} sm={12}>
            <StyledCenterCard>
              <EmergencyCard forPrint />
            </StyledCenterCard>
          </Grid>
        </Grid.Container>
      </StyledHero>
    )
  }

  return (
    <>
      {!hasAllInfo && (
        <>
          {returnWelcomeHero()}
          <Spacer y={3} />
        </>
      )}

      <Text h4>Insights</Text>
      <Stats />
      <Spacer y={3} />
      <Row justify='space-between' align='middle'>
        <Text h4>Infusions</Text>
        {smallerThanSmall && <Text>Swipe →</Text>}
      </Row>
      <InfusionTable />
    </>
  )
}

const StyledHero = styled.div`
  position: relative;
  border: 4px solid transparent;
  padding: 24px;
  margin: 0 -32px;
  border-image: linear-gradient(
    0deg,
    rgba(255, 6, 44, 1) 0%,
    rgba(255, 57, 143, 1) 100%
  );
  border-image-slice: 1;
`

const StyledCenterCard = styled.div`
  position: relative;
  display: inline-block;
  left: 50%;
  margin-left: -154px;
`

export default HomePage
