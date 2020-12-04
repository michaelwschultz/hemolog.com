import React from 'react'
import _ from 'underscore'
import { Grid, Note } from '@geist-ui/react'
import StatCard from 'components/statCard'
import useInfusions from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { InfusionTypeEnum } from 'lib/db/infusions'

// TODO(michael) move types to types file
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

// TODO(michael) create array of factor brands with associated prices
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

  // TODO(michael) there has to be a better way to understand this data without
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
    .compact()
    .countBy()
    .pairs()
    .max(_.last)
    .head()
    .value()

  const biggestCause = _.chain(causes)
    .compact()
    .countBy()
    .pairs()
    .max(_.last)
    .head()
    .value()

  const consecutiveProphyInfusions = (): number => {
    let longestStreak = 0
    let currentStreak = 0

    data.forEach((entry) => {
      const isProphy = entry.type === InfusionTypeEnum.PROPHY

      if (isProphy) {
        currentStreak++
      } else {
        currentStreak = 0
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
    })

    return longestStreak
  }

  const getTotalUnits = () => {
    let units = 0
    data.forEach((entry) => (units = entry.medication.units + units))

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
        <StatCard
          value={consecutiveProphyInfusions()}
          label='Consecutive prophy infusions'
        />
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
          value={`~${totalUnits.toLocaleString()} iu`}
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
        <StatCard
          value='Missing something?'
          label='Hit the feedback button below'
          type='success'
          shadow={false}
        />
      </Grid>
      {/* <Grid xs={24} sm={12} md={6}>
          TODO(michael) could setup a separate collection for this data as well as a 
          separate api call
        <StatCard value='tk' label='Pharmacy Orders' />
      </Grid> */}
    </Grid.Container>
  )
}
