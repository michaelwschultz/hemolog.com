import React from 'react'
import useSWR from 'swr'
import _ from 'underscore'
import { Text, Grid } from '@geist-ui/react'
import StatCard from 'components/statCard'

import fetch from 'lib/fetch'

// TODO: move types to types file
type Value = string[]

interface ValueRanges {
  range: string
  majorDimension: string
  values: Value[]
}

export interface InfusionSheet {
  error?: Error
  spreadsheetId: string
  valueRanges: ValueRanges[]
}

const COST_OF_FACTOR_8 = 1.66
const NUMBER_OF_UNITS = 3000
const PHARMACY_ORDERS = 6

const estimatedTotalCost = PHARMACY_ORDERS * NUMBER_OF_UNITS * COST_OF_FACTOR_8
// TODO take this number from each infusion row

export default function Stats(): JSX.Element {
  // TODO: this data and catches doesn't need to be here.
  // Instead this call could be created in _app then passed
  // in React.Context.
  const { data, error } = useSWR<InfusionSheet>('/api/infusions', fetch)

  if (!data) {
    return <div>Loading infusion data...</div>
  }
  if (error) {
    return <div>API failed to return data</div>
  }
  if (data.error) {
    return <div>Oops, something went wrong accessing your infusion data.</div>
  }

  const values = data.valueRanges[0].values
  const entries = [...values]
  entries.shift() // remove columnHeaders from array

  const affectedAreas = entries.map((entry) => entry[2])
  const cause = entries.map((entry) => entry[3])

  const mostAffectedArea = _.chain(affectedAreas)
    .countBy()
    .pairs()
    .max(_.last)
    .head()
    .value()

  const biggestCause = _.chain(cause)
    .countBy()
    .pairs()
    .max(_.last)
    .head()
    .value()

  const numberOfInfusions = entries.length
  const unitsOfFactor = numberOfInfusions * NUMBER_OF_UNITS

  // TODO: build a widget component that fetches it's own data?
  // This might not be nessisary, but could be nice. Although
  // right now all the data is fetched with the single call to /api/infusions
  return (
    <>
      <Text h4>2020 Stats</Text>

      {/* Replace with Grid and Card geist-ui components */}
      <Grid.Container gap={2}>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value={numberOfInfusions.toString()} label='Infusions' />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='3' label='Bleeds' />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='0' label='Consecutive prophy infusions' />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value={mostAffectedArea} label='Most affected area' />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value={biggestCause} label='Biggest cause' />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard
            value={`~${unitsOfFactor.toLocaleString()} ui`}
            label='Units of factor'
          />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          {/* I think this is between $1.19 and $1.66 per unit based on this article
            https://www.ashclinicalnews.org/spotlight/feature-articles/high-price-hemophilia/ */}
          <StatCard
            value={`$${estimatedTotalCost.toLocaleString()}`}
            label='Estimated total cost'
          />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          {/* TODO: could setup a separate sheet for this data as well as a 
            separate api call */}
          <StatCard value='6' label='Pharmacy Orders' />
        </Grid>
      </Grid.Container>
    </>
  )
}
