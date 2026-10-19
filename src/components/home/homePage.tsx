'use client'

import { IconFilter } from '@tabler/icons-react'
import { getYear } from 'date-fns'
import dynamic from 'next/dynamic'
import type { ReactElement } from 'react'
import React, { useState } from 'react'
import Stats from '@/components/home/stats'
import TreatmentTable from '@/components/home/treatmentTable'
import { useTreatmentsQuery } from '@/lib/hooks/useTreatmentsQuery'

// Lazy load Chart component (includes recharts) - only loads when needed
const Chart = dynamic(() => import('@/components/home/chart'), {
  ssr: false,
})

const HomePage = (): ReactElement => {
  const [smallerThanSmall, setSmallerThanSmall] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setSmallerThanSmall(window.innerWidth < 640) // Tailwind's sm breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data } = useTreatmentsQuery()

  const treatmentYears = data
    ? data
        .filter((d) => d?.date)
        .map((d) => getYear(new Date(d.date)))
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .sort((a, b) => b - a)
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
          <div className='h-12' />
        </>
      )} */}

      <div className='flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='m-0 font-sans text-xl font-medium tracking-tight text-ink'>
          Insights
        </h2>
        <div className='flex items-center gap-2'>
          <IconFilter size={16} className='text-slate' aria-hidden='true' />
          <select
            aria-label='Filter by year'
            className='field w-auto py-2 text-sm'
            disabled={treatmentYears.length < 1}
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value={ALL_TIME}>{ALL_TIME}</option>
            {!treatmentYears.includes(Number.parseInt(THIS_YEAR, 10)) && (
              <option value={THIS_YEAR} key={THIS_YEAR}>
                {THIS_YEAR}
              </option>
            )}
            {treatmentYears.map((year) => (
              <option value={year.toString()} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Stats filterYear={filterYear} />

      <div className='mt-14'>
        <h2 className='font-sans text-xl font-medium tracking-tight text-ink'>
          Annual overview ({filterYear})
        </h2>
        <p className='mt-1 text-sm text-slate'>
          Each bar stacks bleed, preventative, and prophy treatments.
        </p>
        <div className='mt-4'>
          <Chart filterYear={filterYear} />
        </div>
      </div>

      <div className='mt-14 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='font-sans text-xl font-medium tracking-tight text-ink'>
          Treatments
        </h2>
        <span className='text-sm text-slate' suppressHydrationWarning>
          {smallerThanSmall && 'Swipe →'}
        </span>
      </div>
      <div className='mt-4'>
        <TreatmentTable filterYear={filterYear} />
      </div>
    </>
  )
}

export default HomePage
