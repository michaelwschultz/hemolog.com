import React from 'react'
import { Text, Grid, Spacer, Link, Divider } from '@geist-ui/react'
import styled from 'styled-components'

import EmergencySnippet from 'components/emergencySnippet'
import { useAuth } from 'lib/auth'

export default function Footer(): JSX.Element {
  const { user, loading } = useAuth()

  const alertId = () => {
    if (loading) {
      return ''
    }
    if (user) {
      return user.alertId
    }
    return 'example'
  }

  return (
    <StyledFooter>
      <Divider />
      <Spacer y={2} />
      <Grid.Container gap={2}>
        <Grid xs={24} sm={14} direction='column'>
          <Text h5>Hemolog 2</Text>
          <Link color href='/about'>
            The story so far...
          </Link>
          <Link color href='/changelog'>
            Development blog
          </Link>
          <Spacer />
          <Text h5>Follow</Text>
          <Link color icon href='https://twitter.com/hemolog'>
            @Hemolog
          </Link>
          <Link color icon href='https://twitter.com/michaelschultz'>
            @MichaelSchultz
          </Link>
        </Grid>
        <Grid xs={24} sm={10} direction='column'>
          <Text h5>Get Involved</Text>
          <Link
            color
            icon
            href='https://github.com/michaelwschultz/hemolog.com'
          >
            View source
          </Link>
          <Link color icon href='https://github.com/sponsors/michaelwschultz'>
            Donate
          </Link>
          <Spacer />
          <Text h5>Emergency Link</Text>
          <EmergencySnippet alertId={alertId()} />
        </Grid>
      </Grid.Container>
    </StyledFooter>
  )
}

const StyledFooter = styled.div`
  padding: 40px 24px;
`
