import {
  Grid,
  Avatar,
  Note,
  Spacer,
  Text,
  useMediaQuery,
} from '@geist-ui/react'
import styled from 'styled-components'

import InfusionTable from 'components/infusionTable'
import { Person } from 'lib/types/person'
import { useAuth } from 'lib/auth'

interface Props {
  person: Person
}

export default function EmergencyInfo(props: Props): JSX.Element {
  const { person } = props
  const { user } = useAuth()
  const smallerThanSmall = useMediaQuery('xs', { match: 'down' })

  if (person) {
    return (
      <>
        <StyledRow>
          <span>
            <Avatar
              src={person.photoUrl}
              text={person.name && person.name.charAt(0)}
            />
          </span>

          <div>
            <Text h3>{person.name}</Text>
            <Text h5 type='secondary'>
              {person.severity} Hemophilia {person.hemophiliaType}, treat with
              factor {person.factor}
            </Text>
          </div>
        </StyledRow>

        <Spacer h={2} />
        <Grid.Container justify='space-between' alignItems='center'>
          <Text h5>Most recent infusions</Text>
          {smallerThanSmall && <Text>Swipe →</Text>}
        </Grid.Container>
        <InfusionTable limit={3} uid={person.uid} filterYear='All time' />
        <Spacer />
        <Note label='Note'>
          Pay attention to the date on each of these logs. We’re only showing
          you the <Text b>3</Text> most recent logs. If you want to see more,{' '}
          <Text i>{person.name?.split(' ')[0]}</Text> will have to give you
          permission.
        </Note>

        <Spacer h={3} />

        {user && (
          <>
            <Text h5>Emergency contacts (coming soon)</Text>
            <Text>
              Soon you’ll be able to add these from your settings page.
            </Text>
          </>
        )}
        <Spacer />
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
    <Note type='success' label='Error'>
      This person’s information could not be found.
    </Note>
  )
}

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  span {
    width: 5.625rem;
  }

  h3,
  h5 {
    margin: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    padding-left: 16px;
  }
`
