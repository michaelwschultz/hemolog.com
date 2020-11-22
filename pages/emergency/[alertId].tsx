import { useRouter } from 'next/router'

import initFirebase from 'utils/auth/initFirebase'
import useEmergencyUser from 'lib/hooks/useEmergencyUser'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { Loading, Page, Note, Text } from '@geist-ui/react'
import EmergencyInfo from 'components/emergencyInfo'

export default function EmergencyCard(): JSX.Element {
  // TODO: initFirebase this to a Provider and remove this call
  initFirebase()

  const router = useRouter()
  const { alertId } = router.query
  const { person, status, error } = useEmergencyUser(alertId)

  return (
    <Page>
      <Page.Header style={{ paddingTop: '40px' }}>
        <Text h4>Hemolog Emergency Card</Text>
      </Page.Header>
      <Page.Content>
        {status === FirestoreStatusType.LOADING && (
          <Loading>Loading emergency info...</Loading>
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
