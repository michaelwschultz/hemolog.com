import React from 'react'
import { Text, Spacer, Row, useMediaQuery } from '@geist-ui/react'

import InfusionTable from 'components/infusionTable'
import Stats from 'components/stats'

const HomePage = (): JSX.Element => {
  const smallerThanSmall = useMediaQuery('sm', { match: 'down' })

  return (
    <>
      <Text h4>Insights</Text>
      <Stats />
      {/* <Chart /> */}
      <Spacer y={3} />
      <Row justify='space-between' align='middle'>
        <Text h4>Infusions</Text>
        {smallerThanSmall && <Text>Swipe →</Text>}
      </Row>
      <InfusionTable />
      {/* TODO(michael) find out how this Spacer can be removed */}
      <Spacer y={5} />
    </>
  )
}

export default HomePage
