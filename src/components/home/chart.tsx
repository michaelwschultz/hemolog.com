import type { ReactElement } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
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

export default function Chart(props: ChartProps): ReactElement | null {
  const { filterYear } = props
  const { data } = useTreatmentsQuery()

  if (!data) {
    return null
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

  return (
    <div className='surface w-full px-2 pt-4 pb-3 sm:px-4'>
      <ResponsiveContainer width='100%' height={240}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke='#E2E6EB' vertical={false} />
          <XAxis
            dataKey='month'
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#5A6470', fontSize: 12 }}
          />
          <YAxis
            domain={[0, maxY]}
            axisLine={false}
            tickLine={false}
            width={28}
            tick={{ fill: '#5A6470', fontSize: 12 }}
          />
          <Bar dataKey='bleed' stackId='a' fill='#FF062C' />
          <Bar dataKey='preventative' stackId='a' fill='#2F9A5A' />
          <Bar dataKey='prophy' stackId='a' fill='#3D78D0' />
          <Bar dataKey='antibody' stackId='a' fill='#8B93A0' />
        </BarChart>
      </ResponsiveContainer>
      <div className='flex flex-wrap gap-x-4 gap-y-2 px-2 pt-1 pb-2 text-xs text-slate'>
        <span className='inline-flex items-center gap-1.5'>
          <span className='h-2 w-2 rounded-full bg-primary-500' />
          Bleed
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <span className='h-2 w-2 rounded-full bg-success-500' />
          Preventative
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <span className='h-2 w-2 rounded-full bg-warning-500' />
          Prophy
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <span className='h-2 w-2 rounded-full bg-[#8B93A0]' />
          Antibody
        </span>
      </div>
    </div>
  )
}
