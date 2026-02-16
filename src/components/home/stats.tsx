import { useMemo, useState } from 'react'
import _ from 'underscore'
import FeedbackModal from '@/components/home/feedbackModal'
import StatCard from '@/components/home/statCard'
import { TreatmentTypeEnum } from '@/lib/db/treatments'
import { filterTreatments } from '@/lib/helpers'
import { useTreatmentsQuery } from '@/lib/hooks/useTreatmentsQuery'

// Icons as simple SVG components
const TreatmentIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
)

const BleedIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    />
  </svg>
)

const ProphyIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    />
  </svg>
)

const BodyIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    />
  </svg>
)

const CauseIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13 10V3L4 14h7v7l9-11h-7z'
    />
  </svg>
)

const UnitsIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
    />
  </svg>
)

const CostIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
)

const FeedbackIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    />
  </svg>
)

// TODO(michael) move types to types file
type Value = string[]

interface ValueRanges {
  range: string
  majorDimension: string
  values: Value[]
}

export interface TreatmentSheet {
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

export default function Stats(props: StatsProps) {
  const { filterYear } = props
  const { data, isLoading, isError, error } = useTreatmentsQuery()

  const filteredTreatments = useMemo(
    () => filterTreatments(data, filterYear),
    [data, filterYear]
  )

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

  const numberOfTreatments = filteredTreatments.length
  const affectedAreas = filteredTreatments.map((entry) => entry.sites)
  const causes = filteredTreatments.map((entry) => entry.cause)
  const numberOfBleeds = filteredTreatments.filter(
    (entry) => entry.type === TreatmentTypeEnum.BLEED
  ).length
  let mostAffectedArea: unknown
  let biggestCause: unknown
  try {
    mostAffectedArea = _.chain(affectedAreas)
      .compact()
      .countBy()
      .pairs()
      .max(_.last)
      .head()
      .value()
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Unknown error calculating most affected area')
  }

  try {
    biggestCause = _.chain(causes)
      .compact()
      .countBy()
      .pairs()
      .max(_.last)
      .head()
      .value()
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Unknown error calculating biggest cause')
  }

  const consecutiveProphyTreatments = (): number => {
    let longestStreak = 0
    let currentStreak = 0

    for (const entry of filteredTreatments) {
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
    for (const entry of filteredTreatments) {
      units += entry.medication.units
    }

    return units
  }

  const totalUnits = getTotalUnits()
  const estimatedTotalCost = totalUnits * COST_OF_FACTOR

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <StatCard
          value={numberOfTreatments}
          label='Treatments'
          icon={<TreatmentIcon />}
          description='Total infusions this year'
        />
        <StatCard
          value={numberOfBleeds}
          label='Bleeds'
          type={numberOfBleeds > 10 ? 'warning' : 'default'}
          icon={<BleedIcon />}
          description='Unplanned bleeding events'
        />
        <StatCard
          value={consecutiveProphyTreatments()}
          label='Consecutive prophy'
          icon={<ProphyIcon />}
          description='Longest streak'
        />
        <StatCard
          value={(mostAffectedArea as string) || 'N/A'}
          label='Most affected area'
          icon={<BodyIcon />}
          description='Highest frequency location'
        />
        <StatCard
          value={(biggestCause as string) || 'N/A'}
          label='Biggest cause'
          icon={<CauseIcon />}
          description='Most common trigger'
        />
        <StatCard
          value={`~${totalUnits.toLocaleString()}`}
          label='Units of factor'
          icon={<UnitsIcon />}
          description='International units (iu)'
        />
        {/* I think this is between $1.19 and $1.66 per unit based on this article
            https://www.ashclinicalnews.org/spotlight/feature-articles/high-price-hemophilia/ */}
        <div className='group relative'>
          <StatCard
            value={`$${estimatedTotalCost.toLocaleString()}`}
            label='Estimated cost'
            icon={<CostIcon />}
            description='Based on $1.66/unit'
          />
          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
            Current market rate
          </div>
        </div>
        <StatCard
          value=''
          label='Missing something?'
          icon={<FeedbackIcon />}
          description=''
          shadow={false}
        >
          <button
            type='button'
            onClick={() => setFeedbackModal(true)}
            className='mt-3 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors'
          >
            Give feedback
          </button>
        </StatCard>
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
