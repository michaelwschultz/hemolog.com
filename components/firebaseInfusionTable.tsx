import React from 'react'
import useInfusions, { Infusion } from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import dayjs from 'dayjs'

export default function InfusionTable(): JSX.Element {
  const { data: infusions, status, error } = useInfusions()

  if (status === FirestoreStatusType.LOADING) {
    return <div>Loading infusion data...</div>
  }

  if (error) {
    return <div>API failed to return data</div>
  }

  if (status === FirestoreStatusType.ERROR && !error) {
    return <div>Oops, something went wrong accessing your infusion data.</div>
  }

  function formatInfusionRow(infusion: Infusion) {
    const { bleedReason } = infusion
    const timestamp = dayjs(infusion.timestamp).format('MM/DD/YYYY')
    const prophy = infusion.prophy && '✓'
    const sites = infusion.sites.join(', ')
    const factorBrand = infusion.medication.brand
    const units = infusion.medication.units

    return [timestamp, prophy, sites, bleedReason, factorBrand, units]
  }

  const renderRow = (row: Infusion): JSX.Element => {
    const formattedRow = formatInfusionRow(row)

    return (
      <tr key={`table-row-${row.id}`}>
        {formattedRow.map((cell, index) => (
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

  const columnHeaders = [
    'Date',
    'Prophy',
    'Bleed sites',
    'Reason',
    'Factor',
    'Amount',
  ]

  return (
    <table>
      <thead>
        <tr>
          {columnHeaders.map((header, index) => (
            <th key={`table-column-header-${index}`}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{infusions.map((row) => renderRow(row))}</tbody>

      <style jsx>{`
        th {
          padding: 0 16px 0 0;
          text-align: left;
        }
      `}</style>
    </table>
  )
}
