import React from 'react'
import InfusionTable from 'components/firebaseInfusionTable'
import { Person } from 'lib/hooks/useEmergencyUser'
import { Avatar, Note, Row, Spacer, Text, Badge } from '@geist-ui/react'

interface Props {
  person: Person
}

export default function EmergencyInfo(props: Props): JSX.Element {
  const { person } = props

  if (person) {
    return (
      <>
        <Row justify='space-between' align='middle'>
          <Row>
            <Avatar
              src={person.photoUrl}
              text={person.name && person.name.charAt(0)}
              size='medium'
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
        <Spacer y={1} />
        <InfusionTable limit={3} />
        <Spacer y={1} />
        <Note label='Note'>
          Pay attention to the date on each of these logs. We're only showing
          you the <Text b>3</Text> most recent logs. If you want to see more,{' '}
          <Text i>{person.name.split(' ')[0]}</Text> will have to give you
          permission.
        </Note>
      </>
    )
  }

  return (
    <Note type='error' label='Error'>
      This person's information could not be found.
    </Note>
  )
}
