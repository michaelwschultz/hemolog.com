import Head from 'next/head'
import { Page, Text, Divider, Display, Image, Spacer } from '@geist-ui/react'
import DescriptionCards from 'components/descriptionCards'

export default function About(): JSX.Element {
  return (
    <>
      <Head>
        <title>Hemolog - About</title>
      </Head>
      <Page size='large'>
        <Page.Content>
          <Text h2>The story so far</Text>
          <Text h5>More than you would ever want to know about Hemolog</Text>
          <Divider />

          <Display
            shadow
            caption='High level stats that help you understand your habbits'
          >
            <Image width={765} height={400} src='/images/hemolog-2-hero.png' />
          </Display>

          <Text>
            Let's face it, there are some exciting developments in the world of
            Hemophilia research. Honestly, it's not <i>just</i> research
            anymore. Clinical trials are happening now across the globe. Gene
            threrapy is definitly going to change things for the better, it's
            just a matter of when it's available to all of us.
          </Text>

          <Text>
            That being said, it's still important to keep track of you
            treatments. Maybe even more now than ever. If getting on a trial is
            something you re interested in, knowing how many bleeds you were
            having before is really important.
          </Text>

          <Text>
            Trial or not, keeping track of your treatment habbits can be hard,
            and the tools we have don't do a great job. Hemolog is simple. You
            track your treatments, and Hemolog gives you instant feedback.
          </Text>

          <Text>
            Stats are something that I always wanted to be apart of Hemolog, and
            now they're here.
          </Text>

          <Spacer />

          {/* <Display
            shadow
            caption='High level stats that help you understand your habbits'
          >
            <Image width={626} height={306} src='/images/stats-example.png' />
          </Display> */}
          <Divider />
          <Spacer y={2} />
          <DescriptionCards />
        </Page.Content>
      </Page>
    </>
  )
}
