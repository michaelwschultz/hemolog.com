import React from 'react'
import TreatmentTable from '@/components/home/treatmentTable'
import { useAuth } from '@/lib/auth'
import type { Person } from '@/lib/types/person'

interface Props {
  person: Person
}

export default function EmergencyInfo(props: Props): React.ReactElement {
  const { person } = props
  const { user } = useAuth()
  const [smallerThanSmall, setSmallerThanSmall] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setSmallerThanSmall(window.innerWidth < 640) // Tailwind's sm breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (person) {
    return (
      <>
        <div className='flex items-center flex-shrink-0'>
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt={person.name || 'User'}
              className='w-12 h-12 rounded-full'
            />
          ) : (
            <div className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-700'>
              {person.name?.charAt(0) || '?'}
            </div>
          )}

          <div className='flex flex-col pl-4'>
            <h3 className='text-xl font-semibold m-0'>{person.name}</h3>
            <h5 className='text-sm text-gray-600 m-0'>
              {person.severity} Hemophilia {person.hemophiliaType}, treat with
              factor {person.factor}
            </h5>
          </div>
        </div>

        <div className='h-8' />
        <div className='flex justify-between items-center'>
          <h5 className='text-lg font-semibold'>Most recent treatments</h5>
          <span className='text-sm text-gray-600' suppressHydrationWarning>
            {smallerThanSmall && 'Swipe →'}
          </span>
        </div>
        {person.uid ? (
          <TreatmentTable limit={3} uid={person.uid} filterYear='All time' />
        ) : (
          <div className='note note-urgent'>
            <div className='note-title'>Missing user id</div>
            <p className='text-sm text-slate'>
              Treatment data cannot be loaded.
            </p>
          </div>
        )}
        <div className='h-4' />
        <div className='note'>
          <div className='note-title'>Three most recent logs</div>
          <p className='text-sm leading-relaxed text-slate'>
            Check the date on each log. Only the latest three are shown. More
            history requires permission from {person.name?.split(' ')[0]}.
          </p>
        </div>

        <div className='h-12' />

        {user && (
          <>
            <h5 className='text-lg font-semibold'>
              Emergency contacts (coming soon)
            </h5>
            <p className='text-gray-600 mt-1'>
              Soon you'll be able to add these from your settings page.
            </p>
          </>
        )}
        <div className='h-4' />
        {/* NOTE(michael) remember when you implement this that you remember
        to update the example logic on /emergency/alertId as to not
        leak my actual emergency contact's info */}

        {/* <Grid.Container gap={2}>
          <Grid sm={12}>
            <Card>
              <Row justify='space-between' align='middle'>
                <Text h4>Jenifer Schultz</Text>
                <Button
                  size='small'
                  type='secondary-light'
                  onClick={() => (location.href = 'tel:555-555-5555')}
                >
                  Call
                </Button>
              </Row>
              <Text h6>555-555-5555</Text>
            </Card>
          </Grid>
          <Grid sm={12}>
            <Card>
              <Row justify='space-between' align='middle'>
                <Text h4>Mike Schultz</Text>
                <Button
                  size='small'
                  type='secondary-light'
                  onClick={() => (location.href = 'tel:555-555-5555')}
                >
                  Call
                </Button>
              </Row>
              <Text h6>555-555-5555</Text>
            </Card>
          </Grid>
        </Grid.Container> */}
      </>
    )
  }

  return (
    <div className='note'>
      <div className='note-title'>Not found</div>
      <p className='text-sm leading-relaxed text-slate'>
        This person's information could not be found.
      </p>
    </div>
  )
}
