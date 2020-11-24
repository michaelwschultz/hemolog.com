import React from 'react'
import { Card, Text } from '@geist-ui/react'

interface Props {
  value: string
  label: string
}

export default function StatCard(props: Props): JSX.Element {
  const { value, label } = props

  return (
    <Card shadow>
      <Text h4 className='ellipsis'>
        {value}
      </Text>
      <Text p className='ellipsis'>
        {label}
      </Text>
    </Card>
  )
}
