import type { ReactElement } from 'react'
import HomePage from '@/components/home/homePage'

export default function AppDashboardPage(): ReactElement {
  return (
    <section className='pt-6 sm:pt-10'>
      <HomePage />
    </section>
  )
}
