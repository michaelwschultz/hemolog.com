import { type ReactElement, useState } from 'react'
import _ from 'underscore'
import FeedbackModal from '@/components/home/feedbackModal'
import StatCard from '@/components/home/statCard'
import { TreatmentTypeEnum } from '@/lib/db/treatments'
import { filterTreatments } from '@/lib/helpers'
import { useTreatmentsQuery } from '@/lib/hooks/useTreatmentsQuery'

const COST_OF_FACTOR = 1.66

interface StatsProps {
  filterYear: string
}

export default function Stats(props: StatsProps): ReactElement {
  const { filterYear } = props
  const { data, isLoading, isError, error } = useTreatmentsQuery()

  const filteredTreatments = filterTreatments(data, filterYear)
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
      <div className='note note-urgent'>
        <div className='note-title'>Couldn't load insights</div>
        <p className='text-sm text-slate'>
          The database didn't respond. Refresh the page to try again.
        </p>
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
        <StatCard value={numberOfTreatments} label='Treatments' />
        <StatCard value={numberOfBleeds} label='Bleeds' />
        <StatCard
          value={consecutiveProphyTreatments()}
          label='Consecutive prophy treatments'
        />
        <StatCard
          value={(mostAffectedArea as string) || 'Not enough data'}
          label='Most affected area'
        />
        <StatCard
          value={(biggestCause as string) || 'Not enough data'}
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
          <div className='pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-ink px-2 py-1 text-sm whitespace-nowrap text-paper opacity-0 transition-opacity group-hover:opacity-100'>
            About $1.66 per unit
          </div>
        </div>
        <div className='surface flex min-h-[116px] flex-col justify-between p-5'>
          <div className='text-sm text-slate'>Missing something?</div>
          <button
            type='button'
            onClick={() => setFeedbackModal(true)}
            className='w-fit cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-700'
          >
            Give feedback
          </button>
        </div>
      </div>
      <FeedbackModal visible={feedbackModal} setVisible={setFeedbackModal} />
    </>
  )
}
