import React from 'react'
import { useRouter } from 'next/router'
import InfusionTable from 'components/firebaseInfusionTable'
import initFirebase from 'utils/auth/initFirebase'
import useEmergencyUser from 'lib/hooks/useEmergencyUser'
import Avatar from 'components/avatar'
import styled from 'styled-components'

export default function EmergencyCard() {
  // TODO: initFirebase this to a Provider and remove this call
  initFirebase()

  const router = useRouter()
  const { alertId } = router.query

  // TODO: figure out how to pass the alertId to this hook correctly
  const { data: user, status, error } = useEmergencyUser(alertId)

  if (error || status === 'error') return <div>Nothing could be found</div>

  if (user) {
    console.log(user)
    return (
      <StyledPage>
        <h2>Emergency info for...</h2>
        <h4>{user.name}</h4>
        {/* TODO: give avatar the ability to load a user other than loggedInUser */}
        <Avatar />
        <InfusionTable />
      </StyledPage>
    )
  }

  return <div>Loading emergency info...</div>
}

const StyledPage = styled.div`
  padding: 40px;
`
