import React from 'react'
import styled from 'styled-components'
import useInfusions from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { format, compareDesc, parseISO } from 'date-fns'
import {
  Note,
  Table,
  Row,
  Loading,
  Badge,
  Spacer,
  Pagination,
  useToasts,
  Button,
  Tooltip,
} from '@geist-ui/react'
import ChevronRight from '@geist-ui/react-icons/chevronRight'
import ChevronLeft from '@geist-ui/react-icons/chevronLeft'
import {
  InfusionType,
  InfusionTypeEnum,
  deleteInfusion,
} from 'lib/db/infusions'
import { useAuth } from 'lib/auth'

interface Props {
  limit?: number
  uid?: string
}

enum infusionTypeBadgeStyle {
  BLEED = 'success',
  PROPHY = 'warning',
  PREVENTATIVE = 'error',
}

export default function InfusionTable(props: Props): JSX.Element {
  const { limit, uid } = props
  const { data: infusions, status, error } = useInfusions(limit, uid)
  const [, setToast] = useToasts()
  const { user } = useAuth()

  if (status === FirestoreStatusType.LOADING) {
    return (
      <>
        <Table data={[]} width='100%'>
          <Table.Column prop='createdAt' label='Date' />
          <Table.Column prop='type' label='Reason' />
          <Table.Column prop='sites' label='Bleed sites' />
          <Table.Column prop='cause' label='Cause' />
          <Table.Column prop='factorBrand' label='Factor' />
          <Table.Column prop='units' label='Amount' />
        </Table>
        <Spacer y={2} />
        <Row>
          <Loading>Loading infusion data</Loading>
        </Row>
      </>
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

  const deleteRow = (uid: string) => {
    deleteInfusion(uid)
      .then(() => {
        setToast({
          text: 'Infusion deleted.',
          type: 'success',
          delay: 5000,
        })
      })
      .catch((error) =>
        setToast({
          text: `Something went wrong: ${error}`,
          type: 'error',
          delay: 10000,
        })
      )
  }

  function formatInfusionRow(infusion: InfusionType) {
    const { cause, sites } = infusion
    const createdAt = format(new Date(infusion.createdAt), 'MM/dd/yyyy')
    const type = (
      <Badge type={infusionTypeBadgeStyle[infusion.type]}>
        {InfusionTypeEnum[infusion.type]}
      </Badge>
    )
    const factorBrand = infusion.medication.brand
    const units = infusion.medication.units && `${infusion.medication.units} iu`

    const remove = (
      <>
        <Tooltip text="Hope you're sure about this." placement='left'>
          <Button size='mini' onClick={() => deleteRow(infusion.uid)} auto>
            Delete
          </Button>
        </Tooltip>
      </>
    )

    return { createdAt, type, sites, cause, factorBrand, units, remove }
  }

  // TODO(michael) add more sorting filters
  // sort by date, most recent at the top
  infusions.sort((a, b) =>
    compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  )

  const rowData = infusions.map((infusion) => formatInfusionRow(infusion))

  return (
    <StyledTableWrapper>
      <Table
        data={rowData}
        width='100%'
        hover={false}
        // TODO(michael) add the ability to update logs
        // onRow={(row) => updateRow(row.uid)}
      >
        <Table.Column prop='createdAt' label='Date' />
        <Table.Column prop='type' label='Reason' />
        <Table.Column prop='sites' label='Bleed sites' />
        <Table.Column prop='cause' label='Cause' />
        <Table.Column prop='factorBrand' label='Factor' />
        <Table.Column prop='units' label='Amount' />
        {user && <Table.Column prop='remove' />}
      </Table>
      {infusions.length === 0 && (
        <>
          <Spacer />
          <Note type='success' filled>
            No infusions found. Add one by clicking 'Log Infusion' above.
          </Note>
        </>
      )}
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
    </StyledTableWrapper>
  )
}

const StyledTableWrapper = styled.div`
  overflow-x: scroll;
`
