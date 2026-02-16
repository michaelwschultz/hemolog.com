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
import { useCallback, useMemo, useRef, useState } from 'react'
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

export default function TreatmentTable(props: TreatmentTableProps) {
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

  const filteredTreatments = useMemo(
    () => filterTreatments(treatments, filterYear),
    [treatments, filterYear]
  )

  // Determine if user can edit/delete treatments
  const isLoggedInUser = user && (!uid || uid === user.uid)

  // Store treatments in ref to avoid recreating handlers when treatments change
  const treatmentsRef = useRef(treatments)
  treatmentsRef.current = treatments

  // Store user in ref to avoid recreating handlers when user changes
  const userRef = useRef(user)
  userRef.current = user

  // Store deleteTreatment in ref to avoid recreating deleteRow
  const deleteTreatmentRef = useRef(deleteTreatment)
  deleteTreatmentRef.current = deleteTreatment

  // Store openTreatmentSheet in ref to avoid recreating editRow
  const openTreatmentSheetRef = useRef(openTreatmentSheet)
  openTreatmentSheetRef.current = openTreatmentSheet

  // Memoize delete function
  const deleteRow = useCallback((treatmentUid: string) => {
    deleteTreatmentRef.current({
      uid: treatmentUid,
      userUid: userRef.current?.uid || '',
    })
  }, [])

  // Memoize edit function
  const editRow = useCallback((treatment: TreatmentType) => {
    // Prevent editing treatments without a uid (shouldn't happen, but safety check)
    if (!treatment.uid) {
      toast.error('Cannot edit treatment: missing database ID')
      return
    }
    openTreatmentSheetRef.current({
      mode: 'edit',
      treatment,
      previousTreatment: treatmentsRef.current?.[0],
    })
  }, [])

  // Column definitions
  // biome-ignore lint/correctness/useExhaustiveDependencies: editRow and deleteRow are stable refs
  const columns: ColumnDef<TreatmentType>[] = useMemo(() => {
    const baseColumns: ColumnDef<TreatmentType>[] = [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => {
          const dateString = getValue() as string
          try {
            const parsedDate = parseISO(dateString)
            return format(parsedDate, 'MM/dd/yyyy')
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
            [TreatmentTypeEnum.BLEED]: 'bg-red-50 text-red-700 border-red-100',
            [TreatmentTypeEnum.PROPHY]:
              'bg-amber-50 text-amber-700 border-amber-100',
            [TreatmentTypeEnum.PREVENTATIVE]:
              'bg-orange-50 text-orange-700 border-orange-100',
            [TreatmentTypeEnum.ANTIBODY]:
              'bg-gray-50 text-gray-700 border-gray-100',
          }

          return (
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-md border ${badgeStyles[type] || 'bg-gray-50 text-gray-700 border-gray-100'}`}
            >
              {TreatmentTypeEnum[type]}
            </span>
          )
        },
      },
      {
        accessorKey: 'medication.brand',
        header: 'Medication',
        cell: ({ row }) => row.original.medication.brand,
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
        accessorKey: 'medication.units',
        header: 'Amount',
        cell: ({ getValue }) => {
          const units = getValue() as number
          return units ? `${units} iu` : ''
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
      <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
        <div className='font-semibold text-gray-900 mb-1'>
          No treatment data available
        </div>
        <div className='text-gray-500'>
          User information is not available to load treatments.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='animate-pulse'>
          <div className='h-14 bg-gray-50 border-b border-gray-100'></div>
          <div className='p-4 space-y-3'>
            <div className='h-12 bg-gray-50 rounded-lg'></div>
            <div className='h-12 bg-gray-50 rounded-lg'></div>
            <div className='h-12 bg-gray-50 rounded-lg'></div>
            <div className='h-12 bg-gray-50 rounded-lg'></div>
            <div className='h-12 bg-gray-50 rounded-lg'></div>
          </div>
        </div>
        <div className='flex justify-center items-center py-8 gap-3'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500'></div>
          <span className='text-gray-500'>Loading treatment data</span>
        </div>
      </div>
    )
  }

  if (isError || error) {
    console.error('Error fetching treatments:', error)
    return (
      <div className='bg-white rounded-2xl border border-red-100 p-6 shadow-sm'>
        <div className='font-semibold text-red-800 mb-1'>Error</div>
        <div className='text-red-600'>
          Oops, the database didn't respond. Refresh the page to try again.
        </div>
      </div>
    )
  }

  // Show empty state if query completed successfully but no treatments found
  if (!treatments || treatments.length === 0) {
    const emptyMessage = isLoggedInUser
      ? "You haven't logged any treatments yet. Add one by clicking 'New Treatment' above."
      : 'This person has not logged any treatments yet.'

    return (
      <div className='bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm'>
        <div className='font-semibold text-emerald-800 mb-1'>
          No treatment data available
        </div>
        <div className='text-emerald-600'>{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-100'>
          <thead className='bg-gray-50/50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors'
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className='flex items-center gap-1.5'>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === 'asc' && (
                        <IconChevronUp size={14} className='text-gray-400' />
                      )}
                      {header.column.getIsSorted() === 'desc' && (
                        <IconChevronDown size={14} className='text-gray-400' />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='px-6 py-12 text-center'>
                  <div className='bg-emerald-50 border border-emerald-100 rounded-xl p-4 inline-block'>
                    <div className='font-semibold text-emerald-800 mb-1'>
                      No treatments found
                    </div>
                    <div className='text-emerald-600'>
                      {isLoggedInUser
                        ? "Add one by clicking 'New Treatment' above."
                        : 'This person has not logged any treatments yet.'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='hover:bg-gray-50/80 transition-colors'
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-4 py-3.5 whitespace-nowrap text-sm text-gray-700'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredTreatments.length > 25 && (
          <div className='flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-gray-100'>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <span className='text-sm text-gray-500'>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <button
                type='button'
                className='px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
            <div className='text-sm text-gray-500'>
              Showing {table.getRowModel().rows.length} of{' '}
              {filteredTreatments.length} treatments
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
