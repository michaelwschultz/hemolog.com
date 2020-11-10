import Head from 'next/head'
import InfusionTable from 'components/infusionTable'
import Stats from 'components/stats'
import Chart from 'components/chart'

export default function Home(): JSX.Element {
  return (
    <div>
      <Head>
        <title>Hemolog version 2</title>
      </Head>

      <main>
        <h1>Hemolog</h1>
        <div className='flex'>
          <InfusionTable />
          <Chart />
        </div>
        <Stats />
      </main>

      <style jsx>{`
        .flex {
          display: flex;
          justify-content: space-between;
        }
        main {
          padding: 24px;
        }
      `}</style>
    </div>
  )
}
