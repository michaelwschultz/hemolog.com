import Head from 'next/head'
import { Page, Text, Row } from '@geist-ui/react'

import Logo from 'components/logo'
import Footer from 'components/footer'

export async function getServerSideProps(context) {
  return {
    props: {},
  }
}

export default function Landing(): JSX.Element {
  return (
    <>
      <Head>
        <title>Hemolog</title>
      </Head>
      <Page size='large'>
        <Page.Header>
          <Row justify='space-between' align='middle'>
            <Logo />
          </Row>
        </Page.Header>
        <Page.Content>
          <Text h2>Welcome to Hemolog</Text>
        </Page.Content>
        <Footer />
      </Page>
    </>
  )
}
