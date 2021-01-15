import Head from 'next/head'
import {
  Page,
  Text,
  Row,
  Spacer,
  Loading,
  useMediaQuery,
} from '@geist-ui/react'

import { useAuth } from 'lib/auth'
import InfusionTable from 'components/infusionTable'
import Stats from 'components/stats'
import Header from 'components/header'
import Footer from 'components/footer'

export default function Logs(): JSX.Element {
  const auth = useAuth()
  const smallerThanSmall = useMediaQuery('sm', { match: 'down' })

  // TODO(michael) add welcome message by checking to see if this is the users
  // first time logging in. Still not sure how to accomplish this.
  //
  // const [toasts, setToast] = useToasts()

  // // displays welcome message on first login
  // useEffect(() => {
  //   if (user && !toasts.length) {
  //     setToast({
  //       text: '👋 Welcome to Hemolog 2!',
  //       delay: 12000,
  //       type: 'success',
  //       actions: [
  //         {
  //           name: 'thanks',
  //           passive: true,
  //           handler: (_event, cancel) => cancel(),
  //         },
  //       ],
  //     })
  //   }
  // }, [user])

  // TODO(michael): Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

  if (!auth.user) {
    return <Loading>Loading</Loading>
  }

  return (
    <>
      <Head>
        <title>Hemolog</title>
      </Head>
      <Page size='large'>
        <Header />
        <Page.Content>
          <Text h4>Insights</Text>
          <Stats />
          {/* <Chart /> */}
          <Spacer y={3} />
          <Row justify='space-between' align='middle'>
            <Text h4>Infusions</Text>
            {smallerThanSmall && <Text>Swipe →</Text>}
          </Row>
          <InfusionTable />
          {/* TODO(michael) find out how this Spacer can be removed */}
          <Spacer y={5} />
        </Page.Content>
        <Footer />
      </Page>
    </>
  )
}
