import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TreatmentTypeEnum } from '@/lib/db/treatments'
import { filterTreatments } from '@/lib/helpers'
import { useTreatmentsQuery } from '@/lib/hooks/useTreatmentsQuery'

type ChartDataEntry = {
  month: string
  bleed: number
  preventative: number
  prophy: number
  antibody: number
}

interface ChartProps {
  filterYear: string
}

// Custom tooltip component for the chart
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white border border-gray-100 rounded-lg shadow-lg p-3'>
        <p className='font-semibold text-gray-900 text-sm mb-2'>{label}</p>
        {payload.map((entry) => (
          <p
            key={entry.name}
            className='text-xs'
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Chart(props: ChartProps) {
  const { filterYear } = props
  const { data, isLoading } = useTreatmentsQuery()

  if (isLoading || !data) {
    return (
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
        <div className='animate-pulse'>
          <div className='h-6 w-32 bg-gray-100 rounded mb-4'></div>
          <div className='h-60 bg-gray-50 rounded-lg'></div>
        </div>
      </div>
    )
  }

  const filteredTreatments = filterTreatments(data, filterYear)

  const bleeds = filteredTreatments
    .filter((entry) => entry.type === TreatmentTypeEnum.BLEED)
    .map((bleed) => bleed.date)

  const preventative = filteredTreatments
    .filter((entry) => entry.type === TreatmentTypeEnum.PREVENTATIVE)
    .map((preventitive) => preventitive.date)

  const prophy = filteredTreatments
    .filter((entry) => entry.type === TreatmentTypeEnum.PROPHY)
    .map((prophy) => prophy.date)

  const antibody = filteredTreatments
    .filter((entry) => entry.type === TreatmentTypeEnum.ANTIBODY)
    .map((antibody) => antibody.date)

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  // Initialize chart data with all months
  const chartData: ChartDataEntry[] = monthNames.map((month) => ({
    month,
    bleed: 0,
    preventative: 0,
    prophy: 0,
    antibody: 0,
  }))

  // Distribute treatments into months
  type NumericChartKeys = 'bleed' | 'preventative' | 'prophy' | 'antibody'
  const distributeTreatments = (
    treatments: string[],
    type: NumericChartKeys
  ) => {
    for (const treatment of treatments) {
      // Extract month from YYYY-MM-DD format (zero-based index)
      const monthIndex = Number.parseInt(treatment.split('-')[1], 10) - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        chartData[monthIndex][type] = chartData[monthIndex][type] + 1
      }
    }
  }

  distributeTreatments(bleeds, 'bleed')
  distributeTreatments(preventative, 'preventative')
  distributeTreatments(prophy, 'prophy')
  distributeTreatments(antibody, 'antibody')

  // Calculate max Y value for proper scaling
  const maxY = Math.max(
    ...chartData.map(
      (entry) =>
        entry.bleed + entry.preventative + entry.prophy + entry.antibody
    ),
    1
  )

  // Color palette matching the new aesthetic
  const colors = {
    bleed: '#ef4444', // red-500
    preventative: '#eab308', // yellow-500
    prophy: '#3b82f6', // blue-500
    antibody: '#22c55e', // green-500
  }

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
      <h3 className='text-base font-semibold text-gray-900 mb-4'>
        Treatments by Month
      </h3>
      <div className='w-full relative'>
        <ResponsiveContainer width='100%' height={240}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f3f4f6'
              vertical={false}
            />
            <XAxis
              dataKey='month'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={[0, maxY]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey='bleed'
              stackId='a'
              fill={colors.bleed}
              radius={[0, 0, 0, 0]}
              name='Bleed'
            />
            <Bar
              dataKey='preventative'
              stackId='a'
              fill={colors.preventative}
              radius={[0, 0, 0, 0]}
              name='Preventative'
            />
            <Bar
              dataKey='prophy'
              stackId='a'
              fill={colors.prophy}
              radius={[0, 0, 0, 0]}
              name='Prophy'
            />
            <Bar
              dataKey='antibody'
              stackId='a'
              fill={colors.antibody}
              radius={[2, 2, 0, 0]}
              name='Antibody'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className='flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-50'>
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-sm'
            style={{ backgroundColor: colors.bleed }}
          ></div>
          <span className='text-xs text-gray-500'>Bleed</span>
        </div>
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-sm'
            style={{ backgroundColor: colors.preventative }}
          ></div>
          <span className='text-xs text-gray-500'>Preventative</span>
        </div>
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-sm'
            style={{ backgroundColor: colors.prophy }}
          ></div>
          <span className='text-xs text-gray-500'>Prophy</span>
        </div>
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-sm'
            style={{ backgroundColor: colors.antibody }}
          ></div>
          <span className='text-xs text-gray-500'>Antibody</span>
        </div>
      </div>
    </div>
  )
}
