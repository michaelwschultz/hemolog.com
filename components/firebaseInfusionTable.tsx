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
} from '@geist-ui/react'
import Check from '@geist-ui/react-icons/check'
import ChevronRight from '@geist-ui/react-icons/chevronRight'
import ChevronLeft from '@geist-ui/react-icons/chevronLeft'

export default function InfusionTable(): JSX.Element {
  const { data: infusions, status, error } = useInfusions()

  if (status === FirestoreStatusType.LOADING) {
    return (
      <Row>
        <Loading>Loading</Loading>
      </Row>
    )
  }

  if (error) {
    return <Note type="error">API did not return any data</Note>
  }

  if (status === FirestoreStatusType.ERROR && !error) {
    return (
      <Note type="error">
        Oops, something went wrong accessing your infusion data.
      </Note>
    )
  }

  function formatInfusionRow(infusion: Infusion) {
    const { bleedReason } = infusion
    const timestamp = dayjs(infusion.timestamp).format('MM/DD/YYYY')
    const prophy = infusion.prophy && <Check />
    const sites = infusion.sites.join(', ')
    const factorBrand = infusion.medication.brand
    const units = <Badge>{infusion.medication.units}</Badge>

    return { timestamp, prophy, sites, bleedReason, factorBrand, units }
  }

  const rowData = infusions.map((infusion) => formatInfusionRow(infusion))

  return (
    <>
      <Table data={rowData} width="100%">
        <Table.Column prop="timestamp" label="Date" />
        <Table.Column prop="prophy" label="Phrophy" />
        <Table.Column prop="sites" label="Bleed sites" />
        <Table.Column prop="bleedReason" label="Reason" />
        <Table.Column prop="factorBrand" label="Factor" />
        <Table.Column prop="units" label="Amount" />
      </Table>
      <Spacer y={0.5} />
      <Row justify="end">
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
  )
}
