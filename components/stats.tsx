import _ from 'underscore'
import { Grid, Note, Card, useModal, Tooltip, Text } from '@geist-ui/react'

import StatCard from 'components/statCard'
import useInfusions from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { TreatmentTypeEnum } from 'lib/db/infusions'
import FeedbackModal from 'components/feedbackModal'
import { filterInfusions } from 'lib/helpers'

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

interface StatsProps {
  filterYear: string
}

export default function Stats(props: StatsProps): JSX.Element {
  const { filterYear } = props
  const { data, status, error } = useInfusions()

  const filteredInfusions = filterInfusions(data, filterYear)

  // TODO(michael): Remove the feedback modal from this component at some point
  // since we already use it in the footer, maybe figure out a way to share
  // the modal across multiple components my lifting it up into context.
  const {
    visible: feedbackModal,
    setVisible: setFeedbackModalVisible,
    bindings: feedbackModalBindings,
  } = useModal(false)

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
        Oops, the database didn’t respond. Refresh the page to try again.
      </Note>
    )
  }

  if (status === FirestoreStatusType.ERROR && !error) {
    return (
      <Note type='error' label='Error'>
        Something went wrong accessing your treatment data. Refresh the page to
        try again.
      </Note>
    )
  }

  // TODO(michael) there has to be a better way to understand this data without
  // iterating through it so many times. Iterating through it once would be a lot better
  // but doing it on the server would be even better.

  // Another idea could be to make all these cards individual components as the logic
  // could get a lot more complicated for some of them.

  const numberOfInfusions = filteredInfusions.length
  const affectedAreas = filteredInfusions.map((entry) => entry.sites)
  const causes = filteredInfusions.map((entry) => entry.cause)
  const numberOfBleeds = filteredInfusions.filter(
    (entry) => entry.type === TreatmentTypeEnum.BLEED
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

    filteredInfusions.forEach((entry) => {
      const isProphy = entry.type === TreatmentTypeEnum.PROPHY

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
    filteredInfusions.forEach(
      (entry) => (units = entry.medication.units + units)
    )

    return units
  }

  const totalUnits = getTotalUnits()
  const estimatedTotalCost = totalUnits * COST_OF_FACTOR

  return (
    <>
      <Grid.Container gap={2}>
        <Grid xs={12} sm={12} md={6}>
          <StatCard value={numberOfInfusions} label='Treatments' />
        </Grid>
        <Grid xs={12} sm={12} md={6}>
          <StatCard value={numberOfBleeds} label='Bleeds' />
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <StatCard
            value={consecutiveProphyInfusions()}
            label='Consecutive prophy treatments'
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
          <Tooltip
            text={'Current'}
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <StatCard
              style={{ display: 'block' }}
              value={`$${estimatedTotalCost.toLocaleString()}`}
              label='Estimated cost this year'
            />
          </Tooltip>
        </Grid>
        <Grid xs={24} sm={12} md={6}>
          <Card width='100%' style={{ minHeight: '116px', height: '100%' }}>
            <Text small>Missing something?</Text>
            <Card.Footer>
              <Text>
                <a onClick={() => setFeedbackModalVisible(true)}>
                  Give feedback
                </a>
              </Text>
            </Card.Footer>
          </Card>
        </Grid>
        {/* <Grid xs={24} sm={12} md={6}>
            TODO(michael) could setup a separate collection for this data as well as a 
            separate api call
          <StatCard value='tk' label='Pharmacy Orders' />
        </Grid> */}
      </Grid.Container>
      <FeedbackModal
        visible={feedbackModal}
        setVisible={setFeedbackModalVisible}
        bindings={feedbackModalBindings}
      />
    </>
  )
}
