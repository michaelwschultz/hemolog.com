import React from 'react'
import { Text } from '@geist-ui/react'
import Droplet from '@geist-ui/react-icons/droplet'
import Link from 'next/link'

export default function Logo(): JSX.Element {
  return (
    <Text h4>
      <Link href='/'>
        <a style={{ color: 'black' }}>
          Hemolog <Droplet color='salmon' />
        </a>
      </Link>
    </Text>
  )
}
