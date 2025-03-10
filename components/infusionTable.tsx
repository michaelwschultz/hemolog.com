import styled from 'styled-components'
import useInfusions from 'lib/hooks/useInfusions'
import { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'
import { format, parseISO } from 'date-fns'
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
  useModal,
  Popover,
} from '@geist-ui/react'
import ChevronRight from '@geist-ui/react-icons/chevronRight'
import ChevronLeft from '@geist-ui/react-icons/chevronLeft'
import MoreHorizontal from '@geist-ui/react-icons/moreHorizontal'
import {
  type TreatmentType,
  TreatmentTypeEnum,
  deleteInfusion,
} from 'lib/db/infusions'
import { useAuth } from 'lib/auth'
import { filterInfusions } from 'lib/helpers'
import InfusionModal from './infusionModal'
import { useState } from 'react'

interface InfusionTableProps {
  limit?: number
  uid?: string
  filterYear: string
}

enum infusionTypeBadgeStyle {
  BLEED = 'success',
  PROPHY = 'warning',
  PREVENTATIVE = 'error',
  ANTIBODY = 'secondary',
}

export default function InfusionTable(props: InfusionTableProps): JSX.Element {
  const { limit, uid, filterYear } = props
  const { data: infusions, status, error } = useInfusions(limit, uid)
  const [, setToast] = useToasts()
  const { user } = useAuth()
  const [selectedInfusion, setSelectedInfusion] = useState<TreatmentType>()

  const {
    visible: infusionModal,
    setVisible: setInfusionModalVisible,
    bindings: infusionModalBindings,
  } = useModal(false)

  const filteredInfusions = filterInfusions(infusions, filterYear)

  // useEffect(() => {
  //   // TODO: Replace this with lodash solution
  //   // chunk data in sets of 25
  //   if (filteredInfusions) {
  //     const chunkedInfusions = chunk(filteredInfusions, 25)
  //     setChunkedInfusions(chunkedInfusions)
  //   }
  // }, [filteredInfusions])

  if (status === FirestoreStatusType.LOADING) {
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
          text: 'Treatment deleted.',
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

  function formatInfusionRow(infusion: TreatmentType) {
    const { cause, sites, uid } = infusion

    const parsedDate = parseISO(infusion.date)
    const date = format(parsedDate, 'MM/dd/yyyy')

    const type = (
      <Badge type={infusionTypeBadgeStyle[infusion.type]}>
        {TreatmentTypeEnum[infusion.type]}
      </Badge>
    )
    const factorBrand = infusion.medication.brand
    const units = infusion.medication.units && `${infusion.medication.units} iu`

    const moreMenu = () => {
      const content = (
        <>
          <Popover.Item>
            <Button
              scale={0.5}
              onClick={() => {
                setSelectedInfusion(infusion)
                setInfusionModalVisible(true)
              }}
              auto
            >
              Update
            </Button>
          </Popover.Item>
          <Popover.Item>
            <Tooltip
              text='This is permanent and cannot be undone.'
              placement='left'
            >
              <Button
                scale={0.5}
                onClick={() => infusion.uid && deleteRow(infusion.uid)}
                auto
                type='success-light'
              >
                Delete
              </Button>
            </Tooltip>
          </Popover.Item>
        </>
      )

      return (
        <Popover content={content as any} style={{ cursor: 'pointer' }}>
          <MoreHorizontal />
        </Popover>
      )
    }

    return {
      uid,
      date,
      type,
      sites,
      cause,
      factorBrand,
      units,
      moreMenu: moreMenu(),
    }
  }

  // TODO(michael) add more sorting filters
  // sort by date, most recent at the top
  filteredInfusions.sort((a, b) => b.date.localeCompare(a.date))

  const rowData = filteredInfusions.map((infusion) =>
    formatInfusionRow(infusion)
  )

  // only shows more menu when the logged in user is viewing their own data
  let isLoggedInUser = false
  if (user) {
    if (!uid) {
      isLoggedInUser = true
    }

    // if (uid && uid === user.uid) {
    //   isLoggedInUser = true
    // }
  }

  return (
    <>
      <StyledTableWrapper>
        <Table data={rowData} width='100%' hover={false}>
          <Table.Column prop='date' label='Date' />
          <Table.Column prop='type' label='Reason' />
          <Table.Column prop='sites' label='Bleed sites' />
          <Table.Column prop='cause' label='Cause' />
          <Table.Column prop='factorBrand' label='Factor' />
          <Table.Column prop='units' label='Amount' />
          {isLoggedInUser && <Table.Column prop='moreMenu' />}
        </Table>
        {filteredInfusions.length === 0 && (
          <>
            <Spacer />
            <Note type='success'>
              No treatments found. Add one by clicking ’New Treatment’ above.
            </Note>
            <Spacer />
          </>
        )}
        {filteredInfusions.length >= 25 && (
          <>
            <Spacer h={0.5} />
            <Grid.Container justify='flex-end'>
              <Pagination count={1}>
                <Pagination.Next>
                  <ChevronRight />
                </Pagination.Next>
                <Pagination.Previous>
                  <ChevronLeft />
                </Pagination.Previous>
              </Pagination>
            </Grid.Container>
          </>
        )}
      </StyledTableWrapper>
      {isLoggedInUser && (
        <InfusionModal
          infusion={selectedInfusion}
          visible={infusionModal}
          setVisible={setInfusionModalVisible}
          bindings={infusionModalBindings}
        />
      )}
    </>
  )
}

const StyledTableWrapper = styled.div`
  overflow-x: scroll;
`
