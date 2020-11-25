import React from 'react'
import { Card, Text, Loading } from '@geist-ui/react'

interface Props {
  value: string | number
  label: string
  loading?: boolean
}

export default function StatCard(props: Props): JSX.Element {
  const { value, label, loading = false } = props

  return (
    <Card shadow={!loading} style={{ minHeight: '116px' }}>
      <Text h4 className='ellipsis'>
        {value}
      </Text>
      <Text p className='ellipsis'>
        {label}
      </Text>
      {loading && <Loading type='secondary' />}
    </Card>
  )
}
