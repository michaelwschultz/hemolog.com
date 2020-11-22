import React from 'react'
import InfusionTable from 'components/firebaseInfusionTable'
import { Person } from 'lib/hooks/useEmergencyUser'
import { Avatar, Note, Row, Spacer } from '@geist-ui/react'

interface Props {
  person: Person
}

export default function EmergencyInfo(props: Props): JSX.Element {
  const { person } = props

  if (person) {
    return (
      <>
        <Row align='middle'>
          <Avatar
            src={person.photoUrl}
            text={person.name && person.name.charAt(0)}
            size='medium'
          />
          <Spacer x={1} />
          <h3>{person.name}</h3>
        </Row>
        <Spacer y={1} />
        <InfusionTable limit={3} />
        <Spacer y={1} />
        <Note label='Note'>
          Pay attention to the date on each of these logs. We're only showing
          you the <b>3</b> most recent logs. If you want to see more,{' '}
          <i>{person.name.split(' ')[0]}</i> will have to give you permission.
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
