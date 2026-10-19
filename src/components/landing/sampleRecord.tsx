import type { ReactElement } from 'react'

const rows = [
  { date: '14 Oct', why: 'Prophy', units: '3,000', bleed: false },
  { date: '11 Oct', why: 'Bleed · right ankle', units: '2,000', bleed: true },
  { date: '08 Oct', why: 'Prophy', units: '3,000', bleed: false },
  {
    date: '04 Oct',
    why: 'Preventative · before a hike',
    units: '1,500',
    bleed: false,
  },
  { date: '01 Oct', why: 'Prophy', units: '3,000', bleed: false },
]

export default function SampleRecord(): ReactElement {
  return (
    <figure className='assay'>
      <figcaption className='px-5 pt-4 pb-1 font-mono text-[11px] tracking-[0.14em] text-slate uppercase'>
        Example record
      </figcaption>
      <table className='w-full border-collapse text-left'>
        <thead>
          <tr className='border-b border-line font-mono text-[11px] tracking-[0.14em] text-slate uppercase'>
            <th scope='col' className='px-5 py-2.5 font-medium'>
              Date
            </th>
            <th scope='col' className='py-2.5 pr-2 pl-5 font-medium'>
              Why
            </th>
            <th scope='col' className='px-5 py-2.5 text-right font-medium'>
              IU
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date} className='border-b border-line last:border-0'>
              <td className='px-5 py-3.5 font-mono text-sm whitespace-nowrap text-slate tabular-nums'>
                {row.date}
              </td>
              <td className='relative py-3.5 pr-2 pl-5 text-sm text-ink'>
                {row.bleed && (
                  <span
                    aria-hidden='true'
                    className='absolute top-1/2 left-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary-500'
                  />
                )}
                {row.why}
              </td>
              <td className='px-5 py-3.5 text-right font-mono text-sm font-medium whitespace-nowrap text-ink tabular-nums'>
                {row.units}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className='border-t border-line px-5 py-3 font-mono text-xs leading-relaxed text-slate'>
        In this stretch: 1 bleed, right ankle, 12,500 IU.
      </p>
    </figure>
  )
}
