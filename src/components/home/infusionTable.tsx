'use client'

import { IconChevronDown, IconChevronUp, IconDots } from '@tabler/icons-react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { type TreatmentType, TreatmentTypeEnum } from '@/lib/db/infusions'
import { filterInfusions } from '@/lib/helpers'
import { useInfusionMutations } from '@/lib/hooks/useInfusionMutations'
import { useInfusionsQuery } from '@/lib/hooks/useInfusionsQuery'
import InfusionModal from './infusionModal'

interface InfusionTableProps {
  limit?: number
  uid?: string
  filterYear: string
}

export default function InfusionTable(props: InfusionTableProps): JSX.Element {
  const { limit, uid, filterYear } = props
  const {
    data: infusions,
    isLoading,
    isError,
    error,
  } = useInfusionsQuery({ limit, uid })
  const { user } = useAuth()
  const { deleteInfusion } = useInfusionMutations()
  const [selectedInfusion, setSelectedInfusion] = useState<TreatmentType>()
  const [infusionModal, setInfusionModal] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ])

  const filteredInfusions = filterInfusions(infusions, filterYear)

  // Determine if user can edit/delete treatments
  const isLoggedInUser = user && (!uid || uid === user.uid)

  // Delete function - memoized to prevent column recreation
  const deleteRow = useCallback(
    (infusionUid: string) => {
      deleteInfusion({ uid: infusionUid, userUid: user?.uid || '' })
    },
    [deleteInfusion, user?.uid]
  )

  // Column definitions - memoized to prevent recreation on every render
  const columns: ColumnDef<TreatmentType>[] = useMemo(() => {
    const baseColumns: ColumnDef<TreatmentType>[] = [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => {
          const dateString = getValue() as string
          const parsedDate = parseISO(dateString)
          return format(parsedDate, 'MM/dd/yyyy')
        },
        sortingFn: (rowA, rowB) => {
          const dateA = parseISO(rowA.getValue('date') as string)
          const dateB = parseISO(rowB.getValue('date') as string)
          return dateA.getTime() - dateB.getTime()
        },
      },
      {
        accessorKey: 'type',
        header: 'Reason',
        cell: ({ getValue }) => {
          const type = getValue() as TreatmentTypeEnum
          const badgeStyles = {
            [TreatmentTypeEnum.BLEED]: 'bg-red-100 text-red-800',
            [TreatmentTypeEnum.PROPHY]: 'bg-yellow-100 text-yellow-800',
            [TreatmentTypeEnum.PREVENTATIVE]: 'bg-orange-100 text-orange-800',
            [TreatmentTypeEnum.ANTIBODY]: 'bg-gray-100 text-gray-800',
          }

          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${badgeStyles[type] || 'bg-gray-100 text-gray-800'}`}
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
        header: 'Factor',
        cell: ({ row }) => row.original.medication.brand,
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

    // Add actions column for logged-in users
    if (isLoggedInUser) {
      baseColumns.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const infusion = row.original
          return (
            <div className='relative'>
              <button
                type='button'
                className='p-1 text-gray-400 hover:text-gray-600'
                onClick={() => {
                  // Simple dropdown implementation
                  const menu = document.createElement('div')
                  menu.innerHTML = `
                    <div class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-action="edit">
                        Update
                      </button>
                      <button class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" data-action="delete">
                        Delete
                      </button>
                    </div>
                  `
                  menu.style.position = 'absolute'
                  menu.style.right = '0'
                  menu.style.top = '100%'
                  menu.style.zIndex = '50'

                  // Handle clicks
                  const editBtn = menu.querySelector(
                    '[data-action="edit"]'
                  ) as HTMLButtonElement
                  const deleteBtn = menu.querySelector(
                    '[data-action="delete"]'
                  ) as HTMLButtonElement

                  editBtn.onclick = () => {
                    setSelectedInfusion(infusion)
                    setInfusionModal(true)
                    document.body.removeChild(menu)
                  }

                  deleteBtn.onclick = () => {
                    if (infusion.uid) {
                      deleteRow(infusion.uid)
                    }
                    document.body.removeChild(menu)
                  }

                  // Close on outside click
                  const closeMenu = (e: MouseEvent) => {
                    if (!menu.contains(e.target as Node)) {
                      document.body.removeChild(menu)
                      document.removeEventListener('click', closeMenu)
                    }
                  }

                  document.body.appendChild(menu)
                  setTimeout(
                    () => document.addEventListener('click', closeMenu),
                    0
                  )
                }}
              >
                <IconDots size={16} />
              </button>
            </div>
          )
        },
      })
    }

    return baseColumns
  }, [isLoggedInUser, deleteRow])

  // Create the table instance - must be called before any early returns
  const table = useReactTable({
    data: filteredInfusions,
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
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
        <div className='font-semibold text-gray-800 mb-1'>
          No treatment data available
        </div>
        <div className='text-gray-700'>
          User information is not available to load treatments.
        </div>
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
    console.error('Error fetching infusions:', error)
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <div className='font-semibold text-red-800 mb-1'>Error</div>
        <div className='text-red-700'>
          Oops, the database didn't respond. Refresh the page to try again.
        </div>
      </div>
    )
  }

  // Show empty state if query completed successfully but no treatments found
  if (!infusions || infusions.length === 0) {
    const emptyMessage = isLoggedInUser
      ? "You haven't logged any treatments yet. Add one by clicking 'New Treatment' above."
      : 'This person has not logged any treatments yet.'

    return (
      <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
        <div className='font-semibold text-green-800 mb-1'>
          No treatment data available
        </div>
        <div className='text-green-700'>{emptyMessage}</div>
      </div>
    )
  }

  return (
    <>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
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
          <tbody className='bg-white divide-y divide-gray-200'>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-6 py-12 text-center text-gray-500'
                >
                  <div className='bg-green-50 border border-green-200 rounded-lg p-4 inline-block'>
                    <div className='font-semibold text-green-800 mb-1'>
                      No treatments found
                    </div>
                    <div className='text-green-700'>
                      {isLoggedInUser
                        ? "Add one by clicking 'New Treatment' above."
                        : 'This person has not logged any treatments yet.'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className='hover:bg-gray-50'>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
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
        {filteredInfusions.length > 25 && (
          <div className='flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200'>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <span className='text-sm text-gray-700'>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <button
                type='button'
                className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
            <div className='text-sm text-gray-700'>
              Showing {table.getRowModel().rows.length} of{' '}
              {filteredInfusions.length} treatments
            </div>
          </div>
        )}
      </div>

      {isLoggedInUser && (
        <InfusionModal
          infusion={selectedInfusion}
          visible={infusionModal}
          setVisible={setInfusionModal}
          bindings={{}}
        />
      )}
    </>
  )
}
