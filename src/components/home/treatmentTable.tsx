'use client'

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth'
import { type TreatmentType, TreatmentTypeEnum } from '@/lib/db/treatments'
import { filterTreatments } from '@/lib/helpers'
import { useTreatmentMutations } from '@/lib/hooks/useTreatmentMutations'
import { useTreatmentSheet } from '@/lib/hooks/useTreatmentSheet'
import { useTreatmentsQuery } from '@/lib/hooks/useTreatmentsQuery'
import ActionMenu from './actionMenu'

interface TreatmentTableProps {
  limit?: number
  uid?: string
  filterYear: string
}

export default function TreatmentTable(
  props: TreatmentTableProps
): ReactElement {
  const { limit, uid, filterYear } = props
  const {
    data: treatments,
    isLoading,
    isError,
    error,
  } = useTreatmentsQuery({ limit, uid })

  const { user } = useAuth()
  const { deleteTreatment } = useTreatmentMutations()
  const { openTreatmentSheet } = useTreatmentSheet()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ])

  const filteredTreatments = filterTreatments(treatments, filterYear)

  // Determine if user can edit/delete treatments
  const isLoggedInUser = user && (!uid || uid === user.uid)

  // Delete function - React 19 compiler handles memoization automatically
  const deleteRow = (treatmentUid: string) => {
    deleteTreatment({ uid: treatmentUid, userUid: user?.uid || '' })
  }

  // Edit function - React 19 compiler handles memoization automatically
  const editRow = (treatment: TreatmentType) => {
    // Prevent editing treatments without a uid (shouldn't happen, but safety check)
    if (!treatment.uid) {
      toast.error('Cannot edit treatment: missing database ID')
      return
    }
    openTreatmentSheet({
      mode: 'edit',
      treatment,
      previousTreatment: treatments?.[0],
    })
  }

  // Column definitions - React 19 compiler handles memoization automatically
  // biome-ignore lint/correctness/useExhaustiveDependencies: will cause infinite loop
  const columns: ColumnDef<TreatmentType>[] = useMemo(() => {
    const baseColumns: ColumnDef<TreatmentType>[] = [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => {
          const dateString = getValue() as string
          try {
            const parsedDate = parseISO(dateString)
            return (
              <span className='font-mono text-[13px]'>
                {format(parsedDate, 'MMM d, yyyy')}
              </span>
            )
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error(error.message)
            } else {
              toast.error('Error parsing date')
            }
          }
        },
        sortingFn: (rowA: Row<TreatmentType>, rowB: Row<TreatmentType>) => {
          try {
            const dateA = parseISO(rowA.getValue('date') as string)
            const dateB = parseISO(rowB.getValue('date') as string)
            return dateA.getTime() - dateB.getTime()
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error(error.message)
            } else {
              toast.error('Error sorting dates')
            }
            return 0 // Return 0 to indicate equal when parsing fails
          }
        },
      },
      {
        accessorKey: 'type',
        header: 'Reason',
        cell: ({ getValue }) => {
          const type = getValue() as TreatmentTypeEnum
          const badgeStyles = {
            [TreatmentTypeEnum.BLEED]: 'bg-primary-50 text-primary-800',
            [TreatmentTypeEnum.PROPHY]: 'bg-warning-50 text-warning-800',
            [TreatmentTypeEnum.PREVENTATIVE]: 'bg-success-50 text-success-800',
            [TreatmentTypeEnum.ANTIBODY]: 'bg-paper text-slate',
          }

          return (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${badgeStyles[type] || 'bg-paper text-slate'}`}
            >
              {TreatmentTypeEnum[type]}
            </span>
          )
        },
      },
      {
        accessorKey: 'sites',
        header: 'Bleed sites',
      },
      {
        accessorKey: 'cause',
        header: 'Cause',
      },
      {
        accessorKey: 'medication.brand',
        header: 'Medication',
        cell: ({ row }) => row.original.medication.brand,
      },
      {
        accessorKey: 'medication.units',
        header: 'Amount',
        cell: ({ getValue }) => {
          const units = getValue() as number
          return units ? (
            <span className='font-mono text-[13px]'>{units} iu</span>
          ) : (
            ''
          )
        },
      },
    ]

    if (isLoggedInUser) {
      baseColumns.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const treatment = row.original
          return (
            <ActionMenu
              treatment={treatment}
              onEdit={editRow}
              onDelete={deleteRow}
            />
          )
        },
      })
    }

    return baseColumns
  }, [isLoggedInUser])

  const table = useReactTable({
    data: filteredTreatments,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  })

  // Handle case where uid is not available
  if (!uid && !user?.uid) {
    return (
      <div className='note'>
        <div className='note-title'>No treatment data</div>
        <p className='text-sm text-slate'>
          User information is not available to load treatments.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='overflow-x-auto'>
        <div className='animate-pulse'>
          <div className='h-12 bg-gray-200 rounded mb-4'></div>
          <div className='h-16 bg-gray-100 rounded mb-2'></div>
          <div className='h-16 bg-gray-100 rounded mb-2'></div>
          <div className='h-16 bg-gray-100 rounded mb-2'></div>
          <div className='h-16 bg-gray-100 rounded mb-2'></div>
          <div className='h-16 bg-gray-100 rounded mb-2'></div>
        </div>
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500'></div>
          <span className='ml-3 text-gray-600'>Loading treatment data</span>
        </div>
      </div>
    )
  }

  if (isError || error) {
    console.error('Error fetching treatments:', error)
    return (
      <div className='note note-urgent'>
        <div className='note-title'>Couldn't load treatments</div>
        <p className='text-sm text-slate'>
          The database didn't respond. Refresh the page to try again.
        </p>
      </div>
    )
  }

  // Show empty state if query completed successfully but no treatments found
  if (!treatments || treatments.length === 0) {
    const emptyMessage = isLoggedInUser
      ? "You haven't logged any treatments yet. Add one with New treatment above."
      : 'This person has not logged any treatments yet.'

    return (
      <div className='note'>
        <div className='note-title'>No treatments yet</div>
        <p className='text-sm text-slate'>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className='overflow-x-auto rounded-2xl border border-line bg-white'>
      <table className='min-w-full divide-y divide-line'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wide text-slate uppercase hover:text-ink sm:px-5'
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className='flex items-center gap-1'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === 'asc' && (
                      <IconChevronUp size={14} />
                    )}
                    {header.column.getIsSorted() === 'desc' && (
                      <IconChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='divide-y divide-line bg-white'>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className='px-6 py-12 text-center text-slate'
              >
                <div className='note inline-block text-left'>
                  <div className='note-title'>No treatments this year</div>
                  <p className='text-sm text-slate'>
                    {isLoggedInUser
                      ? 'Add one with New treatment above, or choose another year.'
                      : 'This person has not logged any treatments yet.'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='hover:bg-paper'>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='px-4 py-3 text-sm whitespace-nowrap text-ink sm:px-5 sm:py-3.5'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredTreatments.length > 25 && (
        <div className='flex flex-col gap-3 border-t border-line bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5'>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              className='btn btn-secondary btn-sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <span className='font-mono text-xs text-slate'>
              {table.getState().pagination.pageIndex + 1} /{' '}
              {table.getPageCount()}
            </span>
            <button
              type='button'
              className='btn btn-secondary btn-sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
          <div className='text-sm text-slate'>
            Showing {table.getRowModel().rows.length} of{' '}
            {filteredTreatments.length} treatments
          </div>
        </div>
      )}
    </div>
  )
}
