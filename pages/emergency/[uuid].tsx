import React from 'react'
import { useRouter } from 'next/router'

export default function EmergencyCard() {
  const router = useRouter()
  const { uuid } = router.query

  // TODO: lookup uuid of user and display a summary of their info

  return (
    <div>
      <h2>Emergency info for...</h2>
      uuid: {uuid}
    </div>
  )
}
