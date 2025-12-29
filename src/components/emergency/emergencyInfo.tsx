import React from 'react'
import InfusionTable from '@/components/home/infusionTable'
import type { Person } from '@/lib/types/person'
import { useAuth } from '@/lib/auth'

interface Props {
  person: Person
}

export default function EmergencyInfo(props: Props): JSX.Element {
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
          <InfusionTable limit={3} uid={person.uid} filterYear='All time' />
        ) : (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='font-semibold text-yellow-800 mb-1'>Warning</div>
            <div className='text-yellow-700'>
              User ID is missing. Treatment data cannot be loaded.
            </div>
          </div>
        )}
        <div className='h-4' />
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='font-semibold text-blue-800 mb-1'>Note</div>
          <div className='text-blue-700'>
            Pay attention to the date on each of these logs. We're only showing
            you the <span className='font-bold'>3</span> most recent logs. If
            you want to see more,{' '}
            <span className='italic'>{person.name?.split(' ')[0]}</span> will
            have to give you permission.
          </div>
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
    <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
      <div className='font-semibold text-green-800 mb-1'>Error</div>
      <div className='text-green-700'>
        This person's information could not be found.
      </div>
    </div>
  )
}
