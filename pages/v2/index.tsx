import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import InfusionTable from 'components/infusionTable'
import Stats from 'components/stats'
import Chart from 'components/chart'
import Sidebar from 'components/sidebar'
import { useUser } from 'utils/auth/useUser'

export default function Home(): JSX.Element {
  const { user } = useUser()
  // TODO: Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU
  if (!user) {
    return <></>
  }

  return (
    <>
      <Head>
        <title>Hemolog version 2</title>
      </Head>

      <StyledPage>
        <Sidebar />
        <StyledMain>
          <h1>Hemolog</h1>
          <StyledFlex>
            <InfusionTable />
            <Chart />
          </StyledFlex>
          <Stats />
        </StyledMain>
      </StyledPage>
    </>
  )
}

const StyledPage = styled.div`
  height: inherit;
  display: flex;
  flex-direction: row;
`

const StyledMain = styled.div`
  padding: 24px;
`

const StyledFlex = styled.div`
  display: flex;
  justify-content: space-between;
`
