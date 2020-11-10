import React from 'react'
import fetch from '../lib/fetch'
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
  const { data, error } = useSWR<InfusionSheet>('/api/infusions', fetch)

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
    //TODO: each cell needs a unique key
    return (
      <tr>
        {row.map((cell) => (
          <td>{cell}</td>
        ))}
      </tr>
    )
  }

  const values = data.valueRanges[0].values
  const columnHeaders = values[0]

  const entries = [...values]
  entries.shift() // remove columnHeaders from array

  return (
    <table>
      <tr>
        {columnHeaders.map((header) => (
          <th>{header}</th>
        ))}
      </tr>
      {entries.map((row) => renderRow(row))}
    </table>
  )
}
