import React from 'react'
import fetch from '../lib/fetch'
import useSWR from 'swr'
import _ from 'underscore'

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

export default function Stats(): JSX.Element {
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

  const values = data.valueRanges[0].values
  const entries = [...values]
  entries.shift() // remove columnHeaders from array

  const affectedAreas = entries.map((entry) => entry[3])

  var mostAffectedArea = _.chain(affectedAreas)
    .countBy()
    .pairs()
    .max(_.last)
    .head()
    .value()

  const numberOfInfusions = entries.length

  return (
    <div>
      <h1>Stats</h1>
      <h3>{numberOfInfusions}</h3>
      <h3>{mostAffectedArea}</h3>
    </div>
  )
}
