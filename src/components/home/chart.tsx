import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useInfusionsQuery } from '@/lib/hooks/useInfusionsQuery'
import { filterInfusions } from '@/lib/helpers'
import { TreatmentTypeEnum } from '@/lib/db/infusions'

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

export default function Chart(props: ChartProps): JSX.Element | null {
  const { filterYear } = props
  const { data } = useInfusionsQuery()

  if (!data) {
    return null
  }

  const filteredInfusions = filterInfusions(data, filterYear)

  const bleeds = filteredInfusions
    .filter((entry) => entry.type === TreatmentTypeEnum.BLEED)
    .map((bleed) => bleed.date)

  const preventative = filteredInfusions
    .filter((entry) => entry.type === TreatmentTypeEnum.PREVENTATIVE)
    .map((preventitive) => preventitive.date)

  const prophy = filteredInfusions
    .filter((entry) => entry.type === TreatmentTypeEnum.PROPHY)
    .map((prophy) => prophy.date)

  const antibody = filteredInfusions
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

  // Distribute infusions into months
  type NumericChartKeys = 'bleed' | 'preventative' | 'prophy' | 'antibody'
  const distributeInfusions = (infusions: string[], type: NumericChartKeys) => {
    for (const infusion of infusions) {
      // Extract month from YYYY-MM-DD format (zero-based index)
      const monthIndex = Number.parseInt(infusion.split('-')[1], 10) - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        chartData[monthIndex][type] = chartData[monthIndex][type] + 1
      }
    }
  }

  distributeInfusions(bleeds, 'bleed')
  distributeInfusions(preventative, 'preventative')
  distributeInfusions(prophy, 'prophy')
  distributeInfusions(antibody, 'antibody')

  // Calculate max Y value for proper scaling
  const maxY = Math.max(
    ...chartData.map(
      (entry) =>
        entry.bleed + entry.preventative + entry.prophy + entry.antibody
    ),
    1
  )

  return (
    <div className='w-full relative'>
      <ResponsiveContainer width='100%' height={240}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis domain={[0, maxY]} />
          <Bar dataKey='bleed' stackId='a' fill='#FF062C' />
          <Bar dataKey='preventative' stackId='a' fill='#48BB78' />
          <Bar dataKey='prophy' stackId='a' fill='#0070F3' />
          <Bar dataKey='antibody' stackId='a' fill='#333333' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
