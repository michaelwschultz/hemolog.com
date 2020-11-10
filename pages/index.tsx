import Head from 'next/head'

export default function Home(): JSX.Element {
  return (
    <div>
      <Head>
        <title>Hemolog | First iPhone app for Hemophiliacs</title>
      </Head>

      <main>
        <h1>Hemolog</h1>
        <h4>
          Hemolog was the first iPhone app available for hemophiliacs back in
          2011. It has sense been removed from the app store.
        </h4>

        <p>
          I initially designed Hemolog for myself. I was in college at the time
          and had been building websites and web apps for friends and family
          along with the odd job here and there. Tell more of my story here...
        </p>

        <p>
          Hemolog ment the world to me and I'm glad it was able to serve people
          well for the 4? TK years it was on the app store.
        </p>

        <a href='./archive/index.html'>View archived website (cerca 2011)</a>
      </main>

      <style jsx>{`
        a {
          color: blue;
        }

        main {
          padding: 24px;
        }
      `}</style>
    </div>
  )
}
