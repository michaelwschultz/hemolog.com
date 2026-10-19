import type { ReactElement } from 'react'
import ProfilePage from '@/components/home/profilePage'

export default function AppProfilePage(): ReactElement {
  return (
    <section className='pt-6 sm:pt-10'>
      <ProfilePage />
    </section>
  )
}
