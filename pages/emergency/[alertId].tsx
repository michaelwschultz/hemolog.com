import { useRouter } from 'next/router'
import Head from 'next/head'
import NextLink from 'next/link'
import styled from 'styled-components'

import useEmergencyUser from 'lib/hooks/useEmergencyUser'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { Loading, Note, Text, Grid, Link } from '@geist-ui/react'
import EmergencyInfo from 'components/emergencyInfo'
import Footer from 'components/footer'

const Emergency = (): JSX.Element => {
  const router = useRouter()
  const { alertId } = router.query
  let isExample = false

  if (alertId === 'example') {
    isExample = true
  }

  const { person, status, error } = useEmergencyUser(
    isExample ? 'mike29' : alertId
  )

  return (
    <>
      <Head>
        <title>Emergency - from Hemolog</title>
      </Head>
      <StyledPage>
        <Grid.Container
          justify='space-between'
          alignItems='center'
          style={{ padding: '24px', paddingBottom: '0' }}
        >
          <Text h4 type='success'>
            Emergency Info
          </Text>
          <Text h6>
            <NextLink href='/'>
              <Link href='/'>Hemolog.com</Link>
            </NextLink>
          </Text>
        </Grid.Container>

        <Grid.Container
          justify='space-between'
          alignItems='center'
          style={{
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: '32px',
          }}
        >
          <Text h6 type='secondary'>
            This page shows the most recent medical logs for someone with
            hemophilia. <br />
            This data is <i>self reported</i> and may not be up-to-date.
          </Text>

          <Note type='success' label='Important' style={{ maxWidth: '360px' }}>
            If someone has been in an accident, please call{' '}
            <a href='tel:911'>911</a> immediately.
          </Note>
        </Grid.Container>

        <StyledPageContent>
          {status === FirestoreStatusType.LOADING && (
            <Loading>Loading emergency info</Loading>
          )}

          {error && (
            <Note type='success' label='Error'>
              Something went wrong. This could mean that this person no longer
              has a Hemolog account or the app is broken.
            </Note>
          )}

          {!person && status !== FirestoreStatusType.LOADING && (
            <Note type='secondary' label='Try again'>
              Nothing could be found at this address. Please make sure the URL
              matches the link provided on the Hemolog Emergency Card.
            </Note>
          )}

          {person && <EmergencyInfo person={person} />}
        </StyledPageContent>
        <Footer />
      </StyledPage>
    </>
  )
}

export default Emergency

const StyledPage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 850pt;
  width: 100%;
  margin: 0 auto;

  main {
    flex: 1 0 auto;
  }
  footer {
    flex-shrink: 0;
  }
`

const StyledPageContent = styled.main`
  padding: 0 24px;
`
