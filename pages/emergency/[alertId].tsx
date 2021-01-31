import { useRouter } from 'next/router'
import NextLink from 'next/link'

import useEmergencyUser from 'lib/hooks/useEmergencyUser'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { Loading, Page, Note, Text, Row, Link } from '@geist-ui/react'
import EmergencyInfo from 'components/emergencyInfo'

export default function Emergency(): JSX.Element {
  const router = useRouter()
  const { alertId } = router.query
  const { person, status, error } = useEmergencyUser(alertId)

  return (
    <Page size='large'>
      <Page.Header style={{ paddingTop: '24px' }}>
        <Row justify='space-between' align='middle'>
          <Text h4 type='error'>
            Emergency Card
          </Text>
          <Text h6>
            Provided by{' '}
            <NextLink href='/'>
              <Link>Hemolog.com</Link>
            </NextLink>
          </Text>
        </Row>
        <Note type='error' label='Important'>
          If someone has been in an accident, please call{' '}
          <a href='tel:911'>911</a> immediately. This page shows the most recent
          medical logs for someone with hemophilia. This data is{' '}
          <i>self reported</i> and may not be up-to-date.
        </Note>
      </Page.Header>
      <Page.Content>
        {status === FirestoreStatusType.LOADING && (
          <Loading>Loading emergency info</Loading>
        )}

        {error && (
          <Note type='error' label='Error'>
            Something went wrong. This could mean that this person no longer has
            a Hemolog account or the app is broken.
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
