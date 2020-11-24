import React from 'react'
import useInfusions, { Infusion } from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import dayjs from 'dayjs'
import {
  Note,
  Table,
  Row,
  Loading,
  Badge,
  Spacer,
  Pagination,
  Text,
} from '@geist-ui/react'
import ChevronRight from '@geist-ui/react-icons/chevronRight'
import ChevronLeft from '@geist-ui/react-icons/chevronLeft'

interface Props {
  limit?: number
}

export default function InfusionTable(props: Props): JSX.Element {
  const { limit } = props
  const { data: infusions, status, error } = useInfusions(limit)

  if (status === FirestoreStatusType.LOADING) {
    return (
      <Row>
        <Loading>Loading infusion logs...</Loading>
      </Row>
    )
  }

  if (error) {
    return (
      <Note type='error' label='Error'>
        Oops, the database didn't respond. Refresh the page to try again.
      </Note>
    )
  }

  if (status === FirestoreStatusType.ERROR && !error) {
    return (
      <Note type='error' label='Error'>
        Something went wrong accessing your infusion data. Refresh the page to
        try again.
      </Note>
    )
  }

  function formatInfusionRow(infusion: Infusion) {
    const { bleedReason } = infusion
    const timestamp = dayjs(infusion.timestamp).format('MM/DD/YYYY')
    const prophy = infusion.prophy ? (
      <Badge type='success'>Prophy</Badge>
    ) : (
      <Badge type='error'>Bleed</Badge>
    )
    const sites = infusion.sites.join(', ')
    const factorBrand = infusion.medication.brand
    const units = `${infusion.medication.units} ui`

    return { timestamp, prophy, sites, bleedReason, factorBrand, units }
  }

  const rowData = infusions.map((infusion) => formatInfusionRow(infusion))

  return (
    <>
      <Text h4>Infusion logs</Text>
      <Table data={rowData} width='100%'>
        <Table.Column prop='timestamp' label='Date' />
        <Table.Column prop='prophy' label='Reason' />
        <Table.Column prop='sites' label='Bleed sites' />
        <Table.Column prop='bleedReason' label='Attribution' />
        <Table.Column prop='factorBrand' label='Factor' />
        <Table.Column prop='units' label='Amount' />
      </Table>
      {infusions.length >= 25 && (
        <>
          <Spacer y={0.5} />
          <Row justify='end'>
            <Pagination count={1}>
              <Pagination.Next>
                <ChevronRight />
              </Pagination.Next>
              <Pagination.Previous>
                <ChevronLeft />
              </Pagination.Previous>
            </Pagination>
          </Row>
        </>
      )}
    </>
  )
}
