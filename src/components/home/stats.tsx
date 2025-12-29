import _ from 'underscore'
import { useState } from 'react'

import StatCard from '@/components/home/statCard'
import { useInfusionsQuery } from '@/lib/hooks/useInfusionsQuery'
import { TreatmentTypeEnum } from '@/lib/db/infusions'
import FeedbackModal from '@/components/home/feedbackModal'
import { filterInfusions } from '@/lib/helpers'

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
  const { data, isLoading, isError, error } = useInfusionsQuery()

  const filteredInfusions = filterInfusions(data, filterYear)

  // TODO(michael): Remove the feedback modal from this component at some point
  // since we already use it in the footer, maybe figure out a way to share
  // the modal across multiple components my lifting it up into context.
  const [feedbackModal, setFeedbackModal] = useState(false)

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <StatCard value='' label='' loading />
        <StatCard value='' label='' loading />
        <StatCard value='' label='' loading />
        <StatCard value='' label='' loading />
        <StatCard value='' label='' loading />
        <StatCard value='' label='' loading />
        <StatCard value='' label='' loading />
        <StatCard value='' label='' loading />
      </div>
    )
  }

  if (isError || error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <div className='text-red-800 font-semibold mb-1'>Error</div>
        <div className='text-red-700'>
          Oops, the database didn't respond. Refresh the page to try again.
        </div>
      </div>
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

    for (const entry of filteredInfusions) {
      const isProphy = entry.type === TreatmentTypeEnum.PROPHY

      if (isProphy) {
        currentStreak++
      } else {
        currentStreak = 0
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
    }

    return longestStreak
  }

  const getTotalUnits = () => {
    let units = 0
    for (const entry of filteredInfusions) {
      units += entry.medication.units
    }

    return units
  }

  const totalUnits = getTotalUnits()
  const estimatedTotalCost = totalUnits * COST_OF_FACTOR

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <StatCard value={numberOfInfusions} label='Treatments' />
        <StatCard value={numberOfBleeds} label='Bleeds' />
        <StatCard
          value={consecutiveProphyInfusions()}
          label='Consecutive prophy treatments'
        />
        <StatCard
          value={mostAffectedArea || 'Not enough data'}
          label='Most affected area'
        />
        <StatCard
          value={biggestCause || 'Not enough data'}
          label='Biggest cause'
        />
        <StatCard
          value={`~${totalUnits.toLocaleString()} iu`}
          label='Units of factor'
        />
        {/* I think this is between $1.19 and $1.66 per unit based on this article
            https://www.ashclinicalnews.org/spotlight/feature-articles/high-price-hemophilia/ */}
        <div className='group relative'>
          <StatCard
            value={`$${estimatedTotalCost.toLocaleString()}`}
            label='Estimated cost this year'
          />
          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
            Current
          </div>
        </div>
        <div className='bg-white rounded-lg border shadow-md p-4 min-h-[116px] flex flex-col justify-between'>
          <div className='text-sm text-gray-600'>Missing something?</div>
          <div className='mt-4'>
            <button
              type='button'
              onClick={() => setFeedbackModal(true)}
              className='bg-transparent border-none cursor-pointer p-0 m-0 text-red-500 font-bold'
            >
              Give feedback
            </button>
          </div>
        </div>
        {/* <div className="col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-1">
            TODO(michael) could setup a separate collection for this data as well as a
            separate api call
          <StatCard value='tk' label='Pharmacy Orders' />
        </div> */}
      </div>
      <FeedbackModal
        visible={feedbackModal}
        setVisible={setFeedbackModal}
        bindings={{}}
      />
    </>
  )
}
