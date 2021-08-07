import React, { useState } from 'react'
import { Text, Spacer, Row, Select, useMediaQuery } from '@geist-ui/react'
import Filter from '@geist-ui/react-icons/filter'
import styled from 'styled-components'
import { getYear } from 'date-fns'

import InfusionTable from 'components/infusionTable'
import Stats from 'components/stats'
import Chart from 'components/chart'
import useInfusions from 'lib/hooks/useInfusions'

const HomePage = (): JSX.Element => {
  const smallerThanSmall = useMediaQuery('xs', { match: 'down' })
  const { data } = useInfusions()

  const infusionYears = data
    ? data
        .map((d) => getYear(new Date(d.date)))
        .filter((item, index, arr) => arr.indexOf(item) === index)
    : []

  // TODO(michaelwschultz): enable once Firebase caching is removed
  // const { user } = useAuth()
  // const { person } = useDbUser(user?.uid || '')

  // const [showWelcome, setShowWelcome] = useState(false)

  // useEffect(() => {
  //   if (person) {
  //     if (
  //       person.factor &&
  //       person.hemophiliaType &&
  //       person.medication &&
  //       person.severity
  //     ) {
  //       return setShowWelcome(false)
  //     }
  //     return setShowWelcome(true)
  //   }
  // }, [person])

  // const welcomeHero = () => {
  //   return (
  //     <StyledHero>
  //       <Text h4>Getting started with Hemolog</Text>
  //       <Text h6 small>
  //         Fill in how you're affected to get the most accurate stats and a
  //         custom alert card. You can update these at anytime using the profile
  //         tab. If you're medication or type of hemophilia doesn't show up in the
  //         list, feel free to write it in.
  //       </Text>
  //       <Spacer />
  //       <Grid.Container gap={2}>
  //         <Grid xs={24} sm={12}>
  //           <SettingsForm />
  //         </Grid>
  //         <Grid xs={24} sm={12}>
  //           <StyledCenterCard>
  //             <EmergencyCard forPrint />
  //           </StyledCenterCard>
  //         </Grid>
  //       </Grid.Container>
  //     </StyledHero>
  //   )
  // }

  const ALL_TIME = 'All time'
  const THIS_YEAR = new Date().getFullYear().toString()
  const [filterYear, setFilterYear] = useState(THIS_YEAR)

  return (
    <>
      {/* TODO(michaelwschultz): enable once firebase caching is removed */}
      {/* {showWelcome && (
        <>
          {welcomeHero()}
          <Spacer y={3} />
        </>
      )} */}

      <Row
        justify='space-between'
        align='middle'
        style={{ padding: '0 0 16px 0' }}
      >
        <Text h4 style={{ marginBottom: '0' }}>
          Insights
        </Text>
        <Row align='middle'>
          <Filter size={16} />
          <Spacer x={0.5} />
          <Select
            placeholder='Choose one'
            initialValue={filterYear}
            onChange={(value) => setFilterYear(value as string)}
          >
            <Select.Option value={ALL_TIME}>{ALL_TIME}</Select.Option>
            {infusionYears.map((year) => (
              <Select.Option value={year.toString()} key={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </Row>
      </Row>
      <Stats filterYear={filterYear} />
      <Spacer y={3} />

      <Text h4>Annual overview ({filterYear})</Text>
      <Text h6 type='secondary'>
        Infusions are stacked by type (bleed, preventative, or prophy)
      </Text>
      <Chart filterYear={filterYear} />

      <Spacer y={3} />
      <Row justify='space-between' align='middle'>
        <Text h4>Infusions</Text>
        {smallerThanSmall && <Text>Swipe →</Text>}
      </Row>
      <InfusionTable filterYear={filterYear} />
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
