import { Text, Grid, Link, Card } from '@geist-ui/react'
import Image from 'next/image'

export default function DescrtipionCards(): JSX.Element {
  return (
    <Grid.Container gap={2}>
      <Grid xs={24} sm={12}>
        <Card>
          <Image src='/images/feature-free.png' width={40} height={40} />
          <Text h4 style={{ marginTop: '16px' }}>
            Free forever
          </Text>
          <Text style={{ color: '#718096' }}>
            No sponsorships, pharma companies, or ads.
          </Text>
        </Card>
      </Grid>
      <Grid xs={24} sm={12}>
        <Card>
          <Image src='/images/feature-dead.png' width={40} height={40} />
          <Text h4 style={{ marginTop: '16px' }}>
            Didn’t Hemolog die?
          </Text>
          <Text style={{ color: '#718096' }}>
            Yep, but it’s back. Just wait till you see what this reincarnation
            can do!
          </Text>
        </Card>
      </Grid>
      <Grid xs={24} sm={12}>
        <Card>
          <Image src='/images/feature-lock.png' width={40} height={40} />
          <Text h4 style={{ marginTop: '16px' }}>
            Safe and secure
          </Text>
          <Text style={{ color: '#718096' }}>
            Your data is stored in Firebase, a trused database owned by Google.
          </Text>
        </Card>
      </Grid>
      <Grid xs={24} sm={12}>
        <Card>
          <Image src='/images/feature-github.png' width={40} height={40} />
          <Text h4 style={{ marginTop: '16px' }}>
            Open source
          </Text>
          <Text style={{ color: '#718096' }}>
            Check out the code on{' '}
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
    </Grid.Container>
  )
}
