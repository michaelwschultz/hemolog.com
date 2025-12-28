import Head from 'next/head'
import Logo from 'components/logo'
import EmergencyCard from 'components/emergencyCard'

export default function Print(): JSX.Element {
  // TODO(michael) Could improve this by determining the user on the server side
  // and redirecting before hitting this page. Similar to how Lee Robinson explains
  // it here https://www.youtube.com/watch?v=NSR_Y_rm_zU

  return (
    <div className='print:shadow-none print:color-adjust-exact print:print-color-adjust-exact'>
      <style jsx global>{`
        @media print {
          header,
          .hide-from-printer {
            display: none !important;
          }
        }
        .emergency-card {
          box-shadow: none !important;
        }
      `}</style>

      <Head>
        <title>Hemolog - Print</title>
      </Head>

      <div className='min-h-screen flex flex-col'>
        <header className='pt-6 pb-4'>
          <div className='max-w-4xl mx-auto px-6'>
            <Logo />
          </div>
        </header>

        <main className='flex-1 px-6 py-8'>
          <div className='max-w-4xl mx-auto'>
            <h4 className='text-xl font-semibold mb-4 hide-from-printer'>
              Print and cut your emergency card
            </h4>
            <p className='mb-2 hide-from-printer'>
              To print, go to <i>File {'>'} Print</i>, or hit <b>Control + P</b>{' '}
              (Command on Mac).
            </p>
            <p className='mb-8 hide-from-printer'>
              Keep the card in your wallet or in your car.
            </p>

            <div className='inline-block p-2 border-2 border-dashed border-gray-400 rounded-2xl'>
              <EmergencyCard forPrint />
            </div>
          </div>
        </main>

        <footer className='pb-4'></footer>
      </div>
    </div>
  )
}
