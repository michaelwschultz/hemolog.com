import { Text, Grid, Link, Card } from '@geist-ui/react'

export default function DescrtipionCards(): JSX.Element {
  return (
    <Grid.Container gap={2}>
      <Grid xs={24} sm={12}>
        <Card>
          <Text h4>Open source</Text>
          <Text>
            Hemolog is completely open source. We've got a limited number of
            years to worry about logging. Check out the code on{' '}
            <Link
              href='https://github.com/michaelwschultz/hemolog.com'
              icon
              color
            >
              Github
            </Link>
            .
          </Text>
        </Card>
      </Grid>
      <Grid xs={24} sm={12}>
        <Card>
          <Text h4>Free forever</Text>
          <Text>
            No need to worry about paying for Hemolog. It's free forever. No
            sponsorships, pharma companies, or ads. Promise!
          </Text>
        </Card>
      </Grid>
      <Grid xs={24} sm={12}>
        <Card>
          <Text h4>Wait...didn't Hemolog die?</Text>
          <Text>
            Hemolog's first incarnation was an iPhone app back in 2011. It was a
            great start but didn't do <i>most</i> of what Hemolog 2 can do!
          </Text>
        </Card>
      </Grid>
      <Grid xs={24} sm={12}>
        <Card>
          <Text h4>Is this safe?</Text>
          <Text>
            <Link
              href='https://github.com/michaelwschultz/hemolog.com'
              color
              icon
            >
              See for yourself!
            </Link>
            {` `}
            Your data is stored in{' '}
            <Link href='https://firebase.google.com/' color icon>
              Firebase
            </Link>
            , a trused Google product. You own your data, and it will never be
            sold.
          </Text>
        </Card>
      </Grid>
    </Grid.Container>
  )
}
