import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { format, compareDesc, parseISO } from 'date-fns'
import { chunk } from 'underscore'
import {
  Note,
  Table,
  Grid,
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

import useInfusions from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import {
  InfusionType,
  InfusionTypeEnum,
  deleteInfusion,
} from 'lib/db/infusions'
import { useAuth } from 'lib/auth'
import { filterInfusions } from 'lib/helpers'

interface InfusionTableProps {
  limit?: number
  uid?: string
  filterYear: string
}

enum infusionTypeBadgeStyle {
  BLEED = 'success',
  PROPHY = 'warning',
  PREVENTATIVE = 'error',
}

export default function InfusionTable(props: InfusionTableProps): JSX.Element {
  const { limit, uid, filterYear } = props
  const { data: infusions, status, error } = useInfusions(limit, uid)
  const [, setToast] = useToasts()
  const { user } = useAuth()
  const [pageNumber, setPageNumber] = useState(0)

  const filteredInfusions = filterInfusions(infusions, filterYear)

  let chunkedInfusions: InfusionType[][] | null = null

  // TODO: fix this so that the page updates correctly
  if (filteredInfusions) {
    if (filteredInfusions.length) {
      chunkedInfusions = chunk(filteredInfusions, 10)
    } else {
      chunkedInfusions = [[]]
    }
  }

  // NOTE: If user removes enough infusions to empty the current chunk,
  // change the page number to prevent pageNumber being out of bounds.
  useEffect(() => {
    if (chunkedInfusions) {
      if (pageNumber >= chunkedInfusions.length) {
        setPageNumber(chunkedInfusions.length - 1)
      }
    }
  }, [chunkedInfusions, pageNumber])

  if (status === FirestoreStatusType.LOADING || !chunkedInfusions) {
    return (
      <>
        <Table data={[]} width='100%'>
          <Table.Column prop='date' label='Date' />
          <Table.Column prop='type' label='Reason' />
          <Table.Column prop='sites' label='Bleed sites' />
          <Table.Column prop='cause' label='Cause' />
          <Table.Column prop='factorBrand' label='Factor' />
          <Table.Column prop='units' label='Amount' />
        </Table>
        <Spacer h={2} />
        <Grid.Container>
          <Loading>Loading infusion data</Loading>
        </Grid.Container>
      </>
    )
  }

  if (error) {
    return (
      <Note type='error' label='Error'>
        Oops, the database didn’t respond. Refresh the page to try again.
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

    const parsedDate = parseISO(infusion.date)
    const date = format(parsedDate, 'MM/dd/yyyy')

    const type = (
      <Badge type={infusionTypeBadgeStyle[infusion.type]}>
        {InfusionTypeEnum[infusion.type]}
      </Badge>
    )
    const factorBrand = infusion.medication.brand
    const units = infusion.medication.units && `${infusion.medication.units} iu`

    const remove = (
      <>
        <Tooltip
          text='This is permanent and cannot be undone.'
          placement='left'
        >
          <Button scale={0.25} onClick={() => deleteRow(infusion.uid!)} auto>
            Delete
          </Button>
        </Tooltip>
      </>
    )

    return { date, type, sites, cause, factorBrand, units, remove }
  }

  // TODO(michael) add more sorting filters
  // sort by date, most recent at the top
  chunkedInfusions[pageNumber]?.sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date))
  )

  const rowData = chunkedInfusions[pageNumber]?.map((infusion) =>
    formatInfusionRow(infusion)
  )

  // only shows delete when the logged in user is viewing their own data
  let isLoggedInUser = false
  if (user) {
    if (!uid) {
      isLoggedInUser = true
    }

    if (uid && uid === user.uid) {
      isLoggedInUser = true
    }
  }

  return (
    <StyledTableWrapper>
      <Table
        data={rowData}
        width='100%'
        hover={false}
        // TODO(michael) add the ability to update logs
        // onRow={(row) => updateRow(row.uid)}
      >
        <Table.Column prop='date' label='Date' />
        <Table.Column prop='type' label='Reason' />
        <Table.Column prop='sites' label='Bleed sites' />
        <Table.Column prop='cause' label='Cause' />
        <Table.Column prop='factorBrand' label='Factor' />
        <Table.Column prop='units' label='Amount' />
        {isLoggedInUser && <Table.Column prop='remove' />}
      </Table>
      {chunkedInfusions && !chunkedInfusions.length && (
        <>
          <Spacer />
          <Note type='success'>
            No infusions found. Add one by clicking ’Log Infusion’ above.
          </Note>
          <Spacer />
        </>
      )}
      <>
        <Spacer h={0.5} />
        <Grid.Container justify='flex-end'>
          <Pagination
            count={chunkedInfusions.length}
            initialPage={1}
            page={
              pageNumber + 1 > chunkedInfusions.length
                ? chunkedInfusions.length
                : pageNumber + 1
            }
            onChange={(page) => setPageNumber(page - 1)}
          >
            <Pagination.Next
              disabled={pageNumber + 1 >= chunkedInfusions.length}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <ChevronRight />
            </Pagination.Next>
            <Pagination.Previous
              disabled={pageNumber + 1 <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <ChevronLeft />
            </Pagination.Previous>
          </Pagination>
        </Grid.Container>
      </>
    </StyledTableWrapper>
  )
}

const StyledTableWrapper = styled.div`
  overflow-x: scroll;
`
