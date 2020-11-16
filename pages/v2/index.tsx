import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import InfusionTable from 'components/infusionTable'
import Stats from 'components/stats'
import Chart from 'components/chart'
import Sidebar from 'components/sidebar'

export default function Home(): JSX.Element {
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
