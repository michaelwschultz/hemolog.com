import React from 'react'
import useSWR from 'swr'
import _ from 'underscore'
import styled from 'styled-components'

import fetch from 'lib/fetch'

// TODO: move types to types file
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

const COST_OF_FACTOR_8 = 1.66
const NUMBER_OF_UNITS = 3000
const PHARMACY_ORDERS = 6

const estimatedTotalCost = PHARMACY_ORDERS * NUMBER_OF_UNITS * COST_OF_FACTOR_8
// TODO take this number from each infusion row

export default function Stats(): JSX.Element {
  // TODO: this data and catches doesn't need to be here.
  // Instead this call could be created in _app then passed
  // in React.Context.
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

  const affectedAreas = entries.map((entry) => entry[2])
  const cause = entries.map((entry) => entry[3])

  const mostAffectedArea = _.chain(affectedAreas)
    .countBy()
    .pairs()
    .max(_.last)
    .head()
    .value()

  const biggestCause = _.chain(cause)
    .countBy()
    .pairs()
    .max(_.last)
    .head()
    .value()

  const numberOfInfusions = entries.length
  const unitsOfFactor = numberOfInfusions * NUMBER_OF_UNITS

  // TODO: build a widget component that fetches it's own data?
  // This might not be nessisary, but could be nice. Although
  // right now all the data is fetched with the single call to /api/infusions
  return (
    <div>
      <h1>2020 Stats</h1>
      <StyledGrid>
        <StyledCard>
          <p>Infusions</p>
          <h2>{numberOfInfusions}</h2>
        </StyledCard>
        <StyledCard>
          <p>Bleeds</p>
          <h2>3 (placeholder)</h2>
        </StyledCard>
        <StyledCard>
          <p>Consecutive prophy infusions</p>
          <h2>0 (placeholder)</h2>
        </StyledCard>
        <StyledCard>
          <p>Most affected area</p>
          <h2>{mostAffectedArea}</h2>
        </StyledCard>
        <StyledCard>
          <p>Biggest cause</p>
          <h2>{biggestCause}</h2>
        </StyledCard>
        <StyledCard>
          <p>Units of factor</p>
          <h2>~{unitsOfFactor.toLocaleString()}</h2>
        </StyledCard>
        <StyledCard>
          {/* I think this is between $1.19 and $1.66 per unit based on this article
            https://www.ashclinicalnews.org/spotlight/feature-articles/high-price-hemophilia/ */}
          <p>Estimated total cost</p>
          <h2>${estimatedTotalCost.toLocaleString()}</h2>
        </StyledCard>
        <StyledCard>
          {/* TODO: could setup a separate sheet for this data as well as a 
            separate api call */}
          <p>Pharmacy orders</p>
          <h2>6</h2>
        </StyledCard>
      </StyledGrid>

      <style jsx>{`
        h1 {
          padding-top: 40px;
        }
      `}</style>
    </div>
  )
}

const StyledCard = styled.div`
  border: 1px solid black;
  border-radius: 6px;
  padding: 32px;

  h2 {
    font-size: 21px;
  }
  p {
    font-size: 14px;
  }
`

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 16px;
`
