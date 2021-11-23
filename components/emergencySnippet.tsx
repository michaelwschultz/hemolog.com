import { Grid, Snippet } from '@geist-ui/react'

interface Props {
  alertId: string
  style?: React.CSSProperties
}

export default function EmergencySnippet(props: Props): JSX.Element {
  const { alertId = 'example', style } = props
  const env = process.env.NODE_ENV
  const domain = env === 'development' ? 'localhost:3000' : 'hemolog.com'

  return (
    <Grid.Container>
      <Snippet
        symbol=''
        text={`${domain}/emergency/${alertId}`}
        style={style}
      />
    </Grid.Container>
  )
}
