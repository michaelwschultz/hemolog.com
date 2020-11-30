import { useRouter } from 'next/router'
import NextLink from 'next/link'

import useEmergencyUser from 'lib/hooks/useEmergencyUser'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { Loading, Page, Note, Text, Row, Link } from '@geist-ui/react'
import EmergencyInfo from 'components/emergencyInfo'

export default function EmergencyCard(): JSX.Element {
  const router = useRouter()
  const { alertId } = router.query
  const { person, status, error } = useEmergencyUser(alertId)

  return (
    <Page>
      <Page.Header style={{ paddingTop: '24px' }}>
        <Row justify='space-between' align='middle'>
          <Text h4 type='error'>
            Emergency Card
          </Text>
          <Text h6>
            Provided by{' '}
            <NextLink href='/v2'>
              <Link>Hemolog.com</Link>
            </NextLink>
          </Text>
        </Row>
        <Text h6 type='secondary'>
          This page shows the most recent medical logs for someone with
          hemophilia. This data is <i>self reported</i> and used at the persons
          discression.
        </Text>
      </Page.Header>
      <Page.Content>
        {status === FirestoreStatusType.LOADING && (
          <Loading>Loading emergency info</Loading>
        )}

        {error && (
          <Note type='error' label='Error'>
            Something went wrong. This could mean that this person no longer has
            a Hemolog account or the app is broken. Please call 911 if this is
            an emergency.
          </Note>
        )}

        {!person && status !== FirestoreStatusType.LOADING && (
          <Note type='secondary' label='Try again'>
            Nothing could be found at this address. Please make sure the URL
            matches the link provided on the Hemolog Emergency Card.
          </Note>
        )}

        {person && <EmergencyInfo person={person} />}
      </Page.Content>
    </Page>
  )
}
