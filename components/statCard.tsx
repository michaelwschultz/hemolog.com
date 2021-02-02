import React from 'react'
import { Card, Text, Loading } from '@geist-ui/react'
import { CardTypes } from '@geist-ui/react/dist/utils/prop-types'

interface Props {
  value: string | number
  label: string | React.Component
  loading?: boolean
  type?: CardTypes
  shadow?: boolean
  style?: React.CSSProperties
}

export default function StatCard(props: Props): JSX.Element {
  const {
    value,
    label,
    loading = false,
    type = 'default',
    shadow = true,
    style,
  } = props

  return (
    <Card
      shadow={!loading && shadow}
      style={{ minHeight: '116px', ...style }}
      type={type}
    >
      <Text h4 className='ellipsis'>
        {value}
      </Text>
      <Text small className='ellipsis'>
        {label}
      </Text>
      {loading && <Loading type='secondary' />}
    </Card>
  )
}
