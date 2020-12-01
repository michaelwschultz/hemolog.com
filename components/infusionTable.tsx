import React from 'react'
import fetcher from 'lib/fetcher'
import useSWR from 'swr'

type Value = string[]

interface ValueRanges {
  range: string
  majorDimension: string
  values: Value[]
}

export interface InfusionSheet {
  error?: Error
  spreadsheetId: string
  valueRanges: ValueRanges[]
}

export default function InfusionTable(): JSX.Element {
  const { data, error } = useSWR<InfusionSheet>('/api/infusions', fetcher)

  if (!data) {
    return <div>Loading infusion data...</div>
  }

  if (error) {
    return <div>API failed to return data</div>
  }

  if (data.error) {
    return <div>Oops, something went wrong accessing your infusion data.</div>
  }

  const renderRow = (row): JSX.Element => {
    return (
      <tr key={`table-row-${row[0]}`}>
        {row.map((cell, index) => (
          <td key={`table-cell-${index}`}>{cell}</td>
        ))}

        <style jsx>{`
          td {
            padding: 0 16px 0 0;
            text-align: left;
          }
        `}</style>
      </tr>
    )
  }

  const values = data.valueRanges[0].values
  const columnHeaders = values[0]

  const entries = [...values]
  entries.shift() // removes columnHeaders (first entry) from array

  return (
    <table>
      <thead>
        <tr>
          {columnHeaders.map((header, index) => (
            <th key={`table-column-header-${index}`}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{entries.map((row) => renderRow(row))}</tbody>

      <style jsx>{`
        th {
          padding: 0 16px 0 0;
          text-align: left;
        }
      `}</style>
    </table>
  )
}
