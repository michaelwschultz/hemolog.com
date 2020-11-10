import Head from 'next/head'
import InfusionTable from '../../components/infusionTable'
import Stats from '../../components/stats'

export default function Home(): JSX.Element {
  return (
    <div>
      <Head>
        <title>Hemolog version 2</title>
      </Head>

      <main>
        <h1>Hemolog</h1>
        <InfusionTable />
        <Stats />
      </main>

      <style jsx>{`
        main {
          padding: 24px;
        }
      `}</style>
    </div>
  )
}
