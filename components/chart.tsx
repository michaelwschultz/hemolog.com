import {
  FlexibleWidthXYPlot,
  VerticalBarSeries,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from 'react-vis'
import { getMonth } from 'date-fns'
import useInfusions from 'lib/hooks/useInfusions'
import { filterInfusions } from 'lib/helpers'

type ChartEntry = {
  x: string
  y: number
}

interface ChartProps {
  filterYear: string
}

export default function Chart(props: ChartProps): JSX.Element {
  const { filterYear } = props
  const { data } = useInfusions()

  if (!data) {
    return <></>
  }

  const filteredInfusions = filterInfusions(data, filterYear)

  const bleeds = filteredInfusions
    .filter((entry) => entry.type === 'BLEED')
    .map((bleed) => bleed.date)

  const preventative = filteredInfusions
    .filter((entry) => entry.type === 'PREVENTATIVE')
    .map((preventitive) => preventitive.date)

  const prophy = filteredInfusions
    .filter((entry) => entry.type === 'PROPHY')
    .map((prophy) => prophy.date)

  const chartSchema: ChartEntry[] = [
    { x: 'Jan', y: 0 },
    { x: 'Feb', y: 0 },
    { x: 'Mar', y: 0 },
    { x: 'Apr', y: 0 },
    { x: 'May', y: 0 },
    { x: 'Jun', y: 0 },
    { x: 'Jul', y: 0 },
    { x: 'Aug', y: 0 },
    { x: 'Sep', y: 0 },
    { x: 'Oct', y: 0 },
    { x: 'Nov', y: 0 },
    { x: 'Dec', y: 0 },
  ]

  // clones array using value rather than reference
  const bleedData = JSON.parse(JSON.stringify(chartSchema))
  const preventativeData = JSON.parse(JSON.stringify(chartSchema))
  const prophyData = JSON.parse(JSON.stringify(chartSchema))

  // distribute infusions into months
  const distributeInfusions = (infusions: string[], data: ChartEntry[]) => {
    infusions.forEach((infusion) => {
      const date = new Date(infusion)
      const monthIndex = getMonth(date)
      data[monthIndex].y = data[monthIndex].y + 1
    })
  }

  distributeInfusions(bleeds, bleedData)
  distributeInfusions(preventative, preventativeData)
  distributeInfusions(prophy, prophyData)

  // determine the highest number of grouped infunsions to
  // create a max value used to set the height of the chart
  const bleedNumbers = bleedData.map((infusion: ChartEntry) => infusion.y)
  const preventativeNumbers = preventativeData.map(
    (infusion: ChartEntry) => infusion.y
  )
  const prophyNumbers = prophyData.map((infusion: ChartEntry) => infusion.y)

  const largestNumberOfBleeds = Math.max(...bleedNumbers)
  const largestNumberOfPreventative = Math.max(...preventativeNumbers)
  const largestNumberOfProphy = Math.max(...prophyNumbers)

  const maxY =
    largestNumberOfBleeds + largestNumberOfPreventative + largestNumberOfProphy

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <FlexibleWidthXYPlot
        height={240}
        xType='ordinal'
        stackBy='y'
        style={{ width: '100% !important', position: 'relative' }}
      >
        <HorizontalGridLines tickTotal={maxY} />
        <VerticalBarSeries color='#FF062C' barWidth={0.3} data={bleedData} />
        <VerticalBarSeries
          color='#48BB78'
          barWidth={0.3}
          data={preventativeData}
        />
        <VerticalBarSeries color='#0070F3' barWidth={0.3} data={prophyData} />
        <XAxis attr='x' attrAxis='y' orientation='bottom' />
        <YAxis attr='y' attrAxis='x' orientation='left' tickTotal={maxY} />
      </FlexibleWidthXYPlot>
    </div>
  )
}
