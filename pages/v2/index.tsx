import { useState } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import InfusionTable from 'components/firebaseInfusionTable'
import Stats from 'components/stats'
// import Chart from 'components/chart'
import Sidebar from 'components/sidebar'
import { useUser } from 'utils/auth/useUser'
import { Page, Text, Button, Row, Keyboard } from '@geist-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import Droplet from '@geist-ui/react-icons/droplet'

export default function Home(): JSX.Element {
  const { user } = useUser()
  const [showSidebar, setShowSidebar] = useState(true)
  const toggleSidebar = () => setShowSidebar((prevState) => !prevState)
  useHotkeys('ctrl+b', toggleSidebar)
  // TODO: Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU
  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Hemolog 2</title>
      </Head>

      <StyledPage>
        {showSidebar && <Sidebar />}
        <Page size='large'>
          <Page.Header style={{ paddingTop: '24px' }}>
            <Row justify='space-between'>
              <Text h4>
                Hemolog <Droplet color='salmon' />
              </Text>
              <div>
                <Button onClick={toggleSidebar} auto>
                  Toggle sidebar
                </Button>
              </div>
            </Row>
          </Page.Header>
          <Page.Content>
            <InfusionTable />
            {/* <Chart /> */}
            <Stats />
          </Page.Content>
          <Page.Footer style={{ paddingBottom: '16px' }}>
            <Text h4>Useful tools</Text>
            <Row justify='space-between' align='middle'>
              <Button onClick={toggleSidebar} auto>
                Toggle sidebar
              </Button>
              <Text p>
                Toggle sidebar with: <Keyboard ctrl>b</Keyboard>
              </Text>
            </Row>
          </Page.Footer>
        </Page>
      </StyledPage>
    </>
  )
}

const StyledPage = styled.div`
  height: inherit;
  display: flex;
  flex-direction: row;
`
