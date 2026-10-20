import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'
import CodeBlock from '@/components/docs/codeBlock'
import Footer from '@/components/shared/footer'
import StaticHeader from '@/components/shared/staticHeader'

const CURL_RECENT = `curl -X GET \\
  'https://hemolog.com/api/recent-treatments' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Accept: application/json'`

const FETCH_TREATMENTS = `const response = await fetch(
  'https://hemolog.com/api/treatments',
  { headers: { Authorization: 'Bearer YOUR_API_KEY' } }
)
const treatments = await response.json()

if (!response.ok) {
  throw new Error(treatments.error || 'Request failed')
}

console.log(treatments)`

const PYTHON_CSV = `import csv
import json
import urllib.request

API_KEY = 'YOUR_API_KEY'
request = urllib.request.Request(
    'https://hemolog.com/api/treatments',
    headers={'Authorization': f'Bearer {API_KEY}'},
)

with urllib.request.urlopen(request) as response:
    treatments = json.load(response)

with open('treatments.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['date', 'type', 'brand', 'units', 'sites', 'cause'])
    for treatment in treatments:
        medication = treatment.get('medication') or {}
        writer.writerow([
            treatment.get('date'),
            treatment.get('type'),
            medication.get('brand'),
            medication.get('units'),
            treatment.get('sites'),
            treatment.get('cause'),
        ])`

const TREATMENT_JSON = `[
  {
    "id": "abc123",
    "uid": "abc123",
    "cause": "",
    "createdAt": "2026-10-15T14:30:00.000Z",
    "date": "2026-10-15",
    "deletedAt": null,
    "medication": {
      "brand": "Advate",
      "units": 3000,
      "lot": "LOT1234"
    },
    "sites": "Left arm",
    "type": "PROPHY",
    "user": {
      "uid": "firebase-uid",
      "email": "you@example.com",
      "name": "Jane Doe",
      "photoUrl": "https://example.com/photo.jpg"
    }
  }
]`

const LOG_BODY = `{
  "type": "PROPHY",
  "date": "2026-10-18",
  "sites": "Left arm",
  "medication": {
    "brand": "Advate",
    "units": 3000,
    "lot": "LOT5555"
  }
}`

const LOG_SUCCESS = `{
  "message": "Success"
}`

const LOG_CURL = `curl -X POST \\
  'https://hemolog.com/api/log-treatment' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"type":"PROPHY"}'`

const ERROR_MISSING_KEY = `{
  "error": "Access denied. Missing api key."
}`

const ERROR_INVALID_KEY = `{
  "error": "Invalid API key. Reset your key on your profile page at Hemolog.com"
}`

const API_SKILL_MD = fs.readFileSync(
  path.join(process.cwd(), 'public', 'hemolog-api-skill.md'),
  'utf8'
)

function MethodBadge({ method }: { method: 'GET' | 'POST' }): ReactElement {
  const styles =
    method === 'GET'
      ? 'bg-warning-50 text-warning-700 border-warning-200'
      : 'bg-primary-50 text-primary-700 border-primary-200'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide border ${styles}`}
    >
      {method}
    </span>
  )
}

function InlineCode({ children }: { children: ReactNode }): ReactElement {
  return (
    <code className='rounded-md bg-white px-1.5 py-0.5 font-mono text-[13px] text-ink ring-1 ring-line'>
      {children}
    </code>
  )
}

function Field({
  name,
  children,
}: {
  name: string
  children: ReactNode
}): ReactElement {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-1 sm:gap-4 py-3 border-b border-gray-100'>
      <dt>
        <InlineCode>{name}</InlineCode>
      </dt>
      <dd className='text-gray-700'>{children}</dd>
    </div>
  )
}

export default function DocsPage(): ReactElement {
  return (
    <div className='page'>
      <StaticHeader />
      <main className='flex-1 px-6 pt-6 pb-16 sm:pt-10'>
        <div className='mx-auto max-w-3xl'>
          <p className='mb-3 text-[13px] font-medium tracking-[0.16em] text-primary-700 uppercase'>
            Developers
          </p>
          <h1 className='text-4xl text-ink sm:text-5xl'>API</h1>
          <p className='mt-3 max-w-xl text-lg text-slate'>
            Read your treatment history and log doses from Shortcuts, scripts,
            and other apps
          </p>
          <div className='mt-8 mb-8 h-px bg-line' />

          <nav className='mb-10 flex flex-wrap gap-x-4 gap-y-2 text-sm'>
            <a
              href='#authentication'
              className='text-ink hover:text-primary-600'
            >
              Authentication
            </a>
            <a href='#treatments' className='text-ink hover:text-primary-600'>
              Treatments
            </a>
            <a
              href='#recent-treatments'
              className='text-ink hover:text-primary-600'
            >
              Recent
            </a>
            <a
              href='#log-treatment'
              className='text-ink hover:text-primary-600'
            >
              Log a treatment
            </a>
            <a
              href='#treatment-object'
              className='text-ink hover:text-primary-600'
            >
              Treatment object
            </a>
            <a href='#examples' className='text-ink hover:text-primary-600'>
              Examples
            </a>
            <a href='#ai-agents' className='text-ink hover:text-primary-600'>
              For AI agents
            </a>
          </nav>

          <p className='text-gray-700 mb-4'>
            Anyone with a Hemolog account can use the REST API to work with
            their own treatment logs. Copy your API key from the{' '}
            <Link
              href='/app/profile'
              className='text-primary-500 hover:text-primary-600'
            >
              Profile
            </Link>{' '}
            page, then send it as an{' '}
          <InlineCode>Authorization: Bearer</InlineCode> header on each
            request.
          </p>
          <p className='text-gray-700 mb-12'>
            The API is intentionally small: fetch your full history, fetch the
            last three logs (the same slice shown on your emergency page), or
            post a new treatment. Deleted treatments are never returned.
          </p>

          <section id='authentication' className='mb-16 scroll-mt-8'>
            <h3 className='text-2xl font-bold mb-4'>Authentication</h3>
            <p className='text-gray-700 mb-4'>
              Send your API key in an{' '}
              <InlineCode>Authorization: Bearer</InlineCode> header:
            </p>
            <div className='mb-4'>
              <CodeBlock
                label='Authorization header'
                code='curl -H "Authorization: Bearer YOUR_API_KEY" https://hemolog.com/api/treatments'
              />
            </div>
            <p className='text-gray-700 mb-4'>
              The <InlineCode>apikey</InlineCode> query parameter
              (<InlineCode>?apikey=YOUR_API_KEY</InlineCode>) still works but is
              deprecated and will be removed in a future release. New
              integrations should use the header.
            </p>
            <div className='mb-4'>
              <CodeBlock
                label='Query parameter (deprecated)'
                code='https://hemolog.com/api/treatments?apikey=YOUR_API_KEY'
              />
            </div>
            <p className='text-gray-700 mb-4'>
              <InlineCode>GET /api/recent-treatments</InlineCode> also accepts{' '}
              <InlineCode>alertid</InlineCode> — the public ID printed on your
              emergency card — instead of an API key. The other endpoints
              require the key.
            </p>
            <div className='note'>
              <div className='note-title'>Keep your key private</div>
              <p className='text-sm leading-relaxed text-slate'>
                Treat the API key like a password. Anyone who has it can read
                your treatments and log new ones. You can create several keys,
                each with its own name — for example one per app — and revoke
                them individually on your profile page; a revoked key stops
                working immediately.
              </p>
            </div>
          </section>

          <section id='treatments' className='mb-16 scroll-mt-8'>
            <div className='flex flex-wrap items-center gap-3 mb-4'>
              <MethodBadge method='GET' />
              <h3 className='text-xl font-semibold font-mono'>
                /api/treatments
              </h3>
            </div>
            <p className='text-gray-700 mb-4'>
              Returns every non-deleted treatment for the key holder, newest{' '}
              <InlineCode>date</InlineCode> first. API key:{' '}
              <InlineCode>Authorization</InlineCode> header (required).
            </p>
            <div className='mb-4'>
              <CodeBlock label='Response' code={TREATMENT_JSON} />
            </div>
            <p className='text-sm text-gray-600'>
              Each item includes an extra <InlineCode>id</InlineCode> field that
              matches <InlineCode>uid</InlineCode>.
            </p>
          </section>

          <section id='recent-treatments' className='mb-16 scroll-mt-8'>
            <div className='flex flex-wrap items-center gap-3 mb-4'>
              <MethodBadge method='GET' />
              <h3 className='text-xl font-semibold font-mono'>
                /api/recent-treatments
              </h3>
            </div>
            <p className='text-gray-700 mb-4'>
              Returns the three most recent treatments, the same slice shown on
              the public emergency page. Sorted by{' '}
              <InlineCode>createdAt</InlineCode>, newest first.
            </p>
            <p className='text-gray-700 mb-4'>
              API key: <InlineCode>Authorization</InlineCode> header, or{' '}
              <InlineCode>alertid</InlineCode> (at least one required). The{' '}
              <InlineCode>apikey</InlineCode> query parameter is deprecated
              (see Authentication).
            </p>
            <div className='mb-4'>
              <CodeBlock label='cURL' code={CURL_RECENT} />
            </div>
            <p className='text-sm text-gray-600'>
              With an alert ID:{' '}
              <InlineCode>
                /api/recent-treatments?alertid=your-alert-id
              </InlineCode>
            </p>
          </section>

          <section id='log-treatment' className='mb-16 scroll-mt-8'>
            <div className='flex flex-wrap items-center gap-3 mb-4'>
              <MethodBadge method='POST' />
              <h3 className='text-xl font-semibold font-mono'>
                /api/log-treatment
              </h3>
            </div>
            <p className='text-gray-700 mb-4'>
              Creates a new treatment. Send a JSON body with any subset of
              treatment fields. Missing fields are copied from your most recent
              log, so a Shortcut can post{' '}
              <InlineCode>{`{ "type": "PROPHY" }`}</InlineCode> and reuse the
              last medication, dose, and sites. If you have never logged a
              treatment, omitted fields fall back to empty values and{' '}
              <InlineCode>PROPHY</InlineCode>. API key:{' '}
              <InlineCode>Authorization</InlineCode> header (required).
            </p>
            <p className='text-gray-700 mb-4'>
              Body: JSON object (partial treatment).{' '}
              <InlineCode>createdAt</InlineCode>,{' '}
              <InlineCode>deletedAt</InlineCode>, and{' '}
              <InlineCode>uid</InlineCode> are set by the server.
            </p>
            <div className='mb-4'>
              <CodeBlock label='Request body' code={LOG_BODY} />
            </div>
            <div className='mb-4'>
              <CodeBlock label='Success' code={LOG_SUCCESS} />
            </div>
            <p className='text-sm text-gray-600 mb-4'>
              The response is a success message, not the created record.
            </p>
            <CodeBlock label='Minimal cURL' code={LOG_CURL} />
          </section>

          <section id='errors' className='mb-16 scroll-mt-8'>
            <h3 className='text-2xl font-bold mb-4'>Errors</h3>
            <p className='text-gray-700 mb-4'>
              Failed requests return HTTP 500 with an{' '}
              <InlineCode>error</InlineCode> string:
            </p>
            <div className='space-y-4'>
              <CodeBlock label='Missing key' code={ERROR_MISSING_KEY} />
              <CodeBlock label='Invalid key' code={ERROR_INVALID_KEY} />
            </div>
            <p className='text-sm text-gray-600 mt-4'>
              Posting without a JSON body returns{' '}
              <InlineCode>
                {'{ "error": "Missing treatment data." }'}
              </InlineCode>
            </p>
          </section>

          <section id='treatment-object' className='mb-16 scroll-mt-8'>
            <h3 className='text-2xl font-bold mb-4'>Treatment object</h3>
            <p className='text-gray-700 mb-4'>
              Fields you can send when logging, and that you will see on reads:
            </p>
            <dl>
              <Field name='type'>
                <InlineCode>PROPHY</InlineCode>, <InlineCode>BLEED</InlineCode>,{' '}
                <InlineCode>PREVENTATIVE</InlineCode>, or{' '}
                <InlineCode>ANTIBODY</InlineCode>
              </Field>
              <Field name='date'>
                Treatment date as <InlineCode>YYYY-MM-DD</InlineCode>
              </Field>
              <Field name='cause'>
                Bleed cause or notes. Empty string for a typical prophylaxis
                log.
              </Field>
              <Field name='sites'>Infusion site, for example Left arm</Field>
              <Field name='medication.brand'>Product name</Field>
              <Field name='medication.units'>Dose as a number</Field>
              <Field name='medication.lot'>Optional lot number</Field>
              <Field name='createdAt'>
                ISO timestamp set by the server when the log is created
              </Field>
              <Field name='deletedAt'>
                <InlineCode>null</InlineCode> on active treatments. Soft-deleted
                logs are omitted from API responses.
              </Field>
              <Field name='user'>
                Attached account snapshot: <InlineCode>uid</InlineCode>,{' '}
                <InlineCode>email</InlineCode>, <InlineCode>name</InlineCode>,{' '}
                <InlineCode>photoUrl</InlineCode>
              </Field>
            </dl>
          </section>

          <section id='examples' className='mb-16 scroll-mt-8'>
            <h3 className='text-2xl font-bold mb-4'>Examples</h3>
            <p className='text-gray-700 mb-8'>
              A few ways people actually use this API — from a one-off curl to a
              home-screen Shortcut.
            </p>

            <h4 className='text-lg font-semibold mb-2'>cURL</h4>
            <p className='text-gray-700 mb-4'>
              Confirm your key works by fetching the last three treatments:
            </p>
            <div className='mb-10'>
              <CodeBlock label='cURL' code={CURL_RECENT} />
            </div>

            <h4 className='text-lg font-semibold mb-2'>JavaScript</h4>
            <p className='text-gray-700 mb-4'>
              Export your full history from the browser console, a Node script,
              or a personal dashboard:
            </p>
            <div className='mb-10'>
              <CodeBlock label='JavaScript' code={FETCH_TREATMENTS} />
            </div>

            <h4 className='text-lg font-semibold mb-2'>Apple Shortcut</h4>
            <p className='text-gray-700 mb-4'>
              Log prophylaxis from your home screen. Because the API fills in
              missing fields from your last treatment, the Shortcut only needs
              to send a type.
            </p>
            <ol className='list-decimal pl-5 text-gray-700 mb-4 space-y-2'>
              <li>Open Shortcuts and create a new shortcut.</li>
              <li>
                Add <strong>Get Contents of URL</strong>. Set the URL to{' '}
                <InlineCode>https://hemolog.com/api/log-treatment</InlineCode>
                and add a header:{' '}
                <InlineCode>Authorization</InlineCode> with value{' '}
                <InlineCode>Bearer YOUR_API_KEY</InlineCode>.
              </li>
              <li>
                Method: <InlineCode>POST</InlineCode>. Request body:{' '}
                <InlineCode>JSON</InlineCode> with <InlineCode>type</InlineCode>{' '}
                set to <InlineCode>PROPHY</InlineCode>.
              </li>
              <li>
                Add the shortcut to your Home Screen. Repeat for{' '}
                <InlineCode>BLEED</InlineCode> if you want a second button.
              </li>
            </ol>
            <div className='mb-10'>
              <CodeBlock label='JSON body' code={`{\n  "type": "PROPHY"\n}`} />
            </div>

            <h4 className='text-lg font-semibold mb-2'>Python CSV export</h4>
            <p className='text-gray-700 mb-4'>
              Pull your history into a spreadsheet before a clinic visit:
            </p>
            <CodeBlock label='Python' code={PYTHON_CSV} />
          </section>

          <div className='note'>
            <div className='note-title'>Your API keys</div>
            <p className='text-sm leading-relaxed text-slate'>
              Create, name, and revoke keys on your{' '}
              <Link
                href='/app/profile'
                className='text-ink underline decoration-primary-500 decoration-2 underline-offset-2'
              >
                Profile
              </Link>{' '}
              page. If a request fails with an invalid key, create a new one
              there and update your scripts.
            </p>
          </div>

          <section id='ai-agents' className='mb-16 scroll-mt-8'>
            <h3 className='text-2xl font-bold mb-4'>For AI agents</h3>
            <p className='text-gray-700 mb-4'>
              If you are an AI assistant (or you are building with one), you can
              use this page as your instructions for the Hemolog API. Create a
              key on your{' '}
              <Link
                href='/app/profile'
                className='text-primary-500 hover:text-primary-600'
              >
                Profile
              </Link>{' '}
              page, then send it as{' '}
              <InlineCode>Authorization: Bearer YOUR_API_KEY</InlineCode> on
              every request.
            </p>
            <p className='text-gray-700 mb-2'>Quick reference:</p>
            <ul className='list-disc pl-5 text-gray-700 mb-4 space-y-1'>
              <li>
                Base URL:{' '}
                <InlineCode>https://hemolog.com</InlineCode> (JSON in and out)
              </li>
              <li>
                <InlineCode>GET /api/treatments</InlineCode> — every
                non-deleted treatment, newest first
              </li>
              <li>
                <InlineCode>GET /api/recent-treatments</InlineCode> — the three
                most recent treatments (also works with{' '}
                <InlineCode>?alertid=</InlineCode> instead of a key)
              </li>
              <li>
                <InlineCode>POST /api/log-treatment</InlineCode> — log a new
                treatment; missing fields are copied from the last log, so{' '}
                <InlineCode>{`{ "type": "PROPHY" }`}</InlineCode> is enough
              </li>
              <li>
                Errors return HTTP 500 with an{' '}
                <InlineCode>error</InlineCode> string — show it to the user
                rather than retrying
              </li>
            </ul>
            <p className='text-gray-700 mb-4'>
              A revoked key stops working immediately. If you get{' '}
              <InlineCode>Invalid API key</InlineCode>, ask the user for a new
              one from their Profile page. Treat the key like a password: never
              print or log it, and prefer the header over URL parameters.
            </p>
            <p className='text-gray-700 mb-4'>
              The full skill as a single markdown file, suitable for pasting
              into an agent's instructions:
            </p>
            <div className='mb-4'>
              <CodeBlock label='hemolog-api-skill.md' code={API_SKILL_MD} />
            </div>
            <p className='text-sm text-gray-600'>
              Also available as a download at{' '}
              <a
                href='/hemolog-api-skill.md'
                className='text-primary-500 hover:text-primary-600 underline'
              >
                hemolog.com/hemolog-api-skill.md
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
