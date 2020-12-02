import React from 'react'
import InfusionTable from 'components/infusionTable'
import { Person } from 'lib/hooks/useEmergencyUser'
import {
  Avatar,
  Note,
  Row,
  Spacer,
  Text,
  Badge,
  Button,
  Card,
  Grid,
} from '@geist-ui/react'

interface Props {
  person: Person
}

export default function EmergencyInfo(props: Props): JSX.Element {
  const { person } = props

  if (person) {
    return (
      <>
        <Row justify='space-between' align='middle'>
          <Row align='middle'>
            <Avatar
              src={person.photoUrl}
              text={person.name && person.name.charAt(0)}
              size='large'
              style={{ marginRight: '24px' }}
            />
            <Spacer x={0.5} />
            <div>
              <Text h5>{person.name}</Text>
              <Text h6 type='secondary'>
                Hemophilia A Severe, treat with factor VIII (8)
              </Text>
            </div>
          </Row>
          <Badge>Treat with Factor VIII</Badge>
        </Row>
        <Spacer y={3} />
        <Text h5>Most recent infusions</Text>
        <InfusionTable limit={3} uid={person.uid} />
        <Spacer />
        <Note label='Note'>
          Pay attention to the date on each of these logs. We're only showing
          you the <Text b>3</Text> most recent logs. If you want to see more,{' '}
          <Text i>{person.name.split(' ')[0]}</Text> will have to give you
          permission.
        </Note>

        <Spacer y={3} />

        <Text h5>Emergency contacts</Text>
        <Spacer />
        <Grid.Container gap={2}>
          <Grid sm={12}>
            <Card>
              <Row justify='space-between' align='middle'>
                {/* TODO: pull this from real data */}
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
        </Grid.Container>
      </>
    )
  }

  return (
    <Note type='error' label='Error'>
      This person's information could not be found.
    </Note>
  )
}
