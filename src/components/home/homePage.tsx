'use client'

import { IconFilter } from '@tabler/icons-react'
import { getYear } from 'date-fns'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import InfusionTable from '@/components/home/infusionTable'
import Stats from '@/components/home/stats'
import { useInfusionsQuery } from '@/lib/hooks/useInfusionsQuery'

// Lazy load Chart component (includes recharts) - only loads when needed
const Chart = dynamic(() => import('@/components/home/chart'), {
  ssr: false,
})

const HomePage = (): JSX.Element => {
  const [smallerThanSmall, setSmallerThanSmall] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setSmallerThanSmall(window.innerWidth < 640) // Tailwind's sm breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data } = useInfusionsQuery()

  const infusionYears = data
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

      <div className='flex justify-between items-center pb-4'>
        <h4 className='text-xl font-semibold m-0'>Insights</h4>
        <div className='flex items-center gap-2'>
          <IconFilter size={16} className='text-gray-500' />
          <select
            className='px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50'
            disabled={infusionYears.length < 1}
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value={ALL_TIME}>{ALL_TIME}</option>
            {!infusionYears.includes(Number.parseInt(THIS_YEAR, 10)) && (
              <option value={THIS_YEAR} key={THIS_YEAR}>
                {THIS_YEAR}
              </option>
            )}
            {infusionYears.map((year) => (
              <option value={year.toString()} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Stats filterYear={filterYear} />
      <div className='h-12' />

      <h4 className='text-xl font-semibold'>Annual overview ({filterYear})</h4>
      <p className='text-sm text-gray-600 mt-1'>
        Treatments are stacked by type (bleed, preventative, or prophy)
      </p>
      <Chart filterYear={filterYear} />

      <div className='h-12' />
      <div className='flex justify-between items-center'>
        <h4 className='text-xl font-semibold'>Treatments</h4>
        <span className='text-sm text-gray-600' suppressHydrationWarning>
          {smallerThanSmall && 'Swipe →'}
        </span>
      </div>
      <InfusionTable filterYear={filterYear} />
    </>
  )
}

export default HomePage
