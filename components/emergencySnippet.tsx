import React from 'react'
import { Row, Snippet } from '@geist-ui/react'

interface Props {
  alertId: string
}

export default function EmergencySnippet(props: Props): JSX.Element {
  const { alertId = 'test123' } = props
  const env = process.env.NODE_ENV
  const domain = env === 'development' ? 'localhost:3000' : 'hemolog.com'

  return (
    <Row>
      <Snippet
        width='300px'
        symbol=''
        text={`${domain}/emergency/${alertId}`}
      />
    </Row>
  )
}
