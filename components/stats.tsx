import React from 'react'
import _ from 'underscore'
import { Grid, Note } from '@geist-ui/react'
import StatCard from 'components/statCard'
import useInfusions from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { InfusionTypeEnum } from 'lib/db/infusions'

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

// TODO: create array of factor brands with associated prices
// const PHARMACY_ORDERS = 6
const COST_OF_FACTOR = 1.66

export default function Stats(): JSX.Element {
  const { data, status, error } = useInfusions()

  if (status === FirestoreStatusType.LOADING) {
    return (
      <Grid.Container gap={2}>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard value='' label='' loading />
        </Grid>
      </Grid.Container>
    )
  }

  if (error) {
    return (
      <Note type='error' label='Error'>
        Oops, the database didn't respond. Refresh the page to try again.
      </Note>
    )
  }

  if (status === FirestoreStatusType.ERROR && !error) {
    return (
      <Note type='error' label='Error'>
        Something went wrong accessing your infusion data. Refresh the page to
        try again.
      </Note>
    )
  }

  // TODO: there has to be a better way to understand this data without
  // iterating through it so many times. Iterating through it once would be a lot better
  // but doing it on the server would be even better.

  // Another idea could be to make all these cards individual components as the logic
  // could get a lot more complicated for some of them.

  const numberOfInfusions = data.length
  const affectedAreas = data.map((entry) => entry.sites)
  const causes = data.map((entry) => entry.cause)
  const numberOfBleeds = data.filter(
    (entry) => entry.type === InfusionTypeEnum.BLEED
  ).length
  const mostAffectedArea = _.chain(affectedAreas)
    .countBy()
    .pairs()
    .max(_.first)
    .head()
    .value()

  const biggestCause = _.chain(causes)
    .countBy()
    .pairs()
    .max(_.first)
    .head()
    .value()

  const getTotalUnits = () => {
    let units = 0
    data.forEach(
      (entry) => (units = parseInt(entry.medication.units, 10) + units)
    )

    return units
  }
  const totalUnits = getTotalUnits()
  const estimatedTotalCost = totalUnits * COST_OF_FACTOR

  return (
    <Grid.Container gap={2}>
      <Grid xs={24} sm={12} md={6}>
        <StatCard value={numberOfInfusions} label='Infusions' />
      </Grid>
      <Grid xs={24} sm={12} md={6}>
        <StatCard value={numberOfBleeds} label='Bleeds' />
      </Grid>
      <Grid xs={24} sm={12} md={6}>
        <StatCard value='tk' label='Consecutive prophy infusions' />
      </Grid>
      <Grid xs={24} sm={12} md={6}>
        <StatCard
          value={mostAffectedArea || 'Not enough data'}
          label='Most affected area'
        />
      </Grid>
      <Grid xs={24} sm={12} md={6}>
        <StatCard
          value={biggestCause || 'Not enough data'}
          label='Biggest cause'
        />
      </Grid>
      <Grid xs={24} sm={12} md={6}>
        <StatCard
          value={`~${totalUnits.toLocaleString()} ui`}
          label='Units of factor'
        />
      </Grid>
      <Grid xs={24} sm={12} md={6}>
        {/* I think this is between $1.19 and $1.66 per unit based on this article
            https://www.ashclinicalnews.org/spotlight/feature-articles/high-price-hemophilia/ */}
        <StatCard
          value={`$${estimatedTotalCost.toLocaleString()}`}
          label='Estimated cost this year'
        />
      </Grid>
      <Grid xs={24} sm={12} md={6}>
        {/* TODO: could setup a separate sheet for this data as well as a 
            separate api call */}
        <StatCard value='tk' label='Pharmacy Orders' />
      </Grid>
    </Grid.Container>
  )
}
